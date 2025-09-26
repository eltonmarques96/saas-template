import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '@/users/entities/user.entity';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, pass: string): Promise<{ token: string }> {
    const user = await this.usersService.findByEmail(email);

    const isPasswordValid = await bcrypt.compare(pass, user.password);
    if (!isPasswordValid || !user || user.activated === false) {
      throw new UnauthorizedException('User not enabled');
    }
    const payload = { sub: user.id, role: user.role };

    return {
      token: await this.jwtService.signAsync(payload),
    };
  }

  async profile(userId: string): Promise<User> {
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }
}
