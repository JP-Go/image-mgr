import { Image } from '@domain/entities/image';
import { image as DbImage } from '../schema/image';
import { UUID } from '@domain/value-objects/uuid';

export class DrizzleImageMapper {
  static toPersistence(
    image: Image,
  ): typeof DbImage.$inferInsert & { id?: string } {
    return {
      id: image.id.value,
      hash: image.hash,
      url: image.url,
      externalIdentity: image.externalIdentity,
      filename: image.filename,
      slug: image.slug,
      createdAt: image.createdAt,
      updatedAt: image.updatedAt,
    };
  }
  static toDomain(dbImage: typeof DbImage.$inferSelect): Image | null {
    if (dbImage === undefined) {
      return null;
    }
    const image = new Image({
      id: new UUID(dbImage.id),
      hash: dbImage.hash,
      url: dbImage.url,
      filename: dbImage.filename,
    });
    image.setCreatedAt(dbImage.createdAt);
    image.setUpdatedAt(dbImage.updatedAt);
    image.setSlug(dbImage.slug);
    return image;
  }
}
