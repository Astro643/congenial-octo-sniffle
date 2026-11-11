import type { LinkDescriptor } from "@remix-run/node"
import siteStyles from "../../site.css?url"

export const siteLinks = (): LinkDescriptor[] => [{ rel: "stylesheet", href: siteStyles }]
