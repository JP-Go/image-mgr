import { DrizzlePostgresModule } from '@knaadh/nestjs-drizzle-postgres';
import { Global, Module } from '@nestjs/common';
import { DrizzleUserRepository } from './drizzle/repositories/drizzle-user.repository';
import * as userSchema from './drizzle/schema/user';

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
  providers: [DrizzleUserRepository],
  exports: [DrizzleUserRepository],
})
export class DatabaseModule {}
