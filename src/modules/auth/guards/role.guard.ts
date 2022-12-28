import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { USER_ROLE } from "src/entity/user.entity";
import { IJwtToken } from "../auth.interfaces";

const ROLE_HIERARCHY = {
  [USER_ROLE.ADMIN]: [USER_ROLE.ADMIN, USER_ROLE.USER],
  [USER_ROLE.USER]: [USER_ROLE.USER],
};

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requireRole = this.reflector.get<USER_ROLE>(
      "requireRole",
      context.getHandler()
    );

    const req = context.switchToHttp().getRequest();
    const auth = req.auth as IJwtToken;
    const userRole = auth.role || USER_ROLE.USER;

    const accessRoles =
      ROLE_HIERARCHY[requireRole] || ROLE_HIERARCHY[USER_ROLE.USER];

    return accessRoles.includes(userRole);
  }
}
