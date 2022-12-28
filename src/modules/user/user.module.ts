import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UserController } from "./user.controller";
import { UserEntity } from "../../entity/user.entity";
import { UserService } from "./user.service";
import { AuthModule } from "../auth/auth.module";
import { AuthorizationEntity } from "../../entity/authorization.entity";
import { MailModule } from "../mail/mail.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AuthorizationEntity,
      UserEntity,
    ]),
    forwardRef(() => AuthModule),
    MailModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
