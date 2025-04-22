import { Controller, Get, Post } from '@overnightjs/core';
import { Request, Response } from 'express';
import { UserModel } from '../models/User';
import logger from '@src/logger';

@Controller('user')
export class UserController {
  @Post('register')
  async register(req: Request, res: Response) {
    try {
      const result = await UserModel.register(req.body);
      return res.status(result.status).json(result.body);
    } catch (error) {
      logger.error('Error during registration:', error);
      return res.status(500).json({ message: 'Internal server error.' });
    }
  }

  @Get('verify')
  async verifyUser(req: Request, res: Response) {
    try {
      const token = req.query.token as string;
      const result = await UserModel.verifyUser(token);
      return res.status(result.status).json(result.body);
    } catch (error) {
      logger.error('Error during verification:', error);
      return res.status(400).json({ message: 'Invalid or expired token.' });
    }
  }

  @Post('forgot-password')
  async forgotPassword(req: Request, res: Response) {
    try {
      const result = await UserModel.forgotPassword(req.body);
      return res.status(result.status).json(result.body);
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error.' });
    }
  }

  @Post('reset-password')
  async resetPassword(req: Request, res: Response) {
    try {
      const result = await UserModel.resetPassword(req.body);
      return res.status(result.status).json(result.body);
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error.' });
    }
  }
}
