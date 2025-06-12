import { IsBoolean, IsEmail, IsString } from 'class-validator';
import { User } from '../entities/user.entity';

export class ReturnUserDto {
  @IsString()
  id: string;
  @IsString()
  firstName: string;
  @IsString()
  lastName: string;
  @IsString()
  phone?: string;
  @IsEmail()
  email: string;
  @IsBoolean()
  readonly activated: boolean;

  constructor(user: User) {
    this.id = user.id;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.phone = user.phone;
    this.email = user.email;
    this.activated = user.activated;
  }
}
