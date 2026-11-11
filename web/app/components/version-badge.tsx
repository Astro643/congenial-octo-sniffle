import { framerMotionVersion, remixVersion, tsParticlesVersion } from "../lib/versions"

export function VersionBadge() {
  return (
    <aside
      className="version-badge"
      aria-label={`Built with Remix ${remixVersion}`}
      title={`Remix ${remixVersion} · Framer Motion ${framerMotionVersion} · tsParticles ${tsParticlesVersion}`}
    >
      <span className="version-badge-dot" aria-hidden="true" />
      <span>Built with Remix</span>
      <strong>v{remixVersion}</strong>
    </aside>
  )
}
