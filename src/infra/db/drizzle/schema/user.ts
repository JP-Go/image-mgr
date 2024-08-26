import { relations } from 'drizzle-orm';
import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core';
import { imageUpload } from './image';

export const user = pgTable('users', {
  id: uuid('user_id').defaultRandom().primaryKey(),
  username: varchar('username', { length: 120 }).notNull(),
  password: varchar('password', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
});

export const userRelations = relations(user, ({ many }) => ({
  id: many(imageUpload, {
    relationName: 'uploaded_by',
  }),
}));
