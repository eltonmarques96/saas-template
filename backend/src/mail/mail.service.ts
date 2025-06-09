import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}
  async sendUserConfirmation(
    email: string,
    firstName: string,
    token: string,
  ): Promise<void> {
    const confirmationLink = `${process.env.WEB_URL}/verify?token=${token}`;
    await this.mailerService.sendMail({
      to: email,
      subject: 'Welcome to our platform! Validate your account',
      text: `Hello ${firstName}, welcome!`,
      html: `
      <h3>Hello ${firstName},</h3>
      <p>Welcome to our platform!</p>
      <p>Please confirm your account by clicking the link below:</p>
      <p>
        <a href="${confirmationLink}" target="_blank" style="color: #1a73e8;">
          Confirm your account
        </a>
      </p>
      <p>If you did not create an account, you can ignore this message.</p>
    `,
    });
  }

  async sendPasswordRecovery(email: string, token: string): Promise<void> {
    const resetLink = `${process.env.WEB_URL}/reset-password?token=${token}`;
    await this.mailerService.sendMail({
      to: email,
      subject: 'Password recovery',
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
    });
  }
}
