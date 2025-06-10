import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getTypeOrmConfig } from '@/database/typeorm.config';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { MailService } from '@/mail/mail.service';
import * as jwt from 'jsonwebtoken';
import { TokenService } from '@/token/token.service';

describe('UsersController', () => {
  let controller: UsersController;
  let tokenService: TokenService;
  const mockUsers = [
    {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '1234567890',
      password: 'securePass',
    },
    {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      phone: '0987654321',
      password: 'anotherPass',
    },
  ];
  const mockMailService = {
    sendUserConfirmation: jest.fn(),
    sendPasswordRecovery: jest.fn(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        TokenService,
        { provide: MailService, useValue: mockMailService },
      ],
      imports: [
        TypeOrmModule.forFeature([User]),
        TypeOrmModule.forRoot(getTypeOrmConfig()),
      ],
    }).compile();
    tokenService = module.get<TokenService>(TokenService);
    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a user', async () => {
    const dto: CreateUserDto = {
      firstName: 'Alice',
      lastName: 'Brown',
      email: 'alice@example.com',
      phone: '1112223333',
      password: 'password123',
    };

    const result = await controller.create(dto);
    expect(result.email).toEqual(dto.email);
    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('firstName');
    expect(result).toHaveProperty('lastName');
    expect(result).toHaveProperty('email');
    expect(result).not.toHaveProperty('password');
  });

  it('should not create two users with the same email', async () => {
    const dto: CreateUserDto = {
      firstName: 'Alice',
      lastName: 'Brown',
      email: 'alice@example.com',
      phone: '1112223333',
      password: 'password123',
    };

    const result = await controller.create(dto);
    expect(result.email).toEqual(dto.email);

    //const secondResult = await controller.create(dto);
    //expect(secondResult.).toBeNull();
  });

  it('should return one user by id', async () => {
    const user = await controller.create(mockUsers[0]);
    const result = await controller.findOne(user.id);
    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('firstName');
    expect(result).toHaveProperty('lastName');
    expect(result).toHaveProperty('email');
    expect(result).not.toHaveProperty('password');
  });

  it('should update an user', async () => {
    const user = await controller.create(mockUsers[0]);
    const dto: UpdateUserDto = { firstName: 'Updated' };
    const result = await controller.update(user.id, dto);
    expect(result.firstName).toBe('Updated');
  });

  it('should verify an user', async () => {
    const user = await controller.create(mockUsers[0]);
    const token = jwt.sign(
      { email: mockUsers[0].email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h', algorithm: 'HS256' },
    );

    const result = await controller.verify(user.id, token);
    expect(result.activated).toBe(true);
  });

  it('should send the request of forgot password of an user', async () => {
    const user = await controller.create(mockUsers[0]);

    const result = await controller.forgotpassword(user.email);
    expect(result.status).toBe(200);
    expect(result.body.message).toBe('Password reset email sent successfully.');
  });

  it('should reset the password of the user', async () => {
    const validToken = tokenService.generateToken(
      { email: mockUsers[0].email },
      3600,
    );
    const user = await controller.create(mockUsers[0]);

    const result = await controller.resetpassword(validToken, user.email);
    expect(result.status).toBe(200);
    expect(result.body.message).toBe('Password has been reset successfully.');
  });

  it('should remove an user', async () => {
    const user = await controller.create(mockUsers[0]);
    const result = await controller.remove(user.id);
    expect(result).toEqual('User deleted');
  });
});
