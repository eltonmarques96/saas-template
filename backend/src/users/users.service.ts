import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { MailService } from '@/mail/mail.service';
import { TokenService } from '@/token/token.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly mailService: MailService,
    private readonly tokenService: TokenService,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (existingUser) {
      throw new ConflictException(
        `User with email: ${createUserDto.email} already exists`,
      );
    }
    const saltOrRounds = 10;
    const password = 'random_password';
    const hash = await bcrypt.hash(password, saltOrRounds);
    const newUser = {
      ...createUserDto,
      password: hash,
    };
    const token = this.tokenService.generateToken(
      { email: newUser.email },
      60 * 24,
    );
    const createdUser = await this.userRepository.save(newUser);
    await this.mailService.sendUserConfirmation(
      newUser.email,
      newUser.firstName,
      token,
    );
    return createdUser;
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOne(id: string) {
    const user = await this.userRepository.findBy({ id });
    if (!user) {
      throw new NotFoundException(`User not found`);
    }
    return user[0];
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: [],
    });
    if (!user) {
      throw new NotFoundException(`User with email: ${email} not found`);
    }
    return user;
  }

  async update(
    id: string,
    updateUserDto: Partial<UpdateUserDto>,
  ): Promise<User> {
    let user = await this.userRepository.findOneBy({ id: updateUserDto.id });
    if (!user) {
      throw new NotFoundException(`User not found`);
    }
    await this.userRepository.update(id, updateUserDto);
    user = await this.userRepository.findOneBy({ id: updateUserDto.id });
    if (!user) {
      throw new NotFoundException(`User not found`);
    }
    return user;
  }

  async remove(id: string): Promise<string> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User not found`);
    }
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    return 'User deleted';
  }
}
