import { FileValidator } from '@nestjs/common';

export class ImageValidatorPipe extends FileValidator<
  Record<string, never>,
  Express.Multer.File
> {
  private readonly magicNumbers = {
    gif: Buffer.from([0x47, 0x49, 0x46, 0x38]),
    png: Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    jpg: Buffer.from([0xff, 0xd8, 0xff]),
    jpeg: Buffer.from([0xff, 0xd8, 0xff]),
  };

  private readonly mimeTypes = {
    'image/gif': 'gif',
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpeg',
  };

  isValid(file?: Express.Multer.File): boolean | Promise<boolean> {
    return this.isFileValid(file);
  }

  private isFileValid(file: Express.Multer.File): boolean {
    const validMimeType = file.mimetype in this.mimeTypes;
    const signature = this.magicNumbers[this.mimeTypes[file.mimetype]];
    const validSignature = file.buffer
      .subarray(0, signature?.length)
      .equals(signature);
    return validMimeType && validSignature;
  }
  buildErrorMessage(file: any): string {
    return 'File is not an supported image';
  }
}
