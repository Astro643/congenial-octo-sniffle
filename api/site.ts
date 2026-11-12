export default async (request: Request) => {
  // @ts-expect-error dist is emitted after typecheck
  const mod = await import("../dist/src/site.js")
  return mod.default(request)
}
