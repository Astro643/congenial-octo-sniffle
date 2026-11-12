export default async (request: Request) => {
  const mod = await import("../dist/src/site.js")
  return mod.default(request)
}
