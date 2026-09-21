import { Search } from "lucide-react"
import { useMemo, useState } from "react"
import ToolCard from "../components/ToolCard"
import { useStoredTools } from "../hooks/useStoredTools"
import { usePageMeta } from "../hooks/usePageMeta"
import { searchTools } from "../tools"

export default function ToolsPage() {
  usePageMeta("全部在线工具", "浏览禄若阳的工具站提供的免费开发者工具、编码工具和文本处理工具。", "/tools")
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("全部")
  const { favorites } = useStoredTools()
  const visible = useMemo(() => searchTools(query).filter((tool) => category === "全部" || tool.category === category), [query, category])
  return <div className="page-container listing-page">
    <div className="page-intro"><span className="section-kicker">TOOLBOX</span><h1>全部工具</h1><p>所有工具都在浏览器本地运行，快速且保护隐私。</p></div>
    <div className="filter-bar">
      <label><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索工具…" /></label>
      <div className="category-tabs">{["全部", "开发", "编码", "文本"].map((item) => <button key={item} className={category === item ? "active" : ""} onClick={() => setCategory(item)}>{item}</button>)}</div>
    </div>
    <div className="results-meta">{visible.length} 个工具</div>
    <div className="tool-grid">{visible.map((tool) => <ToolCard key={tool.id} tool={tool} favorite={favorites.includes(tool.id)} />)}</div>
    {!visible.length && <div className="empty-state"><Search size={28} /><h3>没有找到相关工具</h3><p>试试更短的关键词。</p></div>}
  </div>
}
