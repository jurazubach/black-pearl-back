import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserController } from './user.controller';
import { UserEntity } from 'src/entity/user.entity';
import { UserService } from './user.service';
import { AuthModule } from '../auth/auth.module';
import { AuthorizationEntity } from 'src/entity/authorization.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AuthorizationEntity, UserEntity]), forwardRef(() => AuthModule)],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
