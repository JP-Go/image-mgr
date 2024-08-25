import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { SignUpDto } from '../dtos/sign-up-dto';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '@app/services/auth.service';
import { User } from '@app/domain/entities/user';

@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('/login')
  async login(@Request() req) {
    return req.user;
  }

  @Post('/sign-up')
  async signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.singUp(
      new User({
        password: signUpDto.password,
        email: signUpDto.email,
        username: signUpDto.username,
      }),
    );
  }

  @Get('/me')
  async profile(@Request() req) {
    return req.user;
  }
}
