import { UseGuards, SetMetadata, applyDecorators } from "@nestjs/common";
import { USER_ROLE } from "src/entity/user.entity";
import { RolesGuard } from "./role.guard";
import { JwtGuard } from "./jwt.guard";

export function AuthGuard(requireRole: string = USER_ROLE.USER) {
  return applyDecorators(
    SetMetadata("requireRole", requireRole),
    UseGuards(JwtGuard, RolesGuard)
  );
}
