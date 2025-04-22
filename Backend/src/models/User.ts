import bcrypt from 'bcryptjs';
import { ulid } from 'ulid';
import { UserRepository } from '../repositories/UserRepository';
import { generateToken, verifyToken } from '../services/TokenService';
import { MailService } from '../services/MailService';
import logger from '@src/logger';
import jwt from 'jsonwebtoken';

export class UserModel {
  static async register(data: any) {
    try {
      const { firstName, lastName, email, password, ...optional } = data;

      if (!firstName || !lastName || !email || !password) {
        return {
          status: 400,
          body: { message: 'Required fields are missing.' },
        };
      }

      const existingUser = await UserRepository.findByEmail(email);
      if (existingUser) {
        return { status: 409, body: { message: 'Email already in use.' } };
      }

      const newUser = {
        id: ulid(),
        firstName,
        lastName,
        email,
        password,
        verified: false,
        ...optional,
      };

      await UserRepository.create(newUser);

      const token = generateToken({ email }, 60 * 24);
      await MailService.sendVerificationEmailMethod(email, token);

      return {
        status: 201,
        body: {
          message: 'User successfully created. Please verify your email.',
        },
      };
    } catch (error) {
      logger.error('Error during user registration:', error);
      return {
        status: 500,
        body: { message: 'Internal server error' },
      };
    }
  }

  static async getProfile(email: string) {
    if (!email) {
      return { status: 400, body: { message: 'Email is required.' } };
    }

    const user = await UserRepository.findByEmail(email);
    if (!user) {
      return { status: 404, body: { message: 'User not found.' } };
    }

    const { password, ...userData } = user;
    return { status: 200, body: userData };
  }

  static async verifyUser(token: string) {
    try {
      const payload = verifyToken(token);
      const user = await UserRepository.findByEmail(payload.email);

      if (!user) {
        logger.warn('User not found');
        return { status: 404, body: { message: 'User not found.' } };
      }

      user.verified = true;
      await UserRepository.save(user);
      await MailService.welcomeEmailMethod(user.email);

      return { status: 200, body: { message: 'Email successfully verified.' } };
    } catch (error) {
      return {
        status: 400,
        body: { message: 'Invalid or expired token.' },
      };
    }
  }

  static async resetPassword(data: { token: string; newPassword: string }) {
    try {
      const { token, newPassword } = data;

      const payload = verifyToken(token);
      if (payload === null) {
        return { status: 403, body: { message: 'Invalid or expired token.' } };
      }

      const user = await UserRepository.findByEmail(payload.email);

      if (!user) {
        return { status: 404, body: { message: 'User not found.' } };
      }

      user.password = await bcrypt.hash(newPassword, 10);
      await UserRepository.save(user);

      return { status: 200, body: { message: 'Password successfully reset.' } };
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        return { status: 403, body: { message: 'Invalid or expired token.' } };
      }
      console.error('Error during password reset:', error);
      return {
        status: 500,
        body: { message: 'Internal server error' },
      };
    }
  }

  static async forgotPassword(data: { email: string }) {
    const { email } = data;

    if (!email) {
      return { status: 400, body: { message: 'Email is required.' } };
    }

    const user = await UserRepository.findByEmail(email);
    if (!user) {
      return { status: 404, body: { message: 'User not found.' } };
    }

    const token = generateToken({ email }, 60);
    await MailService.sendResetPasswordEmailMethod(email, token);

    return {
      status: 200,
      body: { message: 'Password reset email sent successfully.' },
    };
  }

  static async authenticate(data: { email: string; password: string }) {
    try {
      const { email, password } = data;

      if (!email || !password) {
        return {
          status: 401,
          body: { message: 'Login and/or Password incorrect' },
        };
      }

      const user = await UserRepository.findByEmail(email);
      if (!user) {
        return {
          status: 401,
          body: { message: 'Login and/or Password incorrect' },
        };
      }

      if (!user.verified) {
        return { status: 403, body: { message: 'User is not verified.' } };
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return {
          status: 401,
          body: { message: 'Login and/or Password incorrect' },
        };
      }

      const token = generateToken({ email: user.email, id: user.id }, 60 * 24);

      return {
        status: 200,
        body: { message: 'Authentication successful.', token },
      };
    } catch (error) {
      logger.error('Error during user authentication:', error);
      return {
        status: 500,
        body: { message: 'Internal server error' },
      };
    }
  }
}
