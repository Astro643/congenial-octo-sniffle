import { animate } from "framer-motion/dom"

const SLIDE_IN = ".sidebar, [data-sidebar]"
const DROP_IN = ".log-item, [data-log-item], .step, [data-step]"
const EASE = [0.22, 1, 0.36, 1] as const

const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches

function enter(element: Element, keyframes: Record<string, unknown>, delay: number) {
  if (reduceMotion()) return
  animate(element, keyframes as never, { duration: 0.45, ease: EASE, delay })
}

function animateTree(root: ParentNode) {
  root.querySelectorAll(SLIDE_IN).forEach((el, i) => enter(el, { opacity: [0, 1], x: [-48, 0] }, i * 0.05))
  root.querySelectorAll(DROP_IN).forEach((el, i) => enter(el, { opacity: [0, 1], y: [-18, 0] }, Math.min(i, 10) * 0.05))
}

export function startMotion() {
  const page = document.getElementById("page-motion")
  if (page) enter(page, { opacity: [0, 1], y: [12, 0] }, 0)

  animateTree(document)

  new MutationObserver((records) => {
    for (const record of records) {
      record.addedNodes.forEach((node) => {
        if (!(node instanceof HTMLElement)) return
        if (node.matches(SLIDE_IN)) enter(node, { opacity: [0, 1], x: [-48, 0] }, 0)
        if (node.matches(DROP_IN)) enter(node, { opacity: [0, 1], y: [-18, 0] }, 0)
        animateTree(node)
      })
    }
  }).observe(document.body, { childList: true, subtree: true })
}
