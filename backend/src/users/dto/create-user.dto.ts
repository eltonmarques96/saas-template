import { IsEmail, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  readonly firstName: string;
  @IsString()
  readonly lastName: string;
  @IsEmail()
  readonly email: string;
  @IsString()
  @Length(6, 15)
  readonly phone: string;
  @IsString()
  readonly password: string;
}
