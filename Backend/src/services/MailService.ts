import logger from '@src/logger';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const WEB_URL = process.env.WEB_URL || 'http://localhost:3000';

async function sendVerificationEmail(
  email: string,
  token: string
): Promise<void> {
  try {
    const verificationLink = `${WEB_URL}/verify?token=${token}`;

    await transporter.sendMail({
      from: 'The Gym Elite" <noreply@thegymelite.site>',
      to: email,
      subject: 'Verify your email',
      html: `
        <h2>Welcome the Gym Elite App</h2>
        <h2>Verify your email address</h2>
        <p>Click the link below to verify your account:</p>
        <a href="${verificationLink}">${verificationLink}</a>
      `,
    });
  } catch (error) {
    logger.error('Error sending verification email:', error);
  }
}

async function welcomeEmail(email: string): Promise<void> {
  try {
    await transporter.sendMail({
      from: 'The Gym Elite" <noreply@thegymelite.site>',
      to: email,
      subject: 'Welcome to the Gym Elite App',
      html: `
        <h2>Welcome the Gym Elite App</h2>
        <h2>Your account has been created</h2>
      `,
    });
  } catch (error) {
    logger.error('Error sending verification email:', error);
  }
}

async function sendResetPasswordEmail(
  email: string,
  token: string
): Promise<void> {
  const resetLink = `${WEB_URL}/reset-password?token=${token}`;

  await transporter.sendMail({
    from: 'The Gym Elite" <noreply@thegymelite.site>',
    to: email,
    subject: 'Reset your password',
    html: `
      <h2>Reset your password</h2>
      <p>Click the link below to create a new password:</p>
      <a href="${resetLink}">${resetLink}</a>
    `,
  });
}

export class MailService {
  static async sendVerificationEmailMethod(email: string, token: string) {
    await sendVerificationEmail(email, token);
  }

  static async welcomeEmailMethod(email: string) {
    await welcomeEmail(email);
  }

  static async sendResetPasswordEmailMethod(email: string, token: string) {
    await sendResetPasswordEmail(email, token);
  }
}
