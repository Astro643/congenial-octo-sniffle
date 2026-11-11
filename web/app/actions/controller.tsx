import { createController } from "remix/router"

import { assets } from "../assets.ts"
import { routes } from "../routes.ts"
import { DashboardPage, meta as dashboardMeta } from "../pages/dashboard.tsx"
import { FaqPage, meta as faqMeta } from "../pages/faq.tsx"
import { HomePage, meta as homeMeta } from "../pages/home.tsx"
import { HowItWorksPage, meta as howItWorksMeta } from "../pages/how-it-works.tsx"
import { HumanSupportPage, meta as humanSupportMeta } from "../pages/human-support.tsx"
import { PrivacyPage, meta as privacyMeta } from "../pages/privacy.tsx"
import { SupportPage, meta as supportMeta } from "../pages/support.tsx"
import { TeamPage, meta as teamMeta } from "../pages/team.tsx"
import { TermsPage, meta as termsMeta } from "../pages/terms.tsx"
import { NotFoundPage, meta as notFoundMeta } from "../pages/not-found.tsx"
import { Document } from "./document.tsx"

export default createController(routes, {
  actions: {
    async assets(context) {
      return (await assets.fetch(context.request)) ?? new Response("Not Found", { status: 404 })
    },
    home(context) {
      return context.render(
        <Document meta={homeMeta}>
          <HomePage />
        </Document>,
      )
    },
    howItWorks(context) {
      return context.render(
        <Document meta={howItWorksMeta}>
          <HowItWorksPage />
        </Document>,
      )
    },
    faq(context) {
      return context.render(
        <Document meta={faqMeta}>
          <FaqPage />
        </Document>,
      )
    },
    support(context) {
      return context.render(
        <Document meta={supportMeta}>
          <SupportPage />
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
    team(context) {
      return context.render(
        <Document meta={teamMeta}>
          <TeamPage />
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
    humanSupport(context) {
      return context.render(
        <Document meta={humanSupportMeta}>
          <HumanSupportPage />
        </Document>,
      )
    },
  },
})
