import logger from '@src/logger';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // use env in production

export function generateToken(payload: any, expiresIn: number = 60): string {
  try {
    return jwt.sign(payload, JWT_SECRET, { expiresIn });
  } catch (error) {
    logger.error('Token generation failed:', error);
    throw new Error('Failed to generate token');
  }
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}
