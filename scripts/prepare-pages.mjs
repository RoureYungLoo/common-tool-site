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
  ["tools/device-params-generator", "设备参数生成器", "按 Apple、华为、小米、OPPO、vivo、荣耀、三星与 Google 主流机型生成常见设备测试参数。", true],
  ["tools/simple-device-params-generator", "简版设备参数生成器", "按主流品牌与机型生成 UA、IMEI、OAID、IDFA、CAID、GAID、PAID、定位和 App 测试参数。", true],
  ["tools/timestamp", "时间戳转换", "在线进行 Unix 秒/毫秒时间戳、日期时间、ISO 8601、UTC、时区与相对时间双向转换。", true],
  ["tools/hash", "Hash 计算", "在线计算 SHA-1、SHA-256、SHA-384 与 SHA-512 消息摘要。", true],
  ["tools/jwt-parser", "JWT 解析", "在浏览器本地解析 JWT Header 与 Payload，不上传 Token。", true],
  ["tools/text-lab", "文本处理", "在线统计字符和单词，并完成大小写转换、空白清理等操作。", true],
  ["tools/regex-tester", "正则测试", "在线实时测试正则表达式、匹配结果与捕获分组。", true],
  ["tools/base-converter", "进制转换", "在线完成二进制、八进制、十进制与十六进制转换。", true],
  ["tools/color-converter", "颜色转换", "在线转换 HEX、RGB 与 HSL 颜色格式。", true],
  ["tools/password-generator", "密码生成器", "在浏览器本地生成安全的随机密码并估算强度。", true],
  ["tools/html-entity", "HTML 实体", "在线进行 HTML 特殊字符实体编码与解码。", true],
  ["tools/url-parser", "URL 解析", "在线拆解 URL 协议、域名、路径和查询参数。", true],
  ["tools/text-diff", "文本 Diff", "在线按行比较两段文本的新增、删除和相同内容。", true],
  ["tools/json-to-typescript", "JSON 转 TypeScript", "从 JSON 数据自动生成 TypeScript Interface 类型。", true],
  ["tools/xml-formatter", "XML 格式化", "在线格式化、校验与压缩 XML 文档。", true],
  ["tools/csv-json", "CSV / JSON 转换", "在线完成 CSV 表格与 JSON 对象数组相互转换。", true],
  ["tools/sql-formatter", "SQL 格式化", "在线格式化与压缩常见 SQL 语句。", true],
  ["tools/cron-parser", "Cron 解析", "在线校验并解释标准五段 Cron 表达式。", true],
  ["tools/markdown-preview", "Markdown 预览", "在浏览器中安全预览常用 Markdown 结构。", true],
  ["tools/chmod-calculator", "Unix 权限计算", "在线计算 chmod 数字权限、符号权限和命令。", true],
  ["tools/list-processor", "列表处理", "在线完成列表排序、去重、反转和空行清理。", true],
  ["tools/css-unit-converter", "CSS 单位转换", "在线换算 PX、REM、EM 与 VW 单位。", true],
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
