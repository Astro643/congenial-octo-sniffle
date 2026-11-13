import { clientEntry, ref } from "remix/component"
import type { Handle } from "remix/component"

export const ScrollCue = clientEntry(import.meta.url, function ScrollCue(_handle: Handle) {
  return () => (
    <a
      class="scroll"
      id="scroll-cue"
      href="#intro"
      aria-label="Scroll to learn more"
      mix={ref((node, signal) => {
        const sync = () => node.classList.toggle("gone", window.scrollY > 60)
        window.addEventListener("scroll", sync, { passive: true, signal })
        sync()
      })}
    >
      <span>
        {"Scroll"}
      </span>
      <svg viewBox="0 0 24 22" aria-hidden="true">
        <path d="M1.5 2h21L12 20z" fill="currentColor" />
      </svg>
    </a>
  )
})
