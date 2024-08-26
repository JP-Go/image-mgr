import { Module } from '@nestjs/common';
import { CloudinaryModule } from 'nestjs-cloudinary';
import { ImageUploaderService } from './services/image-uploader.service';
import { CloudinaryImageUploadService } from './services/cloudinary-image-upload.service';
import { DatabaseModule } from '@infra/db/database.module';

@Module({
  imports: [
    CloudinaryModule.forRootAsync({
      useFactory() {
        return {
          cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
          api_key: process.env.CLOUDINARY_API_KEY,
          api_secret: process.env.CLOUDINARY_API_SECRET,
        };
      },
    }),
    DatabaseModule,
  ],
  providers: [
    {
      provide: ImageUploaderService,
      useClass: CloudinaryImageUploadService,
    },
  ],
  exports: [ImageUploaderService],
})
export class ImageUploadModule {}
