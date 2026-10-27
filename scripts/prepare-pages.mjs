import { createHash } from "node:crypto"
import { copyFile, mkdir, readFile, readdir, writeFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const projectDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const distDir = path.join(projectDir, "dist")
const content = JSON.parse(await readFile(path.join(projectDir, "src", "content.json"), "utf8"))
const siteName = content.site.name
const siteOrigin = content.site.origin.replace(/\/$/, "")
const configuredBasePath = (process.env.VITE_BASE_PATH || "/").replace(/^\/+|\/+$/g, "")
const basePath = configuredBasePath ? `/${configuredBasePath}/` : "/"

const pages = [
  ...Object.values(content.pages),
  ...content.tools.map((tool) => ({
    path: `/tools/${tool.id}`,
    title: tool.name,
    description: tool.seoDescription,
    index: true,
    priority: 0.8,
  })),
]

const escapeAttribute = (value) => value.replaceAll("&", "&amp;").replaceAll('"', "&quot;")
const escapeXml = (value) => escapeAttribute(value).replaceAll("<", "&lt;").replaceAll(">", "&gt;")
const routeWithSlash = (route) => route === "/" ? "/" : `/${route.replace(/^\/+|\/+$/g, "")}/`

function withMetadata(template, page) {
  const fullTitle = page.title === siteName ? `${siteName}｜免费、私密的在线开发工具` : `${page.title}｜${siteName}`
  const canonical = `${siteOrigin}${routeWithSlash(page.path)}`
  const replacements = [
    [/<title>.*?<\/title>/, `<title>${fullTitle}</title>`],
    [/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${escapeAttribute(page.description)}" />`],
    [/<meta name="robots" content="[^"]*" \/>/, `<meta name="robots" content="${page.index ? "index, follow" : "noindex, follow"}" />`],
    [/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${canonical}" />`],
    [/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${fullTitle}" />`],
    [/<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${escapeAttribute(page.description)}" />`],
    [/<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${canonical}" />`],
    [/<meta name="twitter:title" content="[^"]*" \/>/, `<meta name="twitter:title" content="${fullTitle}" />`],
    [/<meta name="twitter:description" content="[^"]*" \/>/, `<meta name="twitter:description" content="${escapeAttribute(page.description)}" />`],
  ]
  return replacements.reduce((html, [pattern, value]) => html.replace(pattern, value), template)
}

const template = await readFile(path.join(distDir, "index.html"), "utf8")

for (const page of pages) {
  const html = withMetadata(template, page)
  if (page.path === "/") {
    await writeFile(path.join(distDir, "index.html"), html)
    continue
  }
  const pageDir = path.join(distDir, page.path.replace(/^\//, ""))
  await mkdir(pageDir, { recursive: true })
  await writeFile(path.join(pageDir, "index.html"), html)
}

await copyFile(path.join(distDir, "index.html"), path.join(distDir, "404.html"))
await writeFile(path.join(distDir, ".nojekyll"), "")

const sitemapPages = pages.filter((page) => page.index)
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapPages.map((page) => `  <url><loc>${escapeXml(`${siteOrigin}${routeWithSlash(page.path)}`)}</loc><priority>${page.priority}</priority></url>`).join("\n")}
</urlset>
`
await writeFile(path.join(distDir, "sitemap.xml"), sitemap)

async function listFiles(directory, prefix = "") {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = await Promise.all(entries.map((entry) => {
    const relativePath = path.posix.join(prefix, entry.name)
    return entry.isDirectory() ? listFiles(path.join(directory, entry.name), relativePath) : [relativePath]
  }))
  return files.flat()
}

const allFiles = (await listFiles(distDir))
  .filter((file) => !file.startsWith(".") && file !== "404.html" && file !== "sw.js" && !file.endsWith(".map"))
  .sort()
const documentAssets = [...template.matchAll(/(?:src|href)="([^"]+)"/g)]
  .map((match) => match[1])
  .filter((url) => url.startsWith(basePath))
  .map((url) => url.slice(basePath.length))
const precacheFiles = [...new Set(["index.html", "site.webmanifest", "favicon.svg", ...documentAssets])]
  .filter((file) => allFiles.includes(file))
  .sort()
const precacheUrls = precacheFiles.map((file) => {
  if (file === "index.html") return basePath
  if (file.endsWith("/index.html")) return `${basePath}${file.slice(0, -"index.html".length)}`
  return `${basePath}${file}`
})
const versionHash = createHash("sha256")
for (const file of precacheFiles) versionHash.update(await readFile(path.join(distDir, file)))
const cacheName = `common-tool-site-${versionHash.digest("hex").slice(0, 12)}`
const serviceWorkerTemplate = await readFile(path.join(projectDir, "scripts", "service-worker.template.js"), "utf8")
const serviceWorker = serviceWorkerTemplate
  .replace("__CACHE_NAME__", cacheName)
  .replace("__BASE_PATH__", basePath)
  .replace("__PRECACHE_URLS__", JSON.stringify(precacheUrls, null, 2))
await writeFile(path.join(distDir, "sw.js"), serviceWorker)

console.log(`Prepared ${pages.length} route entry points, sitemap, and ${precacheUrls.length} offline assets.`)
