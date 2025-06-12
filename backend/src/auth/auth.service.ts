import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ReturnUserDto } from '@/users/dto/return-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    email: string,
    pass: string,
  ): Promise<{ token: string; user: ReturnUserDto }> {
    const user = await this.usersService.findByEmail(email);

    const isPasswordValid = await bcrypt.compare(pass, user.password);

    if (!isPasswordValid || !user || user.enabled === false) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.id, user: user };
    return {
      user: user,
      token: await this.jwtService.signAsync(payload),
    };
  }
}
