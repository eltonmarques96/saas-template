import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { getTypeOrmConfig } from '@/utils/database/typeorm.config';
import { MailService } from '@/mail/mail.service';
import { TokenService } from '@/token/token.service';
import * as jwt from 'jsonwebtoken';

describe('UsersService', () => {
  let userService: UsersService;
  let tokenService: TokenService;
  const mockMailService = {
    sendUserConfirmation: jest.fn(),
    sendPasswordRecovery: jest.fn(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        TokenService,
        { provide: MailService, useValue: mockMailService },
      ],
      imports: [
        TypeOrmModule.forRoot(getTypeOrmConfig()),
        TypeOrmModule.forFeature([User]),
      ],
    }).compile();

    tokenService = module.get<TokenService>(TokenService);
    userService = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  it('should create an user', async () => {
    const userParams: CreateUserDto = {
      firstName: 'John',
      lastName: 'Lennon',
      email: 'john.lennon@beatles.com',
      password: 'password123',
    };
    expect(userService).toBeDefined();
    await userService.create(userParams);
    const user = await userService.findByEmail(userParams.email);
    expect(user).toBeDefined();
    expect(user.email).toEqual(userParams.email);
    expect(mockMailService.sendUserConfirmation).toHaveBeenCalledWith(
      userParams.email,
      userParams.firstName,
      expect.any(String),
    );
    expect(user.activated).toEqual(false);
  });

  it('should not create two users with same email', async () => {
    const firstUserParams: CreateUserDto = {
      firstName: 'John',
      lastName: 'Lennon',
      email: 'john.lennon@beatles.com',
      password: 'password123',
    };
    const secondUserParams: CreateUserDto = {
      firstName: 'John',
      lastName: 'Lennon',
      email: 'john.lennon@beatles.com',
      password: 'password123',
    };
    expect(userService).toBeDefined();
    await userService.create(firstUserParams);
    void expect(async () => {
      await userService.create(secondUserParams);
    }).rejects.toThrow(
      `User with email: ${secondUserParams.email} already exists`,
    );
  });

  it('should edit an user', async () => {
    const userParams: CreateUserDto = {
      firstName: 'John',
      lastName: 'Lennon',
      email: 'john.lennon@beatles.com',
      password: 'password123',
    };
    const newParams: Partial<CreateUserDto> = {
      firstName: 'John',
      lastName: 'Lennon II',
    };
    expect(userService).toBeDefined();
    await userService.create(userParams);
    let user = await userService.findByEmail(userParams.email);
    await userService.update(user.id, newParams);
    user = await userService.findByEmail(userParams.email);
    expect(user.lastName).toEqual(newParams.lastName);
  });

  it('should delete an user', async () => {
    const userParams: CreateUserDto = {
      firstName: 'John',
      lastName: 'Lennon',
      email: 'john.lennon@beatles.com',
      password: 'password123',
    };
    expect(userService).toBeDefined();
    await userService.create(userParams);
    const user = await userService.findByEmail(userParams.email);
    expect(user).toBeDefined();
    expect(user.email).toEqual(userParams.email);
    await userService.remove(user.id);
    void expect(async () => {
      await userService.findByEmail(userParams.email);
    }).rejects.toThrow(`User with email: ${userParams.email} not found`);
  });

  it('should verify an user', async () => {
    const userParams: CreateUserDto = {
      firstName: 'John',
      lastName: 'Lennon',
      email: 'john.lennon@beatles.com',
      password: 'password123',
    };

    expect(userService).toBeDefined();
    await userService.create(userParams);

    const token = jwt.sign(
      { email: userParams.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h', algorithm: 'HS256' },
    );

    let user = await userService.findByEmail(userParams.email);
    await userService.verify(token);
    user = await userService.findByEmail(userParams.email);
    expect(user.activated).toBe(true);
  });

  it('should apply the forgot password method', async () => {
    const userParams: CreateUserDto = {
      firstName: 'John',
      lastName: 'Lennon',
      email: 'john.lennon@beatles.com',
      password: 'password123',
    };

    expect(userService).toBeDefined();
    await userService.create(userParams);

    const user = await userService.findByEmail(userParams.email);
    const response = await userService.forgotpassword(user.email);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe(
      'Password reset email sent successfully.',
    );
  });

  it('should reset the password', async () => {
    const userParams: CreateUserDto = {
      firstName: 'John',
      lastName: 'Lennon',
      email: 'john.lennon@beatles.com',
      password: 'password123',
    };

    expect(userService).toBeDefined();
    await userService.create(userParams);

    const validToken = tokenService.generateToken(
      { email: userParams.email },
      3600,
    );
    const resetPasswordData = {
      token: validToken,
      newPassword: 'newSecurePassword123',
    };
    const response = await userService.resetPassword(
      resetPasswordData.token,
      resetPasswordData.newPassword,
    );
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Password has been reset successfully.');
  });
});
