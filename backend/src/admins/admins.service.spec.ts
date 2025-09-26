import { Test, TestingModule } from '@nestjs/testing';
import { AdminsService } from './admins.service';
import { UsersService } from '@/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '@/users/dto/create-user.dto';
import { getTypeOrmConfig } from '@/utils/database/typeorm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleType, User } from '@/users/entities/user.entity';
import { MailService } from '@/mail/mail.service';
import { TokenService } from '@/token/token.service';
import { UnauthorizedException } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { City } from '@/cities/entities/city.entity';
import { DataSource } from 'typeorm';
import { runSeeds } from 'test/setup-tests';
import { AuthService } from '@/auth/auth.service';
import { AuthGuard } from '@/auth/auth.guard';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { State } from '@/states/entities/state.entity';

describe('AdminsService', () => {
  let service: AdminsService;
  let userService: UsersService;
  let tokenService: TokenService;
  let dataSource: DataSource;
  const mockMailService = {
    sendUserConfirmation: jest.fn(),
    sendPasswordRecovery: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminsService,
        AuthGuard,
        UsersService,
        TokenService,
        {
          provide: CACHE_MANAGER,
          useValue: { get: jest.fn(), set: jest.fn(), del: jest.fn() },
        },
        { provide: 'BullQueue_users', useValue: { add: jest.fn() } },
        {
          provide: PinoLogger,
          useValue: {
            info: jest.fn(),
            error: jest.fn(),
            warn: jest.fn(),
            debug: jest.fn(),
            fatal: jest.fn(),
            trace: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            signAsync: jest.fn().mockResolvedValue('mocked-jwt-token'),
            verify: jest.fn(),
          },
        },
        { provide: MailService, useValue: mockMailService },
        AuthService,
      ],
      imports: [
        TypeOrmModule.forRoot(getTypeOrmConfig()),
        TypeOrmModule.forFeature([User, City, State]),
      ],
    }).compile();

    service = module.get<AdminsService>(AdminsService);
    userService = module.get<UsersService>(UsersService);
    tokenService = module.get<TokenService>(TokenService);
    dataSource = module.get<DataSource>(DataSource);

    await dataSource.synchronize(true);
    await runSeeds(dataSource);
  });

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
    const user = await userService.create(userParams);
    const repo = dataSource.getRepository(User);
    await repo.update(user.id, { role: RoleType.admin });
    const token = tokenService.generateToken({ email: userParams.email }, 3600);
    const userVerification = await userService.verify(token);
    expect(userVerification.activated).toEqual(true);
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
});
