/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Body,
  Controller,
  Get,
  Post,
  HttpCode,
  HttpStatus,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';

import { Public } from '@/metadata';
import { AuthUserDTO } from './dto/auth-user.dto';
import {
  ApiBody,
  ApiForbiddenResponse,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
        },
        password: {
          type: 'string',
        },
      },
      required: ['email', 'password'],
    },
  })
  @ApiResponse({ status: 200, description: 'User authenticated' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @ApiOperation({ summary: 'Authenticated User' })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() signInDto: Record<string, any>): Promise<AuthUserDTO> {
    return await this.authService.signIn(signInDto.email, signInDto.password);
  }

  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @ApiOperation({ summary: 'Get authenticated user info' })
  @Get('profile')
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer Token',
  })
  @ApiOkResponse({
    description: 'Return User Info',
  })
  async getProfile(@Request() req): Promise<AuthUserDTO> {
    try {
      const user = await this.authService.profile(req.data.sub);
      const response = new AuthUserDTO(200, req.token, user);
      return response;
    } catch (error: any) {
      const response = new AuthUserDTO(
        HttpStatus.UNAUTHORIZED,
        null,
        null,
        typeof error.message === 'string' ? error.message : 'Unauthorized',
      );
      return response;
    }
  }
}
