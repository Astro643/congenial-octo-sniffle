import { createController } from "remix/router"

import { assets } from "../assets.ts"
import { routes } from "../routes.ts"
import { DashboardPage, meta as dashboardMeta } from "../pages/dashboard.tsx"
import { DocsPage, meta as docsMeta } from "../pages/docs.tsx"
import { HomePage, meta as homeMeta } from "../pages/home.tsx"
import { PrivacyPage, meta as privacyMeta } from "../pages/privacy.tsx"
import { TermsPage, meta as termsMeta } from "../pages/terms.tsx"
import { NotFoundPage, meta as notFoundMeta } from "../pages/not-found.tsx"
import { Document } from "./document.tsx"
import {
  approveAgent,
  cancelAgent,
  executeAgent,
  getAgentStatus,
  previewAgent,
} from "../lib/agent-proxy.server.ts"

export default createController(routes, {
  actions: {
    async assets(context) {
      return (await assets.fetch(context.request)) ?? new Response("Not Found", { status: 404 })
    },
    agentPreview(context) {
      return previewAgent(context.request)
    },
    agentExecute(context) {
      return executeAgent(context.request)
    },
    agentStatus(context) {
      return getAgentStatus(context.request, context.params.id)
    },
    agentCancel(context) {
      return cancelAgent(context.request, context.params.id)
    },
    agentApprove(context) {
      return approveAgent(context.request, context.params.id)
    },
    home(context) {
      return context.render(
        <Document meta={homeMeta}>
          <HomePage />
        </Document>,
      )
    },
    privacy(context) {
      return context.render(
        <Document meta={privacyMeta}>
          <PrivacyPage />
        </Document>,
      )
    },
    terms(context) {
      return context.render(
        <Document meta={termsMeta}>
          <TermsPage />
        </Document>,
      )
    },
    dashboard(context) {
      return context.render(
        <Document meta={dashboardMeta}>
          <DashboardPage />
        </Document>,
      )
    },
    docs(context) {
      return context.render(
        <Document meta={docsMeta}>
          <DocsPage />
        </Document>,
      )
    },
    notFound(context) {
      return context.render(
        <Document meta={notFoundMeta}>
          <NotFoundPage />
        </Document>,
        { status: 404 },
      )
    },
  },
})
