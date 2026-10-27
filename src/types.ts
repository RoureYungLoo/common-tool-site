import type { LucideIcon } from "lucide-react"
import type { ComponentType, LazyExoticComponent } from "react"

export const TOOL_CATEGORIES = [
  { id: "加密/解密", label: "加密/解密工具" },
  { id: "编码/解码", label: "编码/解码工具" },
  { id: "生成器", label: "生成器" },
  { id: "日期/时间", label: "日期/时间工具" },
  { id: "开发/运维", label: "开发/运维工具" },
  { id: "文本", label: "文本工具" },
  { id: "生活", label: "生活工具" },
] as const

export type ToolCategory = (typeof TOOL_CATEGORIES)[number]["id"]

export interface ToolDefinition {
  id: string
  name: string
  shortName: string
  description: string
  seoDescription: string
  category: ToolCategory
  keywords: string[]
  icon: LucideIcon
  accent: string
  component: LazyExoticComponent<ComponentType>
}
