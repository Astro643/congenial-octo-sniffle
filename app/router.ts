import { createRouter, type RouterContext } from "remix/router"
import { render } from "remix/middleware/render"
import { staticFiles } from "remix/middleware/static"

import controller from "./actions/controller.tsx"
import { assets } from "./assets.ts"
import { routes } from "./routes.ts"

const backend = process.env.BACKEND_URL ?? "https://didactic-doodle-iota.vercel.app"

export const router = createRouter({
  middleware: [
    async (context, next) => {
      const url = new URL(context.request.url)
      if (!url.pathname.startsWith("/api/")) return next()
      return fetch(new Request(backend + url.pathname + url.search, context.request))
    },
    staticFiles("./public", { index: false }),
    render({ assets }),
  ],
})

export type AppContext = RouterContext<typeof router>

declare module "remix" {
  interface RouterTypes {
    context: AppContext
  }
}

router.map(routes, controller)
