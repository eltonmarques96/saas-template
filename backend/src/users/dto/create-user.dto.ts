export class CreateUserDto {
  readonly id?: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly phone: string;
  readonly password: string;
  readonly createdAt?: string;
  readonly updatedAt?: string;
}
