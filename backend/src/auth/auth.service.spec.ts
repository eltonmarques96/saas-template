import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '@/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';
import { CreateUserDto } from '@/users/dto/create-user.dto';
import { getTypeOrmConfig } from '@/database/typeorm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/users/entities/user.entity';
import { MailService } from '@/mail/mail.service';
import { TokenService } from '@/token/token.service';
import * as jwt from 'jsonwebtoken';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let userService: UsersService;
  let tokenService: TokenService;
  const mockMailService = {
    sendUserConfirmation: jest.fn(),
    sendPasswordRecovery: jest.fn(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(getTypeOrmConfig()),
        TypeOrmModule.forFeature([User]),
      ],
      providers: [
        AuthGuard,
        UsersService,
        { provide: MailService, useValue: mockMailService },
        TokenService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            signAsync: jest.fn().mockResolvedValue('mocked-jwt-token'),
            verify: jest.fn(),
          },
        },
        AuthService,
      ],
    }).compile();
    service = module.get<AuthService>(AuthService);
    userService = module.get<UsersService>(UsersService);
    tokenService = module.get<TokenService>(TokenService);
  });

  afterEach(async () => {});

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(tokenService).toBeDefined();
    expect(userService).toBeDefined();
  });

  it('should auth an user', async () => {
    expect(service).toBeDefined();
    const userParams: CreateUserDto = {
      firstName: 'John',
      lastName: 'Lennon',
      email: 'john.lennon@beatles.com',
      password: 'password123',
    };
    expect(userService).toBeDefined();
    await userService.create(userParams);
    const token = jwt.sign({ email: userParams.email }, 'your-secret-key', {
      expiresIn: '1h',
      algorithm: 'HS256',
    });
    const userVerification = await userService.verify(token);
    expect(userVerification.enabled).toEqual(true);
    const login = await service.signIn(userParams.email, userParams.password);
    expect(login).toBeDefined();
    expect(login.token).toBeDefined();
  });

  it('should not auth an user not verified', async () => {
    expect(service).toBeDefined();
    const userParams: CreateUserDto = {
      firstName: 'John',
      lastName: 'Lennon',
      email: 'john.lennon@beatles.com',
      password: 'password123',
    };
    expect(userService).toBeDefined();
    await userService.create(userParams);
    await expect(
      service.signIn(userParams.email, userParams.password),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should auth and return the information about the user', async () => {
    expect(service).toBeDefined();
    const userParams: CreateUserDto = {
      firstName: 'John',
      lastName: 'Lennon',
      email: 'john.lennon@beatles.com',
      password: 'password123',
    };
    expect(userService).toBeDefined();
    const createdUser = await userService.create(userParams);
    const token = jwt.sign({ email: userParams.email }, 'your-secret-key', {
      expiresIn: '1h',
      algorithm: 'HS256',
    });
    const userVerification = await userService.verify(token);
    expect(userVerification.enabled).toEqual(true);
    const login = await service.signIn(userParams.email, userParams.password);
    expect(login).toBeDefined();
    expect(login.token).toBeDefined();
    const userInformation = await service.profile(createdUser.id);
    expect(userInformation).toBeDefined();
    expect(userInformation.firstName).toEqual(userParams.firstName);
  });
});
