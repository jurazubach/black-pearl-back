import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { CanActivate } from "@nestjs/common";
import { AuthService } from "../auth.service";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService
  ) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const jwtCookieName = this.configService.get("JWT_COOKIE_NAME");

    const req = context.switchToHttp().getRequest();
    try {
      let jwtToken = null;

      const { [jwtCookieName]: jwtTokenFromCookie } = req.cookies;
      if (jwtTokenFromCookie) {
        jwtToken = jwtTokenFromCookie;
      }

      const authHeader = req.header("authorization");
      if (authHeader) {
        const [bearer, jwtTokenFromHeader] = String(authHeader)
          .trim()
          .split(" ");
        if (bearer !== "Bearer") {
          return false;
        }

        jwtToken = jwtTokenFromHeader;
      }

      if (!jwtToken) {
        return false;
      }

      req.auth = this.authService.verifyAndDecodeToken(jwtToken);

      return true;
    } catch (err) {
      throw new UnauthorizedException("Invalid token");
    }
  }
}
