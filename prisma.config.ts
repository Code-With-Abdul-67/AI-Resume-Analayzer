// prisma.config.ts
import "dotenv/config"; // Important: Loads .env for CLI commands like 'db push'
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: env("DIRECT_URL"),
  },
  migrations: {
    path: "prisma/migrations",
  },
});