import { Controller, Post, Get } from '@overnightjs/core';
import logger from '@src/logger';
import { UserModel } from '@src/models/User';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const SECRET_KEY = 'your_secret_key';
@Controller('auth')
export class AuthController {
  @Post('login')
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const result = await UserModel.authenticate({
        email,
        password,
      });
      return res.status(result.status).json(result.body);
    } catch (error) {
      logger.error('Error during login:', error);
      return res.status(500).json({ message: 'Internal server error.' });
    }
  }

  @Get('verify')
  async verifyToken(req: Request, res: Response): Promise<void> {
    try {
      const token = req.headers.authorization?.split(' ')[1];

      if (!token) {
        res.status(401).json({ message: 'Token is required' });
        return;
      }

      const decoded = jwt.verify(token, SECRET_KEY);
      res.status(200).json({ message: 'Token is valid', decoded });
    } catch (err) {
      res.status(401).json({ message: 'Invalid or expired token' });
    }
  }
}
