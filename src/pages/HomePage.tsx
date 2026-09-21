import { ArrowRight, Search, ShieldCheck, Sparkles, Zap } from "lucide-react"
import { useOutletContext } from "react-router-dom"
import ToolCard from "../components/ToolCard"
import { useStoredTools } from "../hooks/useStoredTools"
import { usePageMeta } from "../hooks/usePageMeta"
import { tools } from "../tools"
import type { ToolCategory } from "../types"

const categories: { id: ToolCategory; label: string }[] = [
  { id: "开发", label: "开发工具" },
  { id: "编码", label: "编码工具" },
  { id: "文本", label: "文本工具" },
]

export default function HomePage() {
  usePageMeta("禄若阳的工具站", "JSON、Base64、URL、UUID、时间戳、Hash、JWT 等免费在线工具，所有数据均在浏览器本地处理。")
  const { openSearch } = useOutletContext<{ openSearch: () => void }>()
  const { favorites, recents } = useStoredTools()
  const recentTools = recents.map((id) => tools.find((tool) => tool.id === id)).filter(Boolean).slice(0, 4) as typeof tools
  const featured = tools.slice(0, 6)
  return <>
    <section className="hero">
      <div className="hero-grid" aria-hidden="true" />
      <div className="eyebrow"><Sparkles size={14} /> 简单、轻快、开箱即用</div>
      <h1>让琐碎的工作，<br /><span>少一点折腾。</span></h1>
      <p>为开发者和日常工作准备的一组小工具。无需注册，<br className="desktop-only" />数据不会离开你的浏览器。</p>
      <button className="hero-search" onClick={openSearch}>
        <Search size={21} /><span>搜索工具，例如 JSON、Base64、时间戳…</span><kbd>Ctrl K</kbd>
      </button>
      <div className="hero-hints"><span><Zap size={15} /> 即开即用</span><span><ShieldCheck size={15} /> 本地处理</span><span>{tools.length} 个精选工具</span></div>
    </section>

    <section className="content-section">
      {recentTools.length > 0 && <div className="section-block recent-block">
        <div className="section-heading"><div><span className="section-kicker">QUICK ACCESS</span><h2>最近使用</h2></div></div>
        <div className="recent-grid">{recentTools.map((tool) => <ToolCard key={tool.id} tool={tool} favorite={favorites.includes(tool.id)} compact />)}</div>
      </div>}
      <div className="section-block">
        <div className="section-heading"><div><span className="section-kicker">POPULAR TOOLS</span><h2>常用工具</h2><p>把高频操作变成一次点击。</p></div><a href="#all-tools">查看全部 <ArrowRight size={16} /></a></div>
        <div className="tool-grid">{featured.map((tool) => <ToolCard key={tool.id} tool={tool} favorite={favorites.includes(tool.id)} />)}</div>
      </div>
      <div className="section-block" id="all-tools">
        <div className="section-heading"><div><span className="section-kicker">ALL TOOLS</span><h2>全部工具</h2><p>当前共有 {tools.length} 个工具，全部在浏览器本地运行。</p></div></div>
        <div className="home-category-list">
          {categories.map((category) => {
            const categoryTools = tools.filter((tool) => tool.category === category.id)
            return <section className="home-category-group" key={category.id}>
              <div className="home-category-heading"><h3>{category.label}</h3><span>{categoryTools.length}</span></div>
              <div className="tool-grid">{categoryTools.map((tool) => <ToolCard key={tool.id} tool={tool} favorite={favorites.includes(tool.id)} />)}</div>
            </section>
          })}
        </div>
      </div>
      <div className="privacy-banner"><span className="privacy-icon"><ShieldCheck size={26} /></span><div><strong>你的数据，只属于你</strong><p>所有工具都在本地浏览器中运行，内容不会上传到服务器。</p></div><span className="local-badge">100% 本地处理</span></div>
    </section>
  </>
}
