import { Image } from '@domain/entities/image';
import { ImageRepository } from '@domain/repositories/image.repository';
import { UUID } from '@domain/value-objects/uuid';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../schema';
import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DrizzleImageMapper } from '../mappers/drizzle-image.mapper';

@Injectable()
export class DrizzleImageRepository implements ImageRepository {
  constructor(
    @Inject('DRIZZLE_DB')
    private readonly db: PostgresJsDatabase<typeof schema>,
  ) {}

  async findByHash(hash: string): Promise<Image | null> {
    const image = await this.db.query.image.findFirst({
      where: eq(schema.image.hash, hash),
    });
    return DrizzleImageMapper.toDomain(image);
  }

  async findById(imageId: UUID): Promise<Image | null> {
    const image = await this.db.query.image.findFirst({
      where: eq(schema.image.id, imageId.value),
    });
    return DrizzleImageMapper.toDomain(image);
  }
  async save(image: Image): Promise<Image> {
    const insertData = DrizzleImageMapper.toPersistence(image);
    const [newImage] = await this.db
      .insert(schema.image)
      .values(insertData)
      .onConflictDoUpdate({
        target: schema.image.id,
        set: {
          hash: image.hash,
          filename: image.filename,
          externalIdentity: image.externalIdentity,
          url: image.url,
          slug: image.slug,
          updatedAt: image.updatedAt,
        },
      })
      .returning();
    return DrizzleImageMapper.toDomain(newImage);
  }
  async create(image: Image): Promise<Image> {
    const [newImage] = await this.db
      .insert(schema.image)
      .values({
        hash: image.hash,
        createdAt: image.createdAt,
        filename: image.filename,
        externalIdentity: image.externalIdentity,
        url: image.url,
        slug: image.slug,
        updatedAt: image.updatedAt,
      })
      .returning();
    return DrizzleImageMapper.toDomain(newImage);
  }
  async delete(imageId: UUID): Promise<void> {
    await this.db
      .delete(schema.image)
      .where(eq(schema.image.id, imageId.toString()))
      .execute();
  }
}
