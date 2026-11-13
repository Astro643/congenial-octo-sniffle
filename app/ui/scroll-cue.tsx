import { clientEntry, css, ref } from "remix/component"
import type { Handle } from "remix/component"

export const ScrollCue = clientEntry(import.meta.url, function ScrollCue(_handle: Handle) {
  const cueStyle = css({
    "@keyframes nudge": {
      "0%,100%": { transform: "translateY(0)", opacity: "1" },
      "50%": { transform: "translateY(9px)", opacity: ".35" },
    },
    position: "absolute",
    left: "50%",
    bottom: "34px",
    transform: "translateX(-50%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "12px",
    font: "500 13px/1 var(--mono)",
    letterSpacing: ".2em",
    textTransform: "uppercase",
    color: "var(--ink-2)",
    textDecoration: "none",
    padding: "8px 14px",
    transition: "opacity .3s",
    "& svg": {
      width: "18px",
      height: "16px",
      display: "block",
      color: "#000",
      animation: "nudge 1.7s cubic-bezier(.45,0,.25,1) infinite",
    },
    "&:hover svg": {
      animationDuration: "1s",
    },
    "&:focus-visible": {
      outline: "3px solid rgba(6,116,60,.55)",
      outlineOffset: "4px",
      borderRadius: "8px",
    },
    "&.gone": {
      opacity: 0,
      pointerEvents: "none",
    },
  })

  return () => (
    <a
      class="scroll"
      id="scroll-cue"
      href="#intro"
      aria-label="Scroll to learn more"
      mix={[
        cueStyle,
        ref((node, signal) => {
          const sync = () => node.classList.toggle("gone", window.scrollY > 60)
          window.addEventListener("scroll", sync, { passive: true, signal })
          sync()
        }),
      ]}
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
