import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class SignUpDto {
  @ApiProperty({
    required: true,
    type: String,
  })
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
  @ApiProperty({
    required: true,
    type: String,
  })
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
  @ApiProperty({
    required: true,
    type: String,
  })
  password: string;
}
