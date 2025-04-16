import type { NextConfig } from "next";
import { version } from "./package.json"

const nextConfig: NextConfig = {
  env: {
    version
  },
};

export default nextConfig;
