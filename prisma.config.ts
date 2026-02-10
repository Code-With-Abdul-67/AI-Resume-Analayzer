// prisma.config.ts
import "dotenv/config"; // Important: Loads .env for CLI commands like 'db push'
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // Vercel Postgres provides POSTGRES_PRISMA_URL as the pooled connection
    url: env("DATABASE_URL"), 
  },
  migrations: {
    path: "prisma/migrations",
  },
});