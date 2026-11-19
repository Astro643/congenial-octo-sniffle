const DEFAULT_BACKEND_URL = "https://didactic-doodle-three.vercel.app"
const RUN_ID_PATTERN = /^[A-Za-z0-9_-]{1,200}$/
const MAX_REQUEST_BYTES = 128 * 1024

function isLoopback(hostname: string) {
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "[::1]"
}

function authorizeTestRequest(request: Request, mutating: boolean): Response | null {
  const url = new URL(request.url)
  const localTestMode =
    process.env.AGENT_PROXY_TEST_MODE === "true" &&
    process.env.NODE_ENV !== "production" &&
    isLoopback(url.hostname)

  if (!localTestMode) {
    return Response.json(
      { detail: "Agent proxy requires the frontend's signed-session verifier." },
      { status: 503, headers: { "cache-control": "no-store" } },
    )
  }

  if (mutating && request.headers.get("origin") !== url.origin) {
    return Response.json(
      { detail: "Same-origin requests only." },
      { status: 403, headers: { "cache-control": "no-store" } },
    )
  }

  return null
}

function backendUrl(path: string) {
  const configured = process.env.AGENT_BACKEND_URL ?? DEFAULT_BACKEND_URL
  const base = new URL(configured)
  const allowLocalHttp = process.env.NODE_ENV !== "production" && isLoopback(base.hostname)
  if (base.protocol !== "https:" && !(allowLocalHttp && base.protocol === "http:")) {
    throw new Error("AGENT_BACKEND_URL must use HTTPS")
  }
  if (base.username || base.password || base.search || base.hash) {
    throw new Error("AGENT_BACKEND_URL must be an origin or path without credentials, query, or fragment")
  }
  const prefix = base.pathname.replace(/\/+$/, "")
  return new URL(`${prefix}/${path.replace(/^\/+/, "")}`, base.origin)
}

function jsonResponse(detail: string, status: number) {
  return Response.json({ detail }, { status, headers: { "cache-control": "no-store" } })
}

async function forward(
  path: string,
  method: "GET" | "POST",
  body?: unknown,
): Promise<Response> {
  const key = process.env.AGENT_API_KEY
  if (!key) return jsonResponse("Agent API is not configured.", 503)

  let url: URL
  try {
    url = backendUrl(path)
  } catch (error) {
    console.error("Invalid AGENT_BACKEND_URL:", error)
    return jsonResponse("Agent backend is not configured correctly.", 503)
  }

  let upstream: Response
  try {
    upstream = await fetch(url, {
      method,
      headers: {
        authorization: `Bearer ${key}`,
        ...(body === undefined ? {} : { "content-type": "application/json" }),
      },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.timeout(60_000),
    })
  } catch (error) {
    console.error("Agent backend request failed:", error)
    return jsonResponse("Could not reach the agent backend.", 502)
  }

  return new Response(upstream.body, {
    status: upstream.status,
    headers: {
      "content-type": upstream.headers.get("content-type") ?? "application/json",
      "cache-control": "no-store",
    },
  })
}

async function readJson(request: Request): Promise<Record<string, unknown> | Response> {
  try {
    const contentLength = Number(request.headers.get("content-length"))
    if (Number.isFinite(contentLength) && contentLength > MAX_REQUEST_BYTES) {
      return jsonResponse("Request body is too large.", 413)
    }
    const text = await request.text()
    if (Buffer.byteLength(text) > MAX_REQUEST_BYTES) {
      return jsonResponse("Request body is too large.", 413)
    }
    const body: unknown = JSON.parse(text)
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return jsonResponse("A JSON object is required.", 400)
    }
    return body as Record<string, unknown>
  } catch {
    return jsonResponse("A valid JSON body is required.", 400)
  }
}

export async function previewAgent(request: Request) {
  const denied = authorizeTestRequest(request, true)
  if (denied) return denied
  const body = await readJson(request)
  if (body instanceof Response) return body
  if (typeof body.prompt !== "string" || !body.prompt.trim() || body.prompt.length > 2000) {
    return jsonResponse("prompt must be a non-empty string of at most 2000 characters.", 400)
  }
  return forward("/api/agent/preview", "POST", { prompt: body.prompt.trim() })
}

export async function executeAgent(request: Request) {
  const denied = authorizeTestRequest(request, true)
  if (denied) return denied
  const body = await readJson(request)
  if (body instanceof Response) return body
  if (!body.agent_plan || typeof body.agent_plan !== "object" || Array.isArray(body.agent_plan)) {
    return jsonResponse("agent_plan from preview is required.", 400)
  }
  return forward("/api/agent/execute", "POST", { agent_plan: body.agent_plan })
}

export async function getAgentStatus(request: Request, runId: string) {
  const denied = authorizeTestRequest(request, false)
  if (denied) return denied
  if (!RUN_ID_PATTERN.test(runId)) return jsonResponse("Invalid run id.", 400)
  return forward(`/api/status/${encodeURIComponent(runId)}`, "GET")
}

export async function cancelAgent(request: Request, runId: string) {
  const denied = authorizeTestRequest(request, true)
  if (denied) return denied
  if (!RUN_ID_PATTERN.test(runId)) return jsonResponse("Invalid run id.", 400)
  return forward(`/api/cancel/${encodeURIComponent(runId)}`, "POST", {})
}

export async function approveAgent(request: Request, runId: string) {
  const denied = authorizeTestRequest(request, true)
  if (denied) return denied
  if (!RUN_ID_PATTERN.test(runId)) return jsonResponse("Invalid run id.", 400)
  const body = await readJson(request)
  if (body instanceof Response) return body
  if (typeof body.approval_token !== "string" || typeof body.approved !== "boolean") {
    return jsonResponse("approval_token and approved are required.", 400)
  }
  return forward(`/api/agent/approve/${encodeURIComponent(runId)}`, "POST", {
    approval_token: body.approval_token,
    approved: body.approved,
  })
}
