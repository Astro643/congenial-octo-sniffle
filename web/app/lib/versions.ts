import pkg from "../../package.json"

const clean = (range: string) => range.replace(/^[^\d]*/, "")

export const remixVersion = clean(pkg.dependencies.remix)
export const framerMotionVersion = clean(pkg.dependencies["framer-motion"])
export const tsParticlesVersion = clean(pkg.dependencies["@tsparticles/react"])
