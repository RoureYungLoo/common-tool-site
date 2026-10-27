import { ArrowRight, Search, ShieldCheck, Sparkles, Zap } from "lucide-react"
import { useOutletContext } from "react-router-dom"
import ToolCard from "../components/ToolCard"
import content from "../content.json"
import { useStoredTools } from "../hooks/useStoredTools"
import { usePageMeta } from "../hooks/usePageMeta"
import { tools } from "../tools"
import { TOOL_CATEGORIES } from "../types"

const defaultPopularToolIds = [
  "json-formatter",
  "timestamp",
  "base64",
  "url-codec",
  "uuid-generator",
  "regex-tester",
]

export default function HomePage() {
  const meta = content.pages.home
  usePageMeta(meta.title, meta.description, meta.path, meta.index)
  const { openSearch } = useOutletContext<{ openSearch: () => void }>()
  const { favorites, recents, usage } = useStoredTools()
  const usedToolIds = Object.entries(usage)
    .sort(([, left], [, right]) => right.count - left.count || right.lastUsed - left.lastUsed)
    .map(([id]) => id)
  const featuredIds = [...new Set([...usedToolIds, ...recents, ...defaultPopularToolIds])].slice(0, 6)
  const featured = featuredIds.map((id) => tools.find((tool) => tool.id === id)).filter((tool) => tool !== undefined)
  const gridClass = "grid grid-cols-6 gap-2 max-[1150px]:grid-cols-5 max-[950px]:grid-cols-4 max-[800px]:grid-cols-2 max-[540px]:grid-cols-1"
  return <>
    <section className="hero relative flex min-h-[400px] flex-col items-center overflow-hidden px-6 pt-10 pb-9 text-center max-[800px]:min-h-[370px] max-[800px]:px-5 max-[800px]:pt-9 max-[800px]:pb-8 max-[540px]:min-h-[340px] max-[540px]:px-[18px] max-[540px]:pt-8 max-[540px]:pb-7">
      <div className="hero-grid" aria-hidden="true" />
      <div className="relative flex items-center gap-2 border border-app-brand-deep/30 bg-app-brand/10 px-3 py-2 text-xs font-semibold text-app-brand-deep"><Sparkles size={14} /> 简单、轻快、开箱即用</div>
      <h1 className="relative my-3 mt-[17px] text-[clamp(40px,4.5vw,58px)] leading-[1.1] tracking-[-.052em] max-[540px]:text-[38px]">让琐碎的工作，<br /><span>少一点折腾。</span></h1>
      <p className="relative mt-0 mb-5 text-[15px] leading-[1.7] text-app-muted max-[540px]:text-[13px]">为开发者和日常工作准备的一组小工具。无需注册，<br className="max-[800px]:hidden" />数据不会离开你的浏览器。</p>
      <button type="button" className="relative flex h-[52px] w-[min(620px,calc(100vw-40px))] cursor-text items-center gap-3 border border-app-line bg-app-surface px-3 pl-[17px] text-left text-app-muted shadow-[0_10px_30px_rgba(38,49,42,.09)] transition hover:border-app-brand-deep hover:shadow-[0_14px_42px_rgba(38,49,42,.14)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-brand-deep max-[540px]:h-[50px]" onClick={openSearch}>
        <Search size={21} /><span className="flex-1">搜索工具，例如 JSON、Base64、时间戳…</span><kbd className="px-2 py-1 max-[540px]:hidden">Ctrl K</kbd>
      </button>
      <div className="relative mt-3 flex gap-[18px] text-[13px] text-app-muted max-[800px]:gap-3"><span className="flex items-center gap-1"><Zap size={15} /> 即开即用</span><span className="flex items-center gap-1"><ShieldCheck size={15} /> 本地处理</span><span className="max-[540px]:hidden">{tools.length} 个精选工具</span></div>
    </section>

    <section className="mx-auto w-[calc(100%-2rem)] max-w-[1440px]">
      <div className="mt-1 mb-11 max-[540px]:mb-9">
        <div className="mb-[15px] flex items-end justify-between"><div><h2 className="m-0 text-[23px] tracking-[-.03em]">常用工具</h2></div><a className="flex items-center gap-1.5 text-[13px] text-app-muted hover:text-app-text" href="#all-tools">查看全部 <ArrowRight size={16} /></a></div>
        <div className={gridClass}>{featured.map((tool) => <ToolCard key={tool.id} tool={tool} favorite={favorites.includes(tool.id)} dense />)}</div>
      </div>
      <div className="mt-1 mb-11 max-[540px]:mb-9" id="all-tools">
        <div className="mb-[15px] flex items-end justify-between"><div><h2 className="m-0 text-[23px] tracking-[-.03em]">全部工具</h2></div></div>
        <div className="grid gap-[26px]">
          {TOOL_CATEGORIES.map((category) => {
            const categoryTools = tools.filter((tool) => tool.category === category.id)
            return <section className="min-w-0" key={category.id}>
              <div className="mb-2 flex min-h-7 items-center gap-2 border-b border-app-line"><h3 className="mt-0 mb-2 text-[13px]">{category.label}</h3><span className="mb-2 grid h-[18px] min-w-5 place-items-center bg-app-soft px-1.5 text-xs text-app-muted">{categoryTools.length}</span></div>
              <div className={gridClass}>{categoryTools.map((tool) => <ToolCard key={tool.id} tool={tool} favorite={favorites.includes(tool.id)} dense />)}</div>
            </section>
          })}
        </div>
      </div>
    </section>
  </>
}
