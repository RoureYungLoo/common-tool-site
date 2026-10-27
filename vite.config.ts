import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import content from "./src/content.json" with { type: "json" }

const home = content.pages.home
const homeTitle = `${content.site.name}｜免费、私密的在线开发工具`
const keywords = [content.site.name, "在线工具", "开发者工具", ...content.tools.slice(0, 10).map((tool) => tool.shortName)].join(",")

const contentPlugin = {
  name: "site-content",
  transformIndexHtml(html: string) {
    const values: Record<string, string> = {
      "__SITE_NAME__": content.site.name,
      "__SITE_ORIGIN__": content.site.origin,
      "__SITE_DESCRIPTION__": content.site.description,
      "__HOME_TITLE__": homeTitle,
      "__HOME_DESCRIPTION__": home.description,
      "__SITE_KEYWORDS__": keywords,
    }
    return Object.entries(values).reduce((result, [placeholder, value]) => result.replaceAll(placeholder, value), html)
  },
}

export default defineConfig({
  base: process.env.VITE_BASE_PATH || "/",
  plugins: [react(), tailwindcss(), contentPlugin],
})
