jest.mock('nodemailer');

import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import { generateToken } from '@src/services/TokenService';

const sendMailMock = (nodemailer as any).__sendMailMock;

describe('User Controller Test', () => {
  beforeEach(() => {
    sendMailMock.mockClear();
  });

  it('should return user info', async () => {
    const { status, body } = await global.testRequest.get('/user');
    expect(status).toBe(200);
    expect(body).toEqual({});
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

  it('should get user profile', async () => {
    const email = 'jane.doe@example.com';
    const { status, body } = await global.testRequest.get(
      `/user/profile?email=${email}`
    );
    expect(status).toBe(200);
    expect(body).toHaveProperty('firstName');
    expect(body.verified).toBe(false);
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
    expect(body).toHaveProperty('message');
  });

  it('should reset password', async () => {
    const userEmail = 'hello@gmail.com';
    const fakeToken = generateToken({ userEmail }, 60);
    const resetPasswordData = {
      token: fakeToken,
      newPassword: 'newPassword123',
    };
    const { status, body } = await global.testRequest
      .post('/user/reset-password')
      .send(resetPasswordData);
    expect(status).toBe(200);
    expect(body).toHaveProperty('message');
  });
});
