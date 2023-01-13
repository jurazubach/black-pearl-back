import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { getJwtConfig } from '../../configs/jwt.config';
import { MailModule } from '../mail/mail.module';
import { UrlModule } from '../url/url.module';

@Module({
  controllers: [AuthController],
  imports: [
    UserModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getJwtConfig,
    }),
    MailModule,
    UrlModule,
  ],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
