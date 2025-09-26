import { IS_ADMIN_KEY, IS_PUBLIC_KEY } from '@/utils/decorators/metadata';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly publicRoutes: string[] = [
    '/metrics',
    '/health',
    '/auth/login',
    '/auth/register',
  ];

  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const path = request.path;
    const isWhitelisted = this.publicRoutes.includes(path);

    if (isPublic || isWhitelisted) {
      return true;
    }

    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Autorização inválida');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      request['user'] = payload;

      const isAdminRequired = this.reflector.getAllAndOverride<boolean>(
        IS_ADMIN_KEY,
        [context.getHandler(), context.getClass()],
      );

      if (isAdminRequired && payload.role !== 'admin') {
        throw new ForbiddenException('Acesso restrito');
      }
    } catch {
      throw new UnauthorizedException('Autorização inválida');
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
