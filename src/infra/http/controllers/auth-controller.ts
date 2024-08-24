import { Controller, Get, Post } from '@nestjs/common';
import { LoginDto } from '../dtos/login-dto';
import { SignUpDto } from '../dtos/sign-up-dto';

@Controller('/auth')
export class AuthController {
  @Post('/login')
  async login(loginDto: LoginDto) {
    return loginDto;
  }

  @Post('/sign-up')
  async signUp(signUpDto: SignUpDto) {
    return signUpDto;
  }

  @Get('/me')
  async profile() {
    return 'Should return the current user profile';
  }
}
