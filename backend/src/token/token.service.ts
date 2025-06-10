import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class TokenService {
  JWT_SECRET: string;
  constructor() {
    this.JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
  }

  generateToken(payload: any, expiresIn: number = 60): string {
    const token: string = jwt.sign(payload, this.JWT_SECRET, { expiresIn });
    return token;
  }

  verifyToken(token: string): string | object | null {
    const verify = jwt.verify(token, this.JWT_SECRET);
    return verify;
  }
}
