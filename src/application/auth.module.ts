import { DatabaseModule } from '@infra/db/database.module';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService, GenericAuthService } from './services/auth.service';
import { LocalStrategy } from './services/strategies/local.strategy';
import { PasswordHasher } from './services/password-hasher';
import { BcryptPasswordHasher } from './services/bcrypt-password-hasher.service';

@Module({
  imports: [DatabaseModule, PassportModule],
  providers: [
    {
      provide: AuthService,
      useClass: GenericAuthService,
    },
    LocalStrategy,
    {
      provide: PasswordHasher,
      useClass: BcryptPasswordHasher,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
