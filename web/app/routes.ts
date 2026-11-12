import { get, route } from "remix/routes"

export const routes = route({
  assets: get("/assets/*path"),
  home: "/",
  privacy: "/privacy",
  terms: "/terms",
  dashboard: "/dashboard",
  notFound: get("/*path"),
})
