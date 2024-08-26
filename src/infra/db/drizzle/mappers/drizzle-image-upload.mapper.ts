import { ImageUpload } from '@domain/entities/image-upload';
import * as schema from '../schema';
import { UUID } from '@domain/value-objects/uuid';
import { DrizzleImageMapper } from './drizzle-image.mapper';
import { DrizzleUserMapper } from './drizzle-user.mapper';

type DbImageUpload = typeof schema.imageUpload.$inferSelect & {
  image?: typeof schema.image.$inferSelect;
  uploadedBy?: typeof schema.user.$inferSelect;
};

export class DrizzleImageUploadMapper {
  static toPersistence(
    imageUpload: ImageUpload,
  ): typeof schema.imageUpload.$inferInsert & {
    id?: string;
    uploadedById?: string;
    imageId?: string;
  } {
    return {
      id: imageUpload.id.value,
      uploadStatus: imageUpload.status,
      uploadedAt: imageUpload.uploadedAt,
      imageId: imageUpload.image.id.value,
      uploadedById: imageUpload.owner.id.value,
    };
  }
  static toDomain(
    dbImageUpload: DbImageUpload | undefined,
  ): ImageUpload | null {
    if (dbImageUpload === undefined) {
      return null;
    }
    const imageUpload = new ImageUpload({
      id: new UUID(dbImageUpload.id),
      image:
        dbImageUpload?.image !== undefined
          ? DrizzleImageMapper.toDomain(dbImageUpload.image)
          : null,
      uploadedBy:
        dbImageUpload?.uploadedBy !== undefined
          ? DrizzleUserMapper.toDomain(dbImageUpload.uploadedBy)
          : null,
      status: dbImageUpload.uploadStatus,
      uploadedAt: dbImageUpload.uploadedAt,
    });
    return imageUpload;
  }
}
