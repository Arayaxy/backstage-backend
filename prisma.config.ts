import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'src/models/',
  migrations: {
    path: 'migrations',
  },
  datasource: {
    url: process.env['POSTGRES_PRISMA_URL'] ?? process.env['DATABASE_URL'],
  },
});
