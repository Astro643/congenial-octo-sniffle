import { PassThrough } from "node:stream"
import type { AppLoadContext, EntryContext } from "@remix-run/node"
import { RemixServer } from "@remix-run/react"
import { renderToPipeableStream } from "react-dom/server"
import { isbot } from "isbot"

export default function handleRequest(request: Request, responseStatusCode: number, responseHeaders: Headers, remixContext: EntryContext, _loadContext: AppLoadContext) {
  return new Promise<Response>((resolve, reject) => {
    let shellRendered = false
    const { pipe, abort } = renderToPipeableStream(<RemixServer context={remixContext} url={request.url} abortDelay={5000} />, {
      onAllReady() {
        shellRendered = true
        const body = new PassThrough()
        responseHeaders.set("Content-Type", "text/html")
        resolve(new Response(body as unknown as BodyInit, { headers: responseHeaders, status: responseStatusCode }))
        pipe(body)
      },
      onShellError(error: unknown) { reject(error) },
      onError(error: unknown) { if (shellRendered) console.error(error) },
    })
    setTimeout(abort, 5000)
  })
}
