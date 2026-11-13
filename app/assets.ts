import { createAssetServer } from "remix/assets"

const nodeEnv = process.env.NODE_ENV ?? "development"
const isDevelopment = nodeEnv === "development"
const isProduction = nodeEnv === "production"

export const assets = createAssetServer({
  basePath: "/assets",
  rootDir: process.cwd(),

  allowFiles: ["app/routes.ts", "app/**/public/**", "app/ui/**"],
  allowPackages: ["remix"],
  denyFiles: ["app/**/*.test.*"],
  sourceMaps: isDevelopment ? "external" : undefined,
  minify: !isDevelopment,
  fingerprint: isProduction,
  watch: isDevelopment,
})

export const scriptEntry = await assets.getScriptEntry("app/actions/public/entry.ts")
