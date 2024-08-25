import { DatabaseModule } from '@infra/db/database.module';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService, GenericAuthService } from './services/auth.service';
import { LocalStrategy } from './services/strategies/local.strategy';
import { PasswordHasher } from './services/password-hasher';
import { BcryptPasswordHasher } from './services/bcrypt-password-hasher.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtExpiresIn, jwtSecret } from './constants';
import { JwtStrategy } from './services/strategies/jwt.strategy';

@Module({
  imports: [
    DatabaseModule,
    PassportModule,
    JwtModule.register({
      secret: jwtSecret,
      signOptions: {
        expiresIn: jwtExpiresIn,
      },
    }),
  ],
  providers: [
    {
      provide: AuthService,
      useClass: GenericAuthService,
    },
    {
      provide: PasswordHasher,
      useClass: BcryptPasswordHasher,
    },
    LocalStrategy,
    JwtStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
