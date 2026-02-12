// prisma.config.ts
import "dotenv/config"; // Important: Loads .env for CLI commands like 'db push'
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // Uses Vercel's provided PRISMA_DATABASE_URL
    url: process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL || "",
  },
  migrations: {
    path: "prisma/migrations",
  },
});