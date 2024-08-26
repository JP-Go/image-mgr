import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { SignUpDto } from '../dtos/sign-up-dto';
import { AuthService } from '@app/services/auth.service';
import { User } from '@domain/entities/user';
import { LocalGuard } from '@app/services/strategies/local.guard';
import { Request } from 'express';
import { JwtGuard } from '@app/services/strategies/jwt.guard';
import { ApiBearerAuth, ApiResponse, ApiSecurity } from '@nestjs/swagger';

@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalGuard)
  @Post('/login')
  @ApiResponse({
    status: 201,
    description: 'User logged in successfully',
    schema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'User profile not found',
  })
  async login(@Req() req: Request) {
    return this.authService.login(req.user as User);
  }

  @Post('/sign-up')
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    schema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
        },
      },
    },
  })
  @ApiResponse({ status: 402, description: 'Email already taken' })
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
  @ApiResponse({
    status: 200,
    description: 'User profile found',
    schema: {
      type: 'object',
      properties: {
        userId: {
          type: 'string',
        },
        email: {
          type: 'string',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'User profile not found',
  })
  @ApiBearerAuth()
  async profile(@Req() req: Request) {
    return req.user;
  }
}
