import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { UserEntity } from "src/entity/user.entity";
import { ConfigService } from "@nestjs/config";
import { UrlService } from "../url/url.service";
import { I18nService } from "nestjs-i18n";

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
    private readonly urlService: UrlService,
    private readonly i18n: I18nService
  ) {}

  getTemplateName(name: string, locale: string) {
    return `./${name}_${locale}`;
  }

  async sendUserConfirmEmail(user: UserEntity, token: string) {
    const url = this.urlService.getApiBaseUrl("/auth/confirm-email", { token });
    const shortUrl = await this.urlService.createShortUrl(url);

    const subject = await this.i18n.t("mail.confirmEmail.subject");

    return this.mailerService.sendMail({
      to: user.email,
      subject: subject,
      template: this.getTemplateName("confirm-email", user.lang),
      context: { name: user.firstName, url: shortUrl },
    });
  }

  async sendUserRecoverPassword(user: UserEntity, token: string) {
    const url = this.urlService.getFrontBaseUrl("/auth/change-password", {
      token,
    });
    const shortUrl = await this.urlService.createShortUrl(url);

    const subject = await this.i18n.t("mail.changePassword.subject");

    return this.mailerService.sendMail({
      to: user.email,
      subject: subject,
      template: this.getTemplateName("change-password", user.lang),
      context: { name: user.firstName, url: shortUrl },
    });
  }

  async sendUserSuccessChangePassword(user: UserEntity) {
    const subject = await this.i18n.t("mail.successChangePassword.subject");

    return this.mailerService.sendMail({
      to: user.email,
      subject: subject,
      template: this.getTemplateName("success-change-password", user.lang),
      context: { name: user.firstName },
    });
  }

  async sendWelcomeCustomer(user: UserEntity) {
    const subject = await this.i18n.t("mail.successChangePassword.subject");

    // TODO: переделать
    return this.mailerService.sendMail({
      to: user.email,
      subject: subject,
      template: this.getTemplateName("success-change-password", user.lang),
      context: { name: user.firstName },
    });
  }
}
