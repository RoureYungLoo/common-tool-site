import { Binary, Braces, Calculator, CalendarClock, CaseSensitive, Clock3, CodeXml, Database, FileCode2, FileJson2, FileText, Fingerprint, GitCompareArrows, Hash, KeyRound, Link2, ListFilter, Palette, Regex, Ruler, ShieldCheck, Smartphone, Table2, TerminalSquare, Waypoints } from "lucide-react"
import type { ToolDefinition } from "../types"
import Base64Tool from "./Base64Tool"
import BaseConverterTool from "./BaseConverterTool"
import ColorTool from "./ColorTool"
import CronTool from "./CronTool"
import CssUnitTool from "./CssUnitTool"
import DeviceParamsTool from "./DeviceParamsTool"
import SimpleDeviceParamsTool from "./SimpleDeviceParamsTool"
import CsvJsonTool from "./CsvJsonTool"
import ChmodTool from "./ChmodTool"
import HashTool from "./HashTool"
import HtmlEntityTool from "./HtmlEntityTool"
import JsonTool from "./JsonTool"
import JsonToTsTool from "./JsonToTsTool"
import JwtTool from "./JwtTool"
import ListTool from "./ListTool"
import MarkdownTool from "./MarkdownTool"
import PasswordTool from "./PasswordTool"
import RegexTool from "./RegexTool"
import TextTool from "./TextTool"
import TextDiffTool from "./TextDiffTool"
import TimestampTool from "./TimestampTool"
import UrlTool from "./UrlTool"
import UrlParserTool from "./UrlParserTool"
import UuidTool from "./UuidTool"
import XmlTool from "./XmlTool"
import SqlTool from "./SqlTool"

export const tools: ToolDefinition[] = [
  { id: "json-formatter", name: "JSON 格式化", shortName: "JSON", description: "格式化、校验与压缩 JSON 数据", category: "开发", keywords: ["json", "格式化", "校验", "formatter"], icon: Braces, accent: "lime", component: JsonTool },
  { id: "base64", name: "Base64 编解码", shortName: "Base64", description: "支持 Unicode 的 Base64 编码与解码", category: "编码", keywords: ["base64", "编码", "解码"], icon: Binary, accent: "blue", component: Base64Tool },
  { id: "url-codec", name: "URL 编解码", shortName: "URL", description: "对 URL 组件安全地编码或解码", category: "编码", keywords: ["url", "encode", "decode", "链接"], icon: Link2, accent: "violet", component: UrlTool },
  { id: "uuid-generator", name: "UUID 生成器", shortName: "UUID", description: "批量生成安全的 UUID v4 标识符", category: "开发", keywords: ["uuid", "guid", "生成", "随机"], icon: Fingerprint, accent: "orange", component: UuidTool },
  { id: "device-params-generator", name: "设备参数生成器", shortName: "设备参数", description: "按主流品牌与机型生成广告设备、App、隐私与风控测试参数", category: "开发", keywords: ["imei", "oaid", "android id", "gaid", "idfa", "idfv", "imsi", "iccid", "mac", "openrtb", "app", "广告", "iphone", "华为", "小米", "oppo", "vivo", "荣耀", "三星", "pixel", "设备参数", "机型", "生成"], icon: Smartphone, accent: "cyan", component: DeviceParamsTool },
  { id: "simple-device-params-generator", name: "简版设备参数生成器", shortName: "设备参数简版", description: "按品牌与机型生成 UA、常用广告标识、MD5、归因、定位和 App 参数", category: "开发", keywords: ["ua", "user agent", "imei", "md5", "android id", "oaid", "mac", "idfa", "caid", "gaid", "paid", "拼多多", "geo", "app", "设备参数", "机型", "生成"], icon: Smartphone, accent: "blue", component: SimpleDeviceParamsTool },
  { id: "timestamp", name: "时间戳转换", shortName: "时间戳", description: "Unix 秒/毫秒、日期时间、时区与相对时间双向转换", category: "开发", keywords: ["timestamp", "unix", "时间", "日期", "毫秒", "时区", "utc", "iso 8601"], icon: Clock3, accent: "cyan", component: TimestampTool },
  { id: "hash", name: "Hash 计算", shortName: "Hash", description: "计算 SHA 系列消息摘要", category: "开发", keywords: ["hash", "sha", "摘要", "哈希"], icon: Hash, accent: "rose", component: HashTool },
  { id: "jwt-parser", name: "JWT 解析", shortName: "JWT", description: "本地解析 JWT Header 与 Payload", category: "开发", keywords: ["jwt", "token", "解析"], icon: KeyRound, accent: "amber", component: JwtTool },
  { id: "text-lab", name: "文本处理", shortName: "文本", description: "统计、转换大小写与清理文本", category: "文本", keywords: ["text", "case", "count", "文本", "大小写"], icon: CaseSensitive, accent: "teal", component: TextTool },
  { id: "regex-tester", name: "正则测试", shortName: "正则", description: "实时测试正则表达式与捕获分组", category: "开发", keywords: ["regex", "regexp", "正则", "匹配"], icon: Regex, accent: "violet", component: RegexTool },
  { id: "base-converter", name: "进制转换", shortName: "进制", description: "二、八、十与十六进制相互转换", category: "编码", keywords: ["binary", "hex", "decimal", "进制", "二进制"], icon: Calculator, accent: "blue", component: BaseConverterTool },
  { id: "color-converter", name: "颜色转换", shortName: "颜色", description: "HEX、RGB 与 HSL 颜色格式转换", category: "开发", keywords: ["color", "hex", "rgb", "hsl", "颜色"], icon: Palette, accent: "rose", component: ColorTool },
  { id: "password-generator", name: "密码生成器", shortName: "密码", description: "生成安全的随机密码并估算强度", category: "开发", keywords: ["password", "random", "security", "密码", "随机"], icon: ShieldCheck, accent: "lime", component: PasswordTool },
  { id: "html-entity", name: "HTML 实体", shortName: "HTML 实体", description: "HTML 特殊字符实体编码与解码", category: "编码", keywords: ["html", "entity", "escape", "实体", "转义"], icon: CodeXml, accent: "orange", component: HtmlEntityTool },
  { id: "url-parser", name: "URL 解析", shortName: "URL 解析", description: "拆解 URL 结构与查询参数", category: "开发", keywords: ["url", "query", "参数", "解析", "链接"], icon: Waypoints, accent: "cyan", component: UrlParserTool },
  { id: "text-diff", name: "文本 Diff", shortName: "Diff", description: "按行比较两段文本的新增与删除", category: "文本", keywords: ["diff", "compare", "文本", "比较", "差异"], icon: GitCompareArrows, accent: "amber", component: TextDiffTool },
  { id: "json-to-typescript", name: "JSON 转 TypeScript", shortName: "JSON → TS", description: "从 JSON 自动生成 TypeScript 类型", category: "开发", keywords: ["json", "typescript", "interface", "类型", "转换"], icon: FileJson2, accent: "teal", component: JsonToTsTool },
  { id: "xml-formatter", name: "XML 格式化", shortName: "XML", description: "格式化、校验与压缩 XML 文档", category: "开发", keywords: ["xml", "formatter", "格式化", "压缩"], icon: FileCode2, accent: "orange", component: XmlTool },
  { id: "csv-json", name: "CSV / JSON 转换", shortName: "CSV ↔ JSON", description: "CSV 表格与 JSON 对象数组相互转换", category: "编码", keywords: ["csv", "json", "表格", "转换"], icon: Table2, accent: "blue", component: CsvJsonTool },
  { id: "sql-formatter", name: "SQL 格式化", shortName: "SQL", description: "格式化与压缩常见 SQL 语句", category: "开发", keywords: ["sql", "database", "数据库", "格式化"], icon: Database, accent: "violet", component: SqlTool },
  { id: "cron-parser", name: "Cron 解析", shortName: "Cron", description: "校验并解释标准五段 Cron 表达式", category: "开发", keywords: ["cron", "schedule", "定时", "表达式"], icon: CalendarClock, accent: "amber", component: CronTool },
  { id: "markdown-preview", name: "Markdown 预览", shortName: "Markdown", description: "安全预览常用 Markdown 结构", category: "文本", keywords: ["markdown", "md", "预览", "文档"], icon: FileText, accent: "cyan", component: MarkdownTool },
  { id: "chmod-calculator", name: "Unix 权限计算", shortName: "Chmod", description: "计算 chmod 数字与符号权限", category: "开发", keywords: ["chmod", "unix", "linux", "权限"], icon: TerminalSquare, accent: "rose", component: ChmodTool },
  { id: "list-processor", name: "列表处理", shortName: "列表", description: "列表排序、去重、反转与清理空行", category: "文本", keywords: ["list", "sort", "unique", "列表", "排序", "去重"], icon: ListFilter, accent: "lime", component: ListTool },
  { id: "css-unit-converter", name: "CSS 单位转换", shortName: "CSS 单位", description: "PX、REM、EM 与 VW 快速换算", category: "开发", keywords: ["css", "px", "rem", "em", "vw", "单位"], icon: Ruler, accent: "teal", component: CssUnitTool },
]

export const findTool = (id?: string) => tools.find((tool) => tool.id === id)

export const searchTools = (query: string) => {
  const needle = query.trim().toLocaleLowerCase()
  if (!needle) return tools
  return tools.filter((tool) => [tool.name, tool.shortName, tool.description, tool.category, ...tool.keywords].join(" ").toLocaleLowerCase().includes(needle))
}
