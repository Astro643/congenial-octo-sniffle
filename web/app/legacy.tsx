import { useEffect, useState } from "react"

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

  return <div dangerouslySetInnerHTML={{ __html: html }} />
}
