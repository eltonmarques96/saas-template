jest.mock('nodemailer');

import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import { generateToken } from '@src/services/TokenService';

const sendMailMock = (nodemailer as any).__sendMailMock;

describe('User Controller Test', () => {
  beforeEach(() => {
    sendMailMock.mockClear();
  });

  it('should register a user', async () => {
    const userData = {
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane.doe@example.com',
      password: 'password123',
    };
    const { status, body } = await global.testRequest
      .post('/user/register')
      .send(userData);
    expect(status).toBe(201);
    expect(body).toHaveProperty('message');
    expect(body.message).toBe(
      'User successfully created. Please verify your email.'
    );
  });

  it('should verify a user', async () => {
    const token = jwt.sign(
      { email: 'jane.doe@example.com' },
      process.env.JWT_SECRET || 'testSecret',
      { expiresIn: '1h', algorithm: 'HS256' }
    );
    const { status, body } = await global.testRequest.get(
      `/user/verify?token=${token}`
    );
    expect(status).toBe(200);
    expect(body).toHaveProperty('message');
  });

  it('should handle invalid token during verification', async () => {
    const token = 'invalidToken123';
    const { status, body } = await global.testRequest.get(
      `/user/verify?token=${token}`
    );
    expect(status).toBe(400);
    expect(body).toHaveProperty('message', 'Invalid or expired token.');
  });

  it('should handle forgot password', async () => {
    const forgotPasswordData = {
      email: 'jane.doe@example.com',
    };
    const { status, body } = await global.testRequest
      .post('/user/forgot-password')
      .send(forgotPasswordData);
    expect(status).toBe(200);
    expect(body).toHaveProperty(
      'message',
      'Password reset email sent successfully.'
    );
  });

  it('should not send forgot password email for non-existent user', async () => {
    const forgotPasswordData = {
      email: 'nonexistent@example.com',
    };
    const { status, body } = await global.testRequest
      .post('/user/forgot-password')
      .send(forgotPasswordData);
    expect(status).toBe(404);
    expect(body).toHaveProperty('message', 'User not found.');
  });

  it('should reset password successfully with valid token', async () => {
    const userEmail = 'jane.doe@example.com';
    const validToken = generateToken({ userEmail }, 3600); // Token valid for 1 hour
    const resetPasswordData = {
      token: validToken,
      newPassword: 'newSecurePassword123',
    };
    const { status, body } = await global.testRequest
      .post('/user/reset-password')
      .send(resetPasswordData);
    expect(status).toBe(200);
    expect(body).toHaveProperty('message', 'Password successfully reset.');
  });

  it('should not reset password if token is expired', async () => {
    const userEmail = 'hello@gmail.com';
    // Generate a token that expires immediately
    const expiredToken = generateToken({ userEmail }, -1);
    const resetPasswordData = {
      token: expiredToken,
      newPassword: 'newPassword123',
    };
    const { status, body } = await global.testRequest
      .post('/user/reset-password')
      .send(resetPasswordData);
    expect(status).toBe(403);
    expect(body).toHaveProperty('message', 'Invalid or expired token.');
  });

  it('should not reset password if token is invalid', async () => {
    const resetPasswordData = {
      token: 'invalidToken123',
      newPassword: 'newPassword123',
    };
    const { status, body } = await global.testRequest
      .post('/user/reset-password')
      .send(resetPasswordData);
    expect(status).toBe(403);
    expect(body).toHaveProperty('message', 'Invalid or expired token.');
  });

  it('should not allow registration with a password less than 8 characters', async () => {
    const userData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'short',
    };
    const { status, body } = await global.testRequest
      .post('/user/register')
      .send(userData);
    expect(status).toBe(400);
    expect(body).toHaveProperty(
      'message',
      'Password must be at least 8 characters long.'
    );
  });

  it('should not reset password if the new password is less than 8 characters', async () => {
    const userEmail = 'jane.doe@example.com';
    const validToken = generateToken({ userEmail }, 3600); // Token valid for 1 hour
    const resetPasswordData = {
      token: validToken,
      newPassword: 'short',
    };
    const { status, body } = await global.testRequest
      .post('/user/reset-password')
      .send(resetPasswordData);
    expect(status).toBe(400);
    expect(body).toHaveProperty(
      'message',
      'Password must be at least 8 characters long.'
    );
  });

  it('should not verify a user that does not exist', async () => {
    const token = jwt.sign(
      { email: 'nonexistent@example.com' },
      process.env.JWT_SECRET || 'testSecret',
      { expiresIn: '1h', algorithm: 'HS256' }
    );
    const { status, body } = await global.testRequest.get(
      `/user/verify?token=${token}`
    );
    expect(status).toBe(404);
    expect(body).toHaveProperty('message', 'User not found.');
  });
});
