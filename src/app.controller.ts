import { Controller, Get } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import pkg from "../package.json";

@ApiTags("Core")
@Controller()
export class AppController {
  constructor(private readonly configService: ConfigService) {}

  @Get("version")
  @ApiOperation({ summary: "Получение версии API" })
  getVersion() {
    return {
      env: this.configService.get("ENV", "local"),
      version: pkg.version,
    };
  }
}
