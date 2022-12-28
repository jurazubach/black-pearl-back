import path from "path";
import { ConfigService } from "@nestjs/config";
import { I18nOptionsWithoutResolvers } from "nestjs-i18n";

export const getIntlConfig = async (
  configService: ConfigService
): Promise<I18nOptionsWithoutResolvers> => ({
  fallbackLanguage: configService.get<string>("defaultLang", "uk"),
  parserOptions: {
    path: path.join(__dirname, "../../i18n/"),
  },
});
