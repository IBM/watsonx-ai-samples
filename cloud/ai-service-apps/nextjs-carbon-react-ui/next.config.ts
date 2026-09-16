import type { NextConfig } from "next";
import { version } from "./package.json";
import path from "path";

const plexFontPath = path.resolve(__dirname, "node_modules/@ibm/plex");

const nextConfig: NextConfig = {
  env: {
    version,
  },
  sassOptions: {
    loadPaths: [path.resolve(__dirname, "node_modules")],
    additionalData: `@use "@carbon/styles/scss/config" with ($font-path: "${plexFontPath}");`,
  },
};

export default nextConfig;
