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
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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
    const hash = await bcrypt.hash(createUserDto.password, saltOrRounds);
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

  async findOne(id: string): Promise<User> {
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

  async forgotpassword(
    email: string,
  ): Promise<{ status: number; body: { message: string } }> {
    const user = await this.userRepository.findOneBy({ email: email });
    if (!user) {
      throw new NotFoundException(`User not found`);
    }
    const token = this.tokenService.generateToken({ email }, 60 * 24);

    await this.mailService.sendPasswordRecovery(user.email, token);

    if (!user) {
      throw new NotFoundException(`User not found`);
    }
    return {
      status: 200,
      body: { message: 'Password reset email sent successfully.' },
    };
  }

  async resetPassword(
    token: string,
    newPassword: string,
  ): Promise<{ status: number; body: { message: string } }> {
    if (newPassword.length < 8) {
      return {
        status: 400,
        body: { message: 'Password must be at least 8 characters long.' },
      };
    }
    const payload = this.tokenService.verifyToken(token);
    if (payload === null) {
      return { status: 403, body: { message: 'Invalid or expired token.' } };
    }

    if (
      !payload ||
      typeof payload !== 'object' ||
      payload === null ||
      !('email' in payload)
    ) {
      return { status: 403, body: { message: 'Invalid or expired token.' } };
    }

    const email = (payload as { email: string }).email;
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    // Hash the new password and update the user
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(newPassword, saltOrRounds);
    await this.userRepository.update(user.id, { password: hash });

    return {
      status: 200,
      body: { message: 'Password has been reset successfully.' },
    };
  }

  async verify(token: string): Promise<User> {
    const payload = this.tokenService.verifyToken(token);

    if (
      !payload ||
      typeof payload !== 'object' ||
      payload === null ||
      !('email' in payload)
    ) {
      throw new NotFoundException(`Invalid token`);
    }
    let user = await this.userRepository.findOneBy({
      email: (payload as { email: string }).email,
    });
    if (!user) {
      throw new NotFoundException(`User not found`);
    }
    if ((payload as { email: string }).email !== user.email) {
      throw new NotFoundException(`Invalid token`);
    }
    await this.userRepository.update(user.id, { activated: true });
    user = await this.userRepository.findOneBy({ id: user.id });
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
