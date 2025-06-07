import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getTypeOrmConfig } from '@/database/typeorm.config';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UsersController', () => {
  let controller: UsersController;

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
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
      imports: [
        TypeOrmModule.forFeature([User]),
        TypeOrmModule.forRoot(getTypeOrmConfig()),
      ],
    }).compile();

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

  it('should return one user by id', async () => {
    const user = await controller.create(mockUsers[0]);
    const result = await controller.findOne(user.id);
    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('firstName');
    expect(result).toHaveProperty('lastName');
    expect(result).toHaveProperty('email');
    expect(result).not.toHaveProperty('password');
  });

  it('should update n user', async () => {
    const user = await controller.create(mockUsers[0]);
    const dto: UpdateUserDto = { firstName: 'Updated' };
    const result = await controller.update(user.id, dto);
    expect(result.firstName).toBe('Updated');
  });

  it('should remove an user', async () => {
    const user = await controller.create(mockUsers[0]);
    const result = await controller.remove(user.id);
    expect(result).toEqual('User deleted');
  });
});
