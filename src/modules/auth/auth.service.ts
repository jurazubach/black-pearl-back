import { Injectable } from '@nestjs/common';
import crypto from 'crypto';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { IJwtToken } from './auth.interfaces';
import dayjs from 'dayjs';

@Injectable()
export class AuthService {
  private readonly jwtSecret!: string;

  constructor(private readonly configService: ConfigService, private readonly jwtService: JwtService) {
    this.jwtSecret = this.configService.get<string>('JWT_SECRET', 'thisIsSecret');
  }

  generateRandomSalt() {
    return crypto.randomBytes(16).toString('hex');
  }

  generatePasswordHash(password: string, salt: string) {
    return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  }

  isPasswordValid(password: string, user: any) {
    const hash = crypto.pbkdf2Sync(password, user.salt, 1000, 64, 'sha512').toString('hex');

    return hash === user.password;
  }

  generateJwt(tokenData: { [key: string]: any }, options: any = {}) {
    const { user } = tokenData;

    const jwtEncodingData: IJwtToken = {
      email: user.email,
      role: user.role,
    };

    return this.jwtService.sign(jwtEncodingData, {
      secret: this.jwtSecret,
      ...options,
    });
  }

  verifyAndDecodeToken(token: string): IJwtToken {
    return this.jwtService.verify(token, { secret: this.jwtSecret });
  }

  setJwtToCookie(token: string, res: Response) {
    const cookieName = this.configService.get('JWT_COOKIE_NAME');
    const [expValue, expUnit] = this.configService.get('JWT_EXP').split('');

    const date = dayjs().add(expValue, expUnit);

    res.cookie(cookieName, token, {
      domain: this.configService.get('COOKIE_DOMAIN'),
      path: this.configService.get('COOKIE_PATH'),
      sameSite: 'none',
      secure: true,
      httpOnly: false,
      expires: date.toDate(),
    });
  }

  deleteJwtFromCookie(res: Response) {
    const cookieName = this.configService.get('JWT_COOKIE_NAME');

    res.clearCookie(cookieName, {
      domain: this.configService.get('COOKIE_DOMAIN'),
      path: this.configService.get('COOKIE_PATH'),
      sameSite: 'none',
      secure: true,
      httpOnly: false,
    });
  }
}
