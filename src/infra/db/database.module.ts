import { DrizzlePostgresModule } from '@knaadh/nestjs-drizzle-postgres';
import { Global, Module } from '@nestjs/common';
import { DrizzleUserRepository } from './drizzle/repositories/drizzle-user.repository';
import * as userSchema from './drizzle/schema/user';
import { UserRepository } from '@domain/repositories/user.repository';

@Global()
@Module({
  imports: [
    DrizzlePostgresModule.registerAsync({
      tag: 'DRIZZLE_DB',
      useFactory() {
        return {
          postgres: {
            url: process.env.DATABASE_URL,
          },
          config: {
            schema: {
              ...userSchema,
            },
          },
        };
      },
    }),
  ],
  providers: [
    {
      provide: UserRepository,
      useClass: DrizzleUserRepository,
    },
  ],
  exports: [UserRepository],
})
export class DatabaseModule {}
