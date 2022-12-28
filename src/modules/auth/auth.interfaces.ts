import { USER_ROLE } from "src/entity/user.entity";

export interface IJwtToken {
  email: string;
  role: USER_ROLE;
}
