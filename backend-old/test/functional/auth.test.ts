jest.mock('nodemailer');

import nodemailer from 'nodemailer';
import { UserModel } from '@src/models/User';
import bcrypt from 'bcryptjs';
import { UserRepository } from '@src/repositories/UserRepository';

// Mock UserModel.authenticate as a Jest mock function
jest.mock('@src/models/User', () => ({
  UserModel: {
    authenticate: jest.fn(),
  },
}));

const sendMailMock = (nodemailer as any).__sendMailMock;

describe('Auth Controller Test', () => {
  beforeEach(() => {
    sendMailMock.mockClear();
  });

  it('should allow login with valid credentials', async () => {
    const password = 'hashedPassword';
    const mockUser = {
      email: 'test@example.com',
      password: '',
      firstName: 'John',
      lastName: 'Lennon',
      id: '123',
      verified: true,
    };
    mockUser.password = await bcrypt.hash(password, 10);
    await UserRepository.create(mockUser);

    const response = await global.testRequest
      .post('/auth/login')
      .send({ email: mockUser.email, password: password });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeTruthy();
    expect(response.body.user).toHaveProperty('id');
    expect(response.body.user).toHaveProperty('firstName');
    expect(response.body.user).toHaveProperty('lastName');
    expect(response.body.user).toHaveProperty('email');
    expect(response.body.user).toHaveProperty('profilePhoto');
  });

  it('should not allow login for non validated user', async () => {
    const mockUser = {
      email: 'validated@example.com',
      password: 'plainPassword',
      firstName: 'Jane',
      lastName: 'Doe',
      id: '456',
      verified: false,
    };
    mockUser.password = await bcrypt.hash(mockUser.password, 10);
    await UserRepository.create(mockUser);
    (UserModel.authenticate as jest.Mock).mockResolvedValue({
      status: 401,
      body: { message: 'User not validated' },
    });

    const response = await global.testRequest
      .post('/auth/login')
      .send({ email: 'validated@example.com', password: 'plainPassword' });

    expect(response.status).toBe(403);
    expect(response.body.message).toBe('User is not verified.');
  });

  it('should return error for wrong email', async () => {
    (UserModel.authenticate as jest.Mock).mockResolvedValue({
      status: 401,
      body: { message: 'Login and/or Password incorrect' },
    });

    const response = await global.testRequest
      .post('/auth/login')
      .send({ email: 'wrong@example.com', password: 'plainPassword' });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Login and/or Password incorrect');
  });

  it('should return error for wrong password', async () => {
    (UserModel.authenticate as jest.Mock).mockResolvedValue({
      status: 401,
      body: { message: 'Login and/or Password incorrect' },
    });

    const response = await global.testRequest
      .post('/auth/login')
      .send({ email: 'test@example.com', password: 'wrongPassword' });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Login and/or Password incorrect');
  });

  it('should return JWT token and user info for valid credentials', async () => {
    const password = 'hashedPassword';
    const mockUser = {
      email: 'test@example.com',
      password: '',
      firstName: 'John',
      lastName: 'Lennon',
      id: '123',
      verified: true,
    };
    mockUser.password = await bcrypt.hash(password, 10);
    await UserRepository.create(mockUser);

    const response = await global.testRequest
      .post('/auth/login')
      .send({ email: mockUser.email, password: password });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeTruthy();
  });

  it('should not include password in the authentication response', async () => {
    const password = 'hashedPassword';
    const mockUser = {
      email: 'test@example.com',
      password: '',
      firstName: 'John',
      lastName: 'Lennon',
      id: '123',
      verified: true,
    };
    mockUser.password = await bcrypt.hash(password, 10);
    await UserRepository.create(mockUser);

    const response = await global.testRequest
      .post('/auth/login')
      .send({ email: mockUser.email, password: password });

    expect(response.status).toBe(200);
    expect(response.body.user).not.toHaveProperty('password');
  });

  it('should get user profile', async () => {
    const password = 'hashedPassword';
    const mockUser = {
      email: 'test@example.com',
      password: '',
      firstName: 'John',
      lastName: 'Lennon',
      id: '123',
      verified: true,
    };
    mockUser.password = await bcrypt.hash(password, 10);
    await UserRepository.create(mockUser);

    const loginResponse = await global.testRequest
      .post('/auth/login')
      .send({ email: mockUser.email, password: password });

    const token = loginResponse.body.token;

    const profileResponse = await global.testRequest
      .get('/auth/profile')
      .set('Authorization', `Bearer ${token}`);

    expect(profileResponse.status).toBe(200);
    expect(profileResponse.body.user).toHaveProperty(
      'firstName',
      mockUser.firstName
    );
    expect(profileResponse.body.user).toHaveProperty(
      'lastName',
      mockUser.lastName
    );
    expect(profileResponse.body.user).toHaveProperty('email', mockUser.email);
    expect(profileResponse.body.user).not.toHaveProperty('password');
  });
});
