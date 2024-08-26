import { ImageUpload } from '@domain/entities/image-upload';
import { UUID } from '@domain/value-objects/uuid';

export abstract class ImageUploadRepository {
  abstract save(imageUpload: ImageUpload): Promise<ImageUpload>;
  abstract findById(imageUploadId: UUID): Promise<ImageUpload | null>;
  abstract delete(imageUploadId: UUID): Promise<void>;
  abstract findByUser(user: UUID): Promise<ImageUpload[]>;
}
