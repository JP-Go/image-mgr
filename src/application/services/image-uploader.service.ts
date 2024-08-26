import { UUID } from '@domain/value-objects/uuid';

export type ImageUploadResponse = {
  id: string;
  url: string;
  status: 'success' | 'failed' | 'pending';
};

export type ImageUploadResponseCollection = ImageUploadResponse[];

export type UsersImageUploadsResponse = {
  userId: string;
  uploads: ImageUploadResponseCollection;
};

// TODO: refactor this class to not need the user Id all the time
export abstract class ImageUploaderService {
  abstract uploadImage(
    image: Express.Multer.File,
    filename: string,
    userId: UUID,
  ): Promise<ImageUploadResponse>;

  abstract findAllByUserId(userId: UUID): Promise<UsersImageUploadsResponse>;

  abstract deleteImage(imageUploadId: UUID, userId: UUID): Promise<void>;

  abstract findImageById(
    imageUploadId: UUID,
    userId: UUID,
  ): Promise<ImageUploadResponse>;
}
