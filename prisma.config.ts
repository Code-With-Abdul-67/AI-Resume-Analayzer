// prisma.config.ts
import "dotenv/config"; // Important: Loads .env for CLI commands like 'db push'
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // We use process.env directly here to avoid strict validation during build 
    // if the variable is missing but not strictly needed for the current step.
    url: process.env.DIRECT_URL || "",
  },
  migrations: {
    path: "prisma/migrations",
  },
});