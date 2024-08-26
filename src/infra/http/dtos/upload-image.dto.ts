import { ApiProperty } from '@nestjs/swagger';

export class UploadImageDto {
  @ApiProperty({
    name: 'filename',
    type: String,
  })
  filename: string;

  @ApiProperty({
    name: 'file',
    format: 'binary',
    type: 'file',
  })
  file: any;
}
