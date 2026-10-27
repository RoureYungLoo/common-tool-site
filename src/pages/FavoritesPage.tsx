import { Star } from "lucide-react"
import { Link } from "react-router-dom"
import ToolCard from "../components/ToolCard"
import content from "../content.json"
import { useStoredTools } from "../hooks/useStoredTools"
import { usePageMeta } from "../hooks/usePageMeta"
import { tools } from "../tools"

export default function FavoritesPage() {
  const meta = content.pages.favorites
  usePageMeta(meta.title, meta.description, meta.path, meta.index)
  const { favorites } = useStoredTools()
  const favoriteTools = tools.filter((tool) => favorites.includes(tool.id))
  return <div className="mx-auto w-[calc(100%-2rem)] max-w-[1440px] pt-[38px] pb-8 max-[540px]:pt-[26px]">
    <div className="mb-6 max-w-[670px]"><span className="text-[13px] font-extrabold tracking-[.16em] text-app-brand-deep">YOUR COLLECTION</span><h1 className="my-1 text-[35px] tracking-[-.045em] max-[540px]:text-[32px]">收藏工具</h1><p className="m-0 text-[13px] leading-[1.6] text-app-muted">把经常使用的工具放在手边。</p></div>
    {favoriteTools.length ? <div className="grid grid-cols-5 gap-2.5 max-[1350px]:grid-cols-4 max-[1050px]:grid-cols-3 max-[800px]:grid-cols-2 max-[540px]:grid-cols-1">{favoriteTools.map((tool) => <ToolCard key={tool.id} tool={tool} favorite />)}</div> : <div className="flex min-h-[280px] flex-col items-center justify-center border border-dashed border-app-line text-center text-app-muted"><Star size={30} /><h3 className="mt-4 mb-1 text-app-text">还没有收藏工具</h3><p className="mt-0 mb-5 text-[13px]">点击工具卡片上的星标，随时在这里找到它。</p><Link className="inline-flex min-h-[38px] items-center border border-blue-600 bg-app-brand px-4 text-xs font-bold text-white focus-visible:outline-2 focus-visible:outline-app-brand-deep dark:text-slate-950" to="/tools">浏览全部工具</Link></div>}
  </div>
}
