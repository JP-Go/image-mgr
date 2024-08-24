import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class SignUpDto {
  @IsNotEmpty({
    message: 'username is required',
  })
  @MinLength(3, {
    message: 'Username must be at least 3 characters long',
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
    message: 'Password is required',
  })
  @MinLength(8, {
    message: 'Password must be at least 8 characters',
  })
  @MaxLength(255, {
    message: 'Password must be at most 255 characters',
  })
  password: string;
}
