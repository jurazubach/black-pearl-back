import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getMailerConfig } from 'src/configs/mailer.config';
import { MailService } from './mail.service';
import { UrlModule } from '../url/url.module';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: getMailerConfig,
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
    ConfigModule,
    UrlModule,
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
