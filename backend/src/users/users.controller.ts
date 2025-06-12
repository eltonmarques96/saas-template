import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Put,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ReturnUserDto } from './dto/return-user.dto';
import { Public } from '@/metadata';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<ReturnUserDto> {
    return await this.usersService
      .create(createUserDto)
      .then((user) => new ReturnUserDto(user));
  }

  @Public()
  @Post('/forgotpassword')
  async forgotpassword(
    @Body() { email }: { email: string },
  ): Promise<{ status: number; body: { message: string } }> {
    return await this.usersService.forgotpassword(email);
  }

  @Public()
  @Post('/resetpassword')
  async resetpassword(
    @Body() { token, newPassword }: { token: string; newPassword: string },
  ): Promise<{ status: number; body: { message: string } }> {
    return await this.usersService.resetPassword(token, newPassword);
  }

  @Public()
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ReturnUserDto> {
    return await this.usersService
      .findOne(id)
      .then((user) => new ReturnUserDto(user));
  }

  @Public()
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ReturnUserDto> {
    return await this.usersService
      .update(id, updateUserDto)
      .then((user) => new ReturnUserDto(user));
  }

  @Public()
  @Put('/verify')
  async verify(@Query('token') token: string): Promise<ReturnUserDto> {
    return await this.usersService
      .verify(token)
      .then((user) => new ReturnUserDto(user));
  }

  @Public()
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.usersService.remove(id);
  }
}
