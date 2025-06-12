import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { Job, Queue } from 'bull';
import { InjectQueue, Processor, Process } from '@nestjs/bull';
interface SendWelcomeEmailJobData {
  email: string;
  firstName: string;
  confirmationLink?: string;
}
interface ResetPasswordJobData {
  firstName: string;
  email: string;
  resetLink: string;
}
@Injectable()
@Processor('mail')
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    @InjectQueue('mail') private readonly queue: Queue,
  ) {}
  async sendUserConfirmation(email, firstName, token): Promise<void> {
    const confirmationLink = `${process.env.WEB_URL}/verify?token=${token}`;
    await this.queue.add('sendWelcomeEmail', {
      email: email,
      firstName: firstName,
      confirmationLink,
    });
  }

  async sendPasswordRecovery(email: string, token: string): Promise<void> {
    const resetLink = `${process.env.WEB_URL}/reset-password?token=${token}`;
    await this.queue.add('resetPasswordEmail', {
      email: email,
      resetLink,
    });
  }

  @Process('sendWelcomeEmail')
  async handleSendUserConfirmation(job: Job<SendWelcomeEmailJobData>) {
    const { email, firstName, confirmationLink } = job.data;
    await this.mailerService.sendMail({
      to: email,
      subject: 'Welcome to Our Service',
      html: `<p>Hi ${firstName},</p>
             <p>Thank you for registering! Please confirm your email by clicking the link below:</p>
             <p><a href="${confirmationLink}">Confirm Email</a></p>`,
    });
  }
  @Process('resetPasswordEmail')
  async handleSendPasswordRecovery(
    job: Job<ResetPasswordJobData>,
  ): Promise<void> {
    const { email, firstName, resetLink } = job.data;
    await this.mailerService.sendMail({
      to: email,
      subject: 'Password recovery',
      html: `<p>Hi ${firstName},</p>
      <p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
    });
  }
}
