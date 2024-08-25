import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { SignUpDto } from '../dtos/sign-up-dto';
import { AuthService } from '@app/services/auth.service';
import { User } from '@domain/entities/user';
import { LocalGuard } from '@app/services/strategies/local.guard';
import { Request } from 'express';
import { JwtGuard } from '@app/services/strategies/jwt.guard';

@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalGuard)
  @Post('/login')
  async login(@Req() req: Request) {
    return this.authService.login(req.user as User);
  }

  @Post('/sign-up')
  async signUp(@Body() signUpDto: SignUpDto) {
    const user = await this.authService.singUp(
      new User({
        password: signUpDto.password,
        email: signUpDto.email,
        username: signUpDto.username,
      }),
    );
    return this.authService.login(user);
  }

  @UseGuards(JwtGuard)
  @Get('/me')
  async profile(@Req() req: Request) {
    return req.user;
  }
}
