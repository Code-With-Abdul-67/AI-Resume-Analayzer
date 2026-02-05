import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // This will pull DATABASE_URL from your .env file
    url: env("DATABASE_URL"),
  },
});