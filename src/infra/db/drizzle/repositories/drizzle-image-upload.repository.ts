import { Inject, Injectable } from '@nestjs/common';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../schema';
import { ImageUploadRepository } from '@domain/repositories/image-upload.repository';
import { ImageUpload } from '@domain/entities/image-upload';
import { UUID } from '@domain/value-objects/uuid';
import { eq } from 'drizzle-orm';
import { DrizzleImageUploadMapper } from '../mappers/drizzle-image-upload.mapper';

@Injectable()
export class DrizzleImageUploadRepository implements ImageUploadRepository {
  constructor(
    @Inject('DRIZZLE_DB')
    private readonly db: PostgresJsDatabase<typeof schema>,
  ) {}
  async findByUser(userId: UUID): Promise<ImageUpload[]> {
    const uploads = await this.db.query.imageUpload.findMany({
      where: eq(schema.imageUpload.uploadedById, userId.value),
      with: {
        image: true,
        uploadedBy: true,
      },
    });

    return uploads.map((upload) => DrizzleImageUploadMapper.toDomain(upload));
  }
  async save(imageUpload: ImageUpload): Promise<ImageUpload> {
    const imageUploadData = DrizzleImageUploadMapper.toPersistence(imageUpload);
    const [newUpload] = await this.db
      .insert(schema.imageUpload)
      .values(imageUploadData)
      .onConflictDoUpdate({
        target: schema.imageUpload.id,
        set: {
          uploadStatus: imageUpload.status,
          uploadedAt: imageUpload.uploadedAt,
        },
      })
      .returning();

    return DrizzleImageUploadMapper.toDomain(newUpload);
  }
  async findById(imageUploadId: UUID): Promise<ImageUpload | null> {
    const imageUpload = await this.db.query.imageUpload.findFirst({
      where: eq(schema.imageUpload.id, imageUploadId.toString()),
      with: {
        image: true,
        uploadedBy: true,
      },
    });
    return DrizzleImageUploadMapper.toDomain(imageUpload);
  }
  async delete(imageUploadId: UUID): Promise<void> {
    await this.db
      .delete(schema.imageUpload)
      .where(eq(schema.imageUpload.id, imageUploadId.value))
      .execute();
  }
}
