import { useEffect } from "react"
import { LegacyPage } from "../legacy"

export default function IndexRoute() {
  useEffect(() => { document.title = "Controller · Agentic infrastructure for Discord" }, [])
  return <LegacyPage file="index.html" />
}
