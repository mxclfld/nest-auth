import { Length } from 'class-validator';

export class CreateUserDto {
  @Length(3)
  readonly name: string;

  @Length(3)
  readonly username: string;

  @Length(6)
  password: string;
}
