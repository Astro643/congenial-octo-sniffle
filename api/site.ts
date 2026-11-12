import { router } from "../app/router.ts"

export default (request: Request) => router.fetch(request)
