import { Binary, Braces, CaseSensitive, Clock3, Fingerprint, Hash, KeyRound, Link2 } from "lucide-react"
import type { ToolDefinition } from "../types"
import Base64Tool from "./Base64Tool"
import HashTool from "./HashTool"
import JsonTool from "./JsonTool"
import JwtTool from "./JwtTool"
import TextTool from "./TextTool"
import TimestampTool from "./TimestampTool"
import UrlTool from "./UrlTool"
import UuidTool from "./UuidTool"

export const tools: ToolDefinition[] = [
  { id: "json-formatter", name: "JSON 格式化", shortName: "JSON", description: "格式化、校验与压缩 JSON 数据", category: "开发", keywords: ["json", "格式化", "校验", "formatter"], icon: Braces, accent: "lime", component: JsonTool },
  { id: "base64", name: "Base64 编解码", shortName: "Base64", description: "支持 Unicode 的 Base64 编码与解码", category: "编码", keywords: ["base64", "编码", "解码"], icon: Binary, accent: "blue", component: Base64Tool },
  { id: "url-codec", name: "URL 编解码", shortName: "URL", description: "对 URL 组件安全地编码或解码", category: "编码", keywords: ["url", "encode", "decode", "链接"], icon: Link2, accent: "violet", component: UrlTool },
  { id: "uuid-generator", name: "UUID 生成器", shortName: "UUID", description: "批量生成安全的 UUID v4 标识符", category: "开发", keywords: ["uuid", "guid", "生成", "随机"], icon: Fingerprint, accent: "orange", component: UuidTool },
  { id: "timestamp", name: "时间戳转换", shortName: "时间戳", description: "Unix 时间戳与可读时间快速转换", category: "开发", keywords: ["timestamp", "unix", "时间", "日期"], icon: Clock3, accent: "cyan", component: TimestampTool },
  { id: "hash", name: "Hash 计算", shortName: "Hash", description: "计算 SHA 系列消息摘要", category: "开发", keywords: ["hash", "sha", "摘要", "哈希"], icon: Hash, accent: "rose", component: HashTool },
  { id: "jwt-parser", name: "JWT 解析", shortName: "JWT", description: "本地解析 JWT Header 与 Payload", category: "开发", keywords: ["jwt", "token", "解析"], icon: KeyRound, accent: "amber", component: JwtTool },
  { id: "text-lab", name: "文本处理", shortName: "文本", description: "统计、转换大小写与清理文本", category: "文本", keywords: ["text", "case", "count", "文本", "大小写"], icon: CaseSensitive, accent: "teal", component: TextTool },
]

export const findTool = (id?: string) => tools.find((tool) => tool.id === id)

export const searchTools = (query: string) => {
  const needle = query.trim().toLocaleLowerCase()
  if (!needle) return tools
  return tools.filter((tool) => [tool.name, tool.shortName, tool.description, tool.category, ...tool.keywords].join(" ").toLocaleLowerCase().includes(needle))
}
