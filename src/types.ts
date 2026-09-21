import type { LucideIcon } from "lucide-react"
import type { ComponentType } from "react"

export type ToolCategory = "开发" | "编码" | "文本"

export interface ToolDefinition {
  id: string
  name: string
  shortName: string
  description: string
  category: ToolCategory
  keywords: string[]
  icon: LucideIcon
  accent: string
  component: ComponentType
}
