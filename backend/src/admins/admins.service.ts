import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { UsersService } from '@/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RoleType } from '@/users/entities/user.entity';
import { PinoLogger } from 'nestjs-pino';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class AdminsService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private readonly logger: PinoLogger,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
  async signIn(login: string, pass: string): Promise<{ token: string }> {
    try {
      const user = await this.usersService.findByEmail(login.toLowerCase());

      const isPasswordValid = await bcrypt.compare(pass, user.password);
      if (!isPasswordValid || !user) {
        throw new UnauthorizedException('Usuário não autorizado');
      }
      if (user.role !== RoleType.admin) {
        throw new UnauthorizedException('Usuário não autorizado');
      }
      if (user.activated === false) {
        throw new UnauthorizedException(
          'Conta ainda não validada, por favor, verifique a sua caixa de e-mail',
        );
      }
      const payload = { sub: user.id, role: user.role };
      return {
        token: await this.jwtService.signAsync(payload),
      };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  overview() {
    try {
      const result = {
        total_usuarios: 0,
        total_veiculos: 0,
        total_bicicletas: 0,
      };
      return result;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
  findAll() {
    return `This action returns all admins`;
  }

  findOne(id: number) {
    return `This action returns a #${id} admin`;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(id: number, updateAdminDto: UpdateAdminDto) {
    return `This action updates a #${id} admin`;
  }

  remove(id: number) {
    return `This action removes a #${id} admin`;
  }
}
