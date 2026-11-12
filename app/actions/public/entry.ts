import {
  detectMultipleImportMapSupport,
  importModule,
  preloadShim,
} from "remix/multiple-import-maps-polyfill"
import { run } from "remix/component"

import { startMotion } from "./motion.ts"
import { startParticles } from "./particles.ts"

run({
  async loadModule(moduleUrl, exportName) {
    const mod = await importModule(moduleUrl)
    const Component = mod[exportName]
    if (typeof Component !== "function") {
      throw new Error(`Unknown component: ${moduleUrl}#${exportName}`)
    }
    return Component
  },
  async processClientEntryPreloads(preloads) {
    if (await detectMultipleImportMapSupport()) return preloads

    preloadShim(preloads)
    return []
  },
})

startMotion()
startParticles()
