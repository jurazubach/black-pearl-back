import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export const getJwtConfig = async (configService: ConfigService): Promise<JwtModuleOptions> => ({
  signOptions: { expiresIn: configService.get<string>('JWT_EXP') },
  secret: configService.get<string>('JWT_SECRET'),
});
