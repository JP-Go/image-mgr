import {
  Body,
  Controller,
  ParseFilePipeBuilder,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadImageDto } from '../dtos/upload-image.dto';
import { JwtGuard } from '@app/services/strategies/jwt.guard';
import { maxFileSize, oneMBInBytes } from '@app/constants';
import { ImageValidatorPipe } from '../validators/ImageValidatorPipe';

@Controller('images')
export class ImageUploadController {
  constructor() {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(JwtGuard)
  async uploadImage(
    @Body() metadata: UploadImageDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({
          maxSize: maxFileSize,
          message:
            'File is too large. Max file size is ' +
            (maxFileSize / oneMBInBytes).toPrecision(2) +
            ' MB',
        })
        .addValidator(new ImageValidatorPipe({}))
        .build(),
    )
    file: Express.Multer.File,
  ) {
    return { filename: file.filename, body: metadata.filename };
  }
}
