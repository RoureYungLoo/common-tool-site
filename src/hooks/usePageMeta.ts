import { useEffect } from "react"
import content from "../content.json"

const SITE_NAME = content.site.name
const SITE_ORIGIN = content.site.origin

function setMeta(selector: string, attribute: string, value: string) {
  document.querySelector<HTMLMetaElement>(selector)?.setAttribute(attribute, value)
}

export function usePageMeta(title: string, description: string, path = "/", index = true) {
  useEffect(() => {
    const fullTitle = title === SITE_NAME ? `${SITE_NAME}｜免费、私密的在线开发工具` : `${title}｜${SITE_NAME}`
    const canonicalPath = path === "/" ? "/" : `${path.replace(/\/$/, "")}/`
    const canonicalUrl = `${SITE_ORIGIN}${canonicalPath}`
    document.title = fullTitle
    setMeta('meta[name="description"]', "content", description)
    setMeta('meta[property="og:title"]', "content", fullTitle)
    setMeta('meta[property="og:description"]', "content", description)
    setMeta('meta[property="og:url"]', "content", canonicalUrl)
    setMeta('meta[name="twitter:title"]', "content", fullTitle)
    setMeta('meta[name="twitter:description"]', "content", description)
    setMeta('meta[name="robots"]', "content", index ? "index, follow" : "noindex, follow")
    document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.setAttribute("href", canonicalUrl)
  }, [title, description, path, index])
}
