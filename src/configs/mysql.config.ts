import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const getMysqlConfig = async (
  configService: ConfigService
): Promise<TypeOrmModuleOptions> => ({
  type: "mysql",
  host: configService.get<string>("DB_HOST"),
  port: configService.get<number>("DB_PORT"),
  username: configService.get<string>("DB_USER"),
  password: configService.get<string>("DB_PASSWORD"),
  database: configService.get<string>("DB_DATABASE"),
  logging: configService.get<string>("ENV") === "dev" ? ["query"] : false,
  dropSchema: false,
  synchronize: false,
  autoLoadEntities: true,
});
