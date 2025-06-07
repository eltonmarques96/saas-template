import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { getTypeOrmConfig } from '@/database/typeorm.config';

describe('UsersService', () => {
  let userService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
      imports: [
        TypeOrmModule.forRoot(getTypeOrmConfig()),
        TypeOrmModule.forFeature([User]),
      ],
    }).compile();

    userService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  it('should create an user', async () => {
    const userParams: CreateUserDto = {
      firstName: 'John',
      lastName: 'Lennon',
      email: 'john.lennon@beatles.com',
      phone: '+55718227383',
      password: 'password123',
    };
    expect(userService).toBeDefined();
    await userService.create(userParams);
    const user = await userService.findByEmail(userParams.email);
    expect(user).toBeDefined();
    expect(user.email).toEqual(userParams.email);
  });

  it('should not create two users with same email', async () => {
    const firstUserParams: CreateUserDto = {
      firstName: 'John',
      lastName: 'Lennon',
      email: 'john.lennon@beatles.com',
      phone: '+55718227383',
      password: 'password123',
    };
    const secondUserParams: CreateUserDto = {
      firstName: 'John',
      lastName: 'Lennon',
      email: 'john.lennon@beatles.com',
      phone: '+55718227383',
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
      phone: '+55718227383',
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
      phone: '+55718227383',
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
});
