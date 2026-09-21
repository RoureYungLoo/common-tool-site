import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises"

const siteName = "禄若阳的工具站"
const siteOrigin = "https://roureyungloo.github.io/common-tool-site"
const distDir = new URL("../dist/", import.meta.url)

const pages = [
  ["tools", "全部在线工具", "浏览禄若阳的工具站提供的免费开发者工具、编码工具和文本处理工具。", true],
  ["favorites", "收藏工具", "查看你在禄若阳的工具站收藏的常用在线工具。", false],
  ["about", "关于", "了解禄若阳的工具站：一个简单、私密、轻量的在线开发工具集合。", true],
  ["tools/json-formatter", "JSON 格式化", "在线格式化、校验与压缩 JSON 数据，所有内容均在浏览器本地处理。", true],
  ["tools/base64", "Base64 编解码", "支持 Unicode 的在线 Base64 编码与解码工具，数据不会上传。", true],
  ["tools/url-codec", "URL 编解码", "在线进行 URL Encode 与 Decode，快速处理 URL 组件。", true],
  ["tools/uuid-generator", "UUID 生成器", "在线批量生成安全的 UUID v4 标识符。", true],
  ["tools/timestamp", "时间戳转换", "在线转换 Unix 时间戳、ISO 8601 与本地日期时间。", true],
  ["tools/hash", "Hash 计算", "在线计算 SHA-1、SHA-256、SHA-384 与 SHA-512 消息摘要。", true],
  ["tools/jwt-parser", "JWT 解析", "在浏览器本地解析 JWT Header 与 Payload，不上传 Token。", true],
  ["tools/text-lab", "文本处理", "在线统计字符和单词，并完成大小写转换、空白清理等操作。", true],
]

const escapeAttribute = (value) => value.replaceAll("&", "&amp;").replaceAll('"', "&quot;")

function withMetadata(template, route, title, description, shouldIndex) {
  const fullTitle = `${title}｜${siteName}`
  const canonical = `${siteOrigin}/${route}/`
  const replacements = [
    [/<title>.*?<\/title>/, `<title>${fullTitle}</title>`],
    [/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${escapeAttribute(description)}" />`],
    [/<meta name="robots" content="[^"]*" \/>/, `<meta name="robots" content="${shouldIndex ? "index, follow" : "noindex, follow"}" />`],
    [/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${canonical}" />`],
    [/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${fullTitle}" />`],
    [/<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${escapeAttribute(description)}" />`],
    [/<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${canonical}" />`],
    [/<meta name="twitter:title" content="[^"]*" \/>/, `<meta name="twitter:title" content="${fullTitle}" />`],
    [/<meta name="twitter:description" content="[^"]*" \/>/, `<meta name="twitter:description" content="${escapeAttribute(description)}" />`],
  ]
  return replacements.reduce((html, [pattern, value]) => html.replace(pattern, value), template)
}

const template = await readFile(new URL("index.html", distDir), "utf8")

for (const [route, title, description, shouldIndex] of pages) {
  const pageDir = new URL(`${route}/`, distDir)
  await mkdir(pageDir, { recursive: true })
  await writeFile(new URL("index.html", pageDir), withMetadata(template, route, title, description, shouldIndex))
}

await copyFile(new URL("index.html", distDir), new URL("404.html", distDir))
await writeFile(new URL(".nojekyll", distDir), "")

console.log(`Prepared ${pages.length} route entry points for GitHub Pages.`)
