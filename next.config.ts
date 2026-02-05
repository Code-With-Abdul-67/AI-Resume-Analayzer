import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  serverExternalPackages: ["unpdf"], // Crucial for PDF parsing
};

export default nextConfig;