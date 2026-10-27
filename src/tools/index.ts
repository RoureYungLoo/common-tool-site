import { lazy, type ComponentType } from "react"
import { Binary, Braces, Calculator, CalendarClock, CaseSensitive, Clock3, CodeXml, Database, FileCode2, FileJson2, FileText, Fingerprint, GitCompareArrows, Hash, KeyRound, Link2, ListFilter, Mail, MessageSquareText, Palette, Phone, Regex, Ruler, ShieldCheck, Smartphone, Table2, TerminalSquare, Waypoints, type LucideIcon } from "lucide-react"
import content from "../content.json"
import type { ToolCategory, ToolDefinition } from "../types"

const toolIcons = {
  Binary, Braces, Calculator, CalendarClock, CaseSensitive, Clock3, CodeXml, Database,
  FileCode2, FileJson2, FileText, Fingerprint, GitCompareArrows, Hash, KeyRound, Link2,
  ListFilter, Mail, MessageSquareText, Palette, Phone, Regex, Ruler, ShieldCheck, Smartphone,
  Table2, TerminalSquare, Waypoints,
} satisfies Record<string, LucideIcon>

type ToolModule = { default: ComponentType }
type ToolCatalogEntry = {
  id: string
  name: string
  shortName: string
  description: string
  seoDescription: string
  category: ToolCategory
  keywords: string[]
  icon: keyof typeof toolIcons
  accent: string
  module: string
}

const toolModules = import.meta.glob<ToolModule>("./*Tool.tsx")
const catalog = content.tools as ToolCatalogEntry[]
const loaders = new Map<string, () => Promise<ToolModule>>()

export const tools: ToolDefinition[] = catalog.map((entry) => {
  const loader = toolModules[`./${entry.module}.tsx`]
  if (!loader) throw new Error(`找不到工具组件：${entry.module}`)
  loaders.set(entry.id, loader)
  return {
    id: entry.id,
    name: entry.name,
    shortName: entry.shortName,
    description: entry.description,
    seoDescription: entry.seoDescription,
    category: entry.category,
    keywords: entry.keywords,
    accent: entry.accent,
    icon: toolIcons[entry.icon],
    component: lazy(loader),
  }
})

export const findTool = (id?: string) => tools.find((tool) => tool.id === id)

export const preloadTool = (id: string) => {
  loaders.get(id)?.().catch(() => undefined)
}

export const searchTools = (query: string) => {
  const needle = query.trim().toLocaleLowerCase()
  if (!needle) return tools
  return tools.filter((tool) => [tool.name, tool.shortName, tool.description, tool.category, ...tool.keywords].join(" ").toLocaleLowerCase().includes(needle))
}
