import { useEffect, useRef, type ReactNode } from "react"
import { useLocation } from "@remix-run/react"
import { motion } from "framer-motion"

const SLIDE_IN = ".sidebar, [data-sidebar]"
const DROP_IN = ".log-item, [data-log-item], .step, [data-step]"

export function PageMotion({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  const firstRender = useRef(true)
  const container = useRef<HTMLDivElement>(null)
  const isFirst = firstRender.current

  useEffect(() => {
    firstRender.current = false
    const root = container.current
    if (!root) return
    for (const selector of [SLIDE_IN, DROP_IN]) {
      root.querySelectorAll<HTMLElement>(selector).forEach((item, index) => {
        item.style.setProperty("--motion-index", String(index))
        item.classList.add("motion-ready")
      })
    }
  }, [pathname])

  return (
    <motion.div
      ref={container}
      key={pathname}
      className="page-motion"
      initial={isFirst ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
