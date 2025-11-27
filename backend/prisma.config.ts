import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

const _config = {
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  // Use the classic binary engine to maintain compatibility without driver adapters
  engine: 'classic',
  datasource: {
    url: env('DATABASE_URL'),
  },
} as unknown as any;

export default defineConfig(_config);
