import { Image } from '@domain/entities/image';
import { UUID } from '@domain/value-objects/uuid';

export abstract class ImageRepository {
  abstract save(image: Image): Promise<Image>;
  abstract create(image: Image): Promise<Image>;
  abstract findById(imageId: UUID): Promise<Image | null>;
  abstract findByHash(hash: string): Promise<Image | null>;
  abstract delete(imageId: UUID): Promise<void>;
}
