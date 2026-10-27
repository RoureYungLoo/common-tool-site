import { Search } from "lucide-react"
import { useMemo, useState } from "react"
import ToolCard from "../components/ToolCard"
import content from "../content.json"
import { useStoredTools } from "../hooks/useStoredTools"
import { usePageMeta } from "../hooks/usePageMeta"
import { searchTools } from "../tools"
import { TOOL_CATEGORIES } from "../types"

export default function ToolsPage() {
  const meta = content.pages.tools
  usePageMeta(meta.title, meta.description, meta.path, meta.index)
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("全部")
  const { favorites } = useStoredTools()
  const visible = useMemo(() => searchTools(query).filter((tool) => category === "全部" || tool.category === category), [query, category])
  return <div className="mx-auto w-[calc(100%-2rem)] max-w-[1440px] pt-[38px] pb-8 max-[540px]:pt-[26px]">
    <div className="mb-6 max-w-[670px]"><span className="text-[13px] font-extrabold tracking-[.16em] text-app-brand-deep">TOOLBOX</span><h1 className="my-1 text-[35px] tracking-[-.045em] max-[540px]:text-[32px]">全部工具</h1><p className="m-0 text-[13px] leading-[1.6] text-app-muted">所有工具都在浏览器本地运行，快速且保护隐私。</p></div>
    <div className="mb-[15px] flex justify-between gap-4 max-[800px]:flex-col max-[800px]:items-stretch max-[540px]:mb-4">
      <label className="flex h-[38px] w-[300px] items-center gap-2 border border-app-line bg-app-surface px-3 text-app-muted focus-within:border-app-brand-deep focus-within:outline-2 focus-within:outline-app-brand-deep/20 max-[800px]:w-full"><Search size={18} /><input className="w-full border-0 bg-transparent text-app-text outline-none" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索工具…" /></label>
      <div className="flex gap-1 overflow-x-auto bg-app-soft p-1">{["全部", ...TOOL_CATEGORIES.map((item) => item.id)].map((item) => <button type="button" key={item} className={`px-[13px] py-2 text-[13px] whitespace-nowrap focus-visible:outline-2 focus-visible:outline-app-brand-deep ${category === item ? "bg-app-surface text-app-text shadow-sm" : "text-app-muted hover:text-app-text"}`} onClick={() => setCategory(item)}>{item}</button>)}</div>
    </div>
    <div className="mb-3 text-sm text-app-muted">{visible.length} 个工具</div>
    <div className="grid grid-cols-5 gap-2.5 max-[1350px]:grid-cols-4 max-[1050px]:grid-cols-3 max-[800px]:grid-cols-2 max-[540px]:grid-cols-1">{visible.map((tool) => <ToolCard key={tool.id} tool={tool} favorite={favorites.includes(tool.id)} />)}</div>
    {!visible.length && <div className="flex min-h-[280px] flex-col items-center justify-center border border-dashed border-app-line text-center text-app-muted"><Search size={28} /><h3 className="mt-4 mb-1 text-app-text">没有找到相关工具</h3><p className="m-0 text-[13px]">试试更短的关键词。</p></div>}
  </div>
}
