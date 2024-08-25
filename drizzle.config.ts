import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/infra/db/drizzle/schema/*',
  dialect: 'postgresql',
  out: 'drizzle',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
