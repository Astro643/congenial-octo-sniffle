import { get, route } from "remix/routes"

export const routes = route({
  assets: get("/assets/*path"),
  home: "/",
  howItWorks: "/how-it-works",
  faq: "/faq",
  support: "/support",
  privacy: "/privacy",
  terms: "/terms",
  dashboard: "/dashboard",
  team: "/team",
  notFound: get("/*path"),
})
