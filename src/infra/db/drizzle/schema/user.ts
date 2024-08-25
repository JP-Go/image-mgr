import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core';

export const user = pgTable('users', {
  id: uuid('user_id').defaultRandom().primaryKey(),
  username: varchar('username', { length: 120 }).notNull(),
  password: varchar('password', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
});
