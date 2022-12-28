import path from "path";
import { ConfigService } from "@nestjs/config";
import { ServeStaticModuleOptions } from "@nestjs/serve-static";

export const getStaticConfig = async (
  configService: ConfigService
): Promise<ServeStaticModuleOptions[]> => {
  const staticConfig = {
    rootPath: path.join(__dirname, '../..', 'public'),
    exclude: ['/api*'],
  };

  return [staticConfig];
}
