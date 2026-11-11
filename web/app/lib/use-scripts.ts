import { useEffect } from "react"

export function useScripts(sources: string[]) {
  const key = sources.join("|")

  useEffect(() => {
    const added = sources.map((src) => {
      const script = document.createElement("script")
      script.src = src
      script.async = false
      document.body.append(script)
      return script
    })
    return () => added.forEach((script) => script.remove())
  }, [key])
}
