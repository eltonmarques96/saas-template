import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { BullModule } from '@nestjs/bull';

@Module({
  providers: [MailService],
  exports: [MailService],
  imports: [
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT),
          secure: process.env.MAIL_SECURE === 'true',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        },
        defaults: {
          from: `"No Reply" <${process.env.MAIL_FROM}>`,
        },
      }),
    }),
    BullModule.registerQueue({
      name: 'mail',
    }),
  ],
})
export class MailModule {}
