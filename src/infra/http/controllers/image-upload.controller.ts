import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseFilePipeBuilder,
  Post,
  Req,
  Res,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Express, Request, Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadImageDto } from '../dtos/upload-image.dto';
import { JwtGuard } from '@app/services/strategies/jwt.guard';
import { maxFileSize, oneMBInBytes } from '@app/constants';
import { ImageValidatorPipe } from '../validators/ImageValidatorPipe';
import { ImageUploaderService } from '@app/services/image-uploader.service';
import { UUID } from '@domain/value-objects/uuid';
import { createReadStream } from 'node:fs';

@Controller('images')
export class ImageUploadController {
  constructor(private readonly imageUploadService: ImageUploaderService) {}

  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(JwtGuard)
  async uploadImage(
    @Body() metadata: UploadImageDto,
    @Req() req: Express.Request,
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
    return this.imageUploadService.uploadImage(
      file,
      metadata.filename,
      new UUID((req.user as { userId: string }).userId),
    );
  }

  @Get()
  @UseGuards(JwtGuard)
  findAll(@Req() req: Request) {
    return this.imageUploadService.findAllByUserId(
      new UUID((req.user as { userId: string }).userId),
    );
  }

  @Delete(':imageUploadId')
  @UseGuards(JwtGuard)
  delete(@Req() req: Request, @Param('imageUploadId') imageUploadId: string) {
    return this.imageUploadService.deleteImage(
      new UUID(imageUploadId),
      new UUID((req.user as { userId: string }).userId),
    );
  }

  @Get(':imageUploadId')
  @UseGuards(JwtGuard)
  findImageById(
    @Req() req: Request,
    @Param('imageUploadId') imageUploadId: string,
  ) {
    return this.imageUploadService.findImageById(
      new UUID(imageUploadId),
      new UUID((req.user as { userId: string }).userId),
    );
  }

  @Get(':imageUploadId/view')
  @UseGuards(JwtGuard)
  async viewImage(
    @Req() req: Request,
    @Param('imageUploadId') imageUploadId: string,
    @Res() res: Response,
  ) {
    const image = await this.imageUploadService.findImageById(
      new UUID(imageUploadId),
      new UUID((req.user as { userId: string }).userId),
    );
    res.status(302).redirect(image.url);
  }
}
