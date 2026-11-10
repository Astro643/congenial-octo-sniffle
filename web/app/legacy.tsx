import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Particles, { ParticlesProvider } from "@tsparticles/react"
import { loadSlim } from "@tsparticles/slim"

const pages = import.meta.glob("../*.html", { query: "?raw", import: "default", eager: true }) as Record<string, string>

function bodyOf(document: string) {
  return document.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1] ?? document
}

function ParticleBackdrop() {
  return (
    <ParticlesProvider init={loadSlim}>
      <Particles
      id="dashboard-particles"
      className="particle-backdrop"
      options={{
        background: { color: "transparent" },
        fpsLimit: 60,
        particles: {
          color: { value: ["#7dd3fc", "#a78bfa", "#c4b5fd"] },
          links: {
            color: "#93c5fd",
            distance: 150,
            enable: true,
            opacity: 0.16,
            width: 1,
          },
          move: { direction: "none", enable: true, outModes: "bounce", speed: 0.35 },
          number: { density: { enable: true, area: 1100 }, value: 42 },
          opacity: { value: { min: 0.22, max: 0.65 } },
          size: { value: { min: 1, max: 2.4 } },
        },
        interactivity: {
          events: {
            onHover: { enable: true, mode: "repulse" },
            resize: { enable: true },
          },
          modes: { repulse: { distance: 105, duration: 0.4, speed: 0.65 } },
        },
        detectRetina: true,
      }}
      />
    </ParticlesProvider>
  )
}

export function LegacyPage({ file }: { file: string }) {
  const [html, setHtml] = useState(() => bodyOf(pages[`../${file}`] ?? "<main><div class='wrap page'><h1>Page not found</h1></div></main>"))

  useEffect(() => {
    const config = document.createElement("script")
    config.src = "/config.js"
    const widget = document.createElement("script")
    widget.src = "/widget.js"
    widget.defer = true
    const site = document.createElement("script")
    site.src = "/site.js"
    site.defer = true
    document.body.append(config, widget, site)
    return () => { config.remove(); widget.remove(); site.remove() }
  }, [])

  useEffect(() => {
    const root = document.querySelector<HTMLElement>("[data-legacy-page]")
    if (!root) return

    const groups = [
      root.querySelectorAll<HTMLElement>(".sidebar, [data-sidebar]"),
      root.querySelectorAll<HTMLElement>(".log-item, [data-log-item], .step, [data-step]"),
    ]

    groups.forEach((items) => {
      items.forEach((item, index) => {
        item.style.setProperty("--motion-index", String(index))
        item.classList.add("motion-ready")
      })
    })
  }, [html])

  return (
    <motion.div
      data-legacy-page
      className="legacy-page-shell"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      >
      <ParticleBackdrop />
      <div className="legacy-page-content" dangerouslySetInnerHTML={{ __html: html }} />
    </motion.div>
  )
}
