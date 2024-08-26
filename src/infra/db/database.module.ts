import { DrizzlePostgresModule } from '@knaadh/nestjs-drizzle-postgres';
import { Global, Module } from '@nestjs/common';
import { DrizzleUserRepository } from './drizzle/repositories/drizzle-user.repository';
import * as schema from './drizzle/schema';
import { UserRepository } from '@domain/repositories/user.repository';
import { ImageRepository } from '@domain/repositories/image.repository';
import { DrizzleImageRepository } from './drizzle/repositories/drizzle-image.repository';
import { ImageUploadRepository } from '@domain/repositories/image-upload.repository';
import { DrizzleImageUploadRepository } from './drizzle/repositories/drizzle-image-upload.repository';

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
              ...schema,
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
    {
      provide: ImageRepository,
      useClass: DrizzleImageRepository,
    },
    {
      provide: ImageUploadRepository,
      useClass: DrizzleImageUploadRepository,
    },
  ],
  exports: [UserRepository, ImageRepository, ImageUploadRepository],
})
export class DatabaseModule {}
