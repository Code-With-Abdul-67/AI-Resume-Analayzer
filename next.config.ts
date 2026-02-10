import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  serverExternalPackages: ["unpdf", "@prisma/client"], // Crucial for PDF parsing and Prisma
};

export default nextConfig;