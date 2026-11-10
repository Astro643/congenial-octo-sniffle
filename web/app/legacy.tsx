import { useEffect, useState } from "react"
import { motion } from "framer-motion"

const pages = import.meta.glob("../*.html", { query: "?raw", import: "default", eager: true }) as Record<string, string>

function bodyOf(document: string) {
  return document.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1] ?? document
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
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
    >
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </motion.div>
  )
}
