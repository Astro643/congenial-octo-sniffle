import { tsParticles } from "@tsparticles/engine"
import { loadSlim } from "@tsparticles/slim"

export async function startParticles() {
  const host = document.getElementById("particle-backdrop")
  if (!host) return

  await loadSlim(tsParticles)
  await tsParticles.load({
    id: "site-particles",
    element: host,
    options: {
      background: { color: "transparent" },
      fpsLimit: 60,
      particles: {
        color: { value: ["#2EFF9B", "#1BE585", "#8E8D91"] },
        links: { color: "#8E8D91", distance: 150, enable: true, opacity: 0.22, width: 1 },
        move: { direction: "none", enable: true, outModes: "bounce", speed: 0.35 },
        number: { density: { enable: true, width: 1100, height: 1100 }, value: 42 },
        opacity: { value: { min: 0.3, max: 0.75 } },
        size: { value: { min: 1, max: 2.4 } },
      },
      interactivity: {
        events: { onHover: { enable: true, mode: "repulse" }, resize: { enable: true } },
        modes: { repulse: { distance: 105, duration: 0.4, speed: 0.65 } },
      },
      detectRetina: true,
    },
  })
}
