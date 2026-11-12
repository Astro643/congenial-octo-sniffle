import type { Handle, RemixNode } from "remix/component"
import { ImportMap } from "remix/component/server"

import { scriptEntry } from "../assets.ts"
import type { PageMeta } from "../lib/page.ts"

export interface DocumentProps {
  meta: PageMeta
  children?: RemixNode
}

const FONTS =
  "https://fonts.googleapis.com/css2?family=Anton&family=JetBrains+Mono:wght@400;500;600;700&display=swap"

export function Document(handle: Handle<DocumentProps>) {
  return () => {
    const { meta, children } = handle.props
    const { href, importMap, preloads } = scriptEntry

    return (
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <meta name="theme-color" content="#EEEDE8" />
          <title>{meta.title}</title>
          {meta.description ? <meta name="description" content={meta.description} /> : null}
          {meta.robots ? <meta name="robots" content={meta.robots} /> : null}
          <link
            rel="icon"
            href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M2.5 5h19L12 20.5z' fill='%23000'/%3E%3C/svg%3E"
          />
          <script>{"window.process = window.process || { env: { NODE_ENV: \"production\" } }"}</script>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link rel="stylesheet" href={FONTS} />
          {meta.styles.map((style) => (
            <link key={style} rel="stylesheet" href={style} />
          ))}
          <link rel="stylesheet" href="/motion.css" />
          <ImportMap value={importMap} />
          {preloads.map((preloadHref) => (
            <link key={preloadHref} rel="modulepreload" href={preloadHref} />
          ))}
        </head>
        <body>
          <div id="particle-backdrop" class="particle-backdrop" aria-hidden="true"></div>
          <div id="page-motion" class="page-motion">
            {children}
          </div>
          {meta.scripts.map((src) => (
            <script key={src} src={src}></script>
          ))}
          <script type="module" src={href}></script>
        </body>
      </html>
    )
  }
}
