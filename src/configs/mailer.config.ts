import { ConfigService } from "@nestjs/config";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { MailerOptions } from "@nestjs-modules/mailer";
import { join } from "path";

export const getMailerConfig = async (
  configService: ConfigService
): Promise<MailerOptions> => ({
  transport: {
    host: configService.get("MAILER_HOST"),
    secure: false,
    port: configService.get("MAILER_PORT"),
    auth: {
      user: configService.get("MAILER_USER"),
      pass: configService.get("MAILER_PASSWORD"),
    },
  },
  defaults: {
    from: '"No Reply" <noreply@horobri.in.ua>',
  },
  template: {
    dir: join(__dirname, "../../templates/"),
    adapter: new HandlebarsAdapter(),
    options: { strict: true },
  },
});
