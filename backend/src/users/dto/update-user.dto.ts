import { IsEmail, IsString, Length } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  id?: string;
  @IsString()
  readonly firstName?: string;
  @IsString()
  readonly lastName?: string;
  @IsEmail()
  readonly email?: string;
  @IsString()
  @Length(6, 15)
  readonly phone?: string;
}
