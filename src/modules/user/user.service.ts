import { Repository } from 'typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entity/user.entity';
import { AUTHORIZATION_TYPE, AuthorizationEntity } from 'src/entity/authorization.entity';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(AuthorizationEntity)
    private readonly authorizationRepository: Repository<AuthorizationEntity>,
    private readonly authService: AuthService,
  ) {}

  async getSecureUserByParams(where: { [key: string]: any }): Promise<UserEntity> {
    const user = await this.userRepository
      .createQueryBuilder()
      .where(where)
      .select(['id', 'email', 'firstName', 'lastName', 'role'])
      .getRawOne<UserEntity>();

    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    return user;
  }

  async getUserByParams(where: { [key: string]: any }): Promise<UserEntity> {
    const user = await this.userRepository.createQueryBuilder().where(where).select('*').getRawOne<UserEntity>();

    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    return user;
  }

  async isUserExistByParams(where: { [key: string]: any }) {
    const user = await this.userRepository.createQueryBuilder().where(where).select('id').getRawOne();

    return !!user;
  }

  async updateUser(id: number, data: any) {
    return this.userRepository.createQueryBuilder().update(data).where('id = :id', { id }).execute();
  }

  async createUser(user: UserEntity) {
    return this.userRepository.save(user);
  }

  async clearRecoverTokens(userId: number, type: AUTHORIZATION_TYPE) {
    return this.authorizationRepository.delete({ userId, type });
  }

  async getUserByToken(type: AUTHORIZATION_TYPE, token: string) {
    const row = await this.authorizationRepository.findOne({ where: { type, token } });
    if (row && row.userId) {
      return this.getSecureUserByParams({ id: row.userId });
    }

    throw new HttpException('Invalid token', HttpStatus.BAD_REQUEST);
  }

  async setAuthToken({
    user,
    type,
    token,
  }: {
    user: UserEntity;
    type: AUTHORIZATION_TYPE;
    token?: string;
  }): Promise<string> {
    await this.authorizationRepository.delete({ userId: user.id, type });

    const jwtToken = token || this.authService.generateJwt({ user });

    const authEntity = new AuthorizationEntity();
    Object.assign(authEntity, { userId: user.id, type, token: jwtToken });

    await this.authorizationRepository.save(authEntity);

    return jwtToken;
  }

  async deleteUser(user: UserEntity) {
    return this.userRepository.delete({ id: user.id });
  }
}
