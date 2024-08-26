import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthModule } from '@app/auth.module';
import { ImageUploadController } from './controllers/image-upload.controller';
import { ImageUploadModule } from '@app/image-upload.module';

@Module({
  imports: [AuthModule, ImageUploadModule],
  controllers: [AuthController, ImageUploadController],
  providers: [],
})
export class HttpModule {}
