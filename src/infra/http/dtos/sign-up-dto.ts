import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class SignUpDto {
  @IsNotEmpty({
    message: 'username is required',
  })
  @MinLength(3, {
    message: 'username must be at least 3 characters long',
  })
  @MaxLength(120, {
    message: 'username must be at most 120 characters long',
  })
  username: string;

  @IsEmail(
    {},
    {
      message: 'Invalid email',
    },
  )
  email: string;

  @IsNotEmpty({
    message: 'password is required',
  })
  @MinLength(8, {
    message: 'password must be at least 8 characters',
  })
  @MaxLength(255, {
    message: 'password must be at most 255 characters',
  })
  password: string;
}
