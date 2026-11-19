import { get, post, route } from "remix/routes"

export const routes = route({
  assets: get("/assets/*path"),
  home: "/",
  privacy: "/privacy",
  terms: "/terms",
  dashboard: "/dashboard",
  docs: "/docs",
  agentPreview: post("/api/controller/agent/preview"),
  agentExecute: post("/api/controller/agent/execute"),
  agentStatus: get("/api/controller/agent/status/:id"),
  agentCancel: post("/api/controller/agent/cancel/:id"),
  agentApprove: post("/api/controller/agent/approve/:id"),
  notFound: get("/*path"),
})
