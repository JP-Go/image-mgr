import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Param,
  ParseFilePipeBuilder,
  Post,
  Req,
  Res,
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
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiFoundResponse,
  ApiResponse,
} from '@nestjs/swagger';

@Controller('images')
@ApiBearerAuth()
export class ImageUploadController {
  constructor(private readonly imageUploadService: ImageUploaderService) {}

  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(JwtGuard)
  @ApiResponse({
    status: 201,
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        url: { type: 'string' },
        status: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'File size is too large',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        error: { type: 'string' },
        statusCode: { type: 'string' },
      },
    },
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 422,
    description: 'Upload failed',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
  })
  @ApiConsumes('multipart/form-data')
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
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'List of images',
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'string' },
        images: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              url: { type: 'string' },
              status: { type: 'string' },
            },
          },
        },
      },
    },
  })
  findAll(@Req() req: Request) {
    return this.imageUploadService.findAllByUserId(
      new UUID((req.user as { userId: string }).userId),
    );
  }

  @Delete(':imageUploadId')
  @UseGuards(JwtGuard)
  @ApiResponse({
    status: 200,
    description: 'Image deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Image not found',
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 422,
    description: 'Delete failed. You are not the owner of this image',
  })
  delete(@Req() req: Request, @Param('imageUploadId') imageUploadId: string) {
    return this.imageUploadService.deleteImage(
      new UUID(imageUploadId),
      new UUID((req.user as { userId: string }).userId),
    );
  }

  @Get(':imageUploadId')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Image found',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        url: { type: 'string' },
        status: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Image not found',
  })
  @ApiResponse({
    status: 422,
    description: 'Failed. You are not the owner of this image',
  })
  @ApiBearerAuth()
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
  @ApiBearerAuth()
  @ApiFoundResponse({
    description: 'Image found',
  })
  @ApiResponse({
    status: 404,
    description: 'Image not found',
  })
  @ApiResponse({
    status: 422,
    description: 'Failed. You are not the owner of this image',
  })
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
