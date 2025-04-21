import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // use env in production

export function generateToken(payload: any, expiresIn: number = 60): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

export function verifyToken(token: string): any {
  return jwt.verify(token, JWT_SECRET);
}
