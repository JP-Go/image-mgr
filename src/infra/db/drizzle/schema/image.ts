import { pgEnum, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { user } from './user';
import { relations } from 'drizzle-orm';

export const image = pgTable('images', {
  id: uuid('image_id').defaultRandom().primaryKey(),
  filename: varchar('filename', { length: 255 }).notNull(),
  url: varchar('url', { length: 255 }).notNull(),
  hash: varchar('hash', { length: 255 }).notNull().unique(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  externalIdentity: varchar('external_identity', { length: 255 }).notNull(),
  createdAt: timestamp('created_at', {
    withTimezone: true,
    mode: 'date',
  }).notNull(),
  updatedAt: timestamp('updated_at', {
    withTimezone: true,
    mode: 'date',
  }).notNull(),
});

export const imageUploadStatus = pgEnum('image_upload_status', [
  'pending',
  'success',
  'failed',
]);

export const imageUpload = pgTable('image_uploads', {
  id: uuid('image_upload_id').defaultRandom().primaryKey(),
  imageId: uuid('image_id').references(() => image.id),
  uploadedById: uuid('uploaded_by').references(() => user.id),
  uploadedAt: timestamp('created_at', {
    withTimezone: true,
    mode: 'date',
  }).notNull(),
  uploadStatus: imageUploadStatus('upload_status').notNull(),
});

export const imageUploadRelations = relations(imageUpload, ({ one }) => ({
  uploadedBy: one(user, {
    fields: [imageUpload.uploadedById],
    references: [user.id],
    relationName: 'uploaded_by',
  }),
  image: one(image, {
    fields: [imageUpload.imageId],
    references: [image.id],
    relationName: 'image_id',
  }),
}));

export const imageRelations = relations(image, ({ many }) => ({
  imageUpload: many(user, {
    relationName: 'image_id',
  }),
}));
