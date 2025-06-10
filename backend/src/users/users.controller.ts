import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ReturnUserDto } from './dto/return-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<ReturnUserDto> {
    return await this.usersService
      .create(createUserDto)
      .then((user) => new ReturnUserDto(user));
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ReturnUserDto> {
    return await this.usersService
      .findOne(id)
      .then((user) => new ReturnUserDto(user));
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ReturnUserDto> {
    return await this.usersService
      .update(id, updateUserDto)
      .then((user) => new ReturnUserDto(user));
  }

  @Patch(':id')
  async verify(
    @Param('id') id: string,
    @Body() token: string,
  ): Promise<ReturnUserDto> {
    return await this.usersService
      .verify(id, token)
      .then((user) => new ReturnUserDto(user));
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.usersService.remove(id);
  }
}
