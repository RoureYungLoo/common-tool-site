import { Star } from "lucide-react"
import { Link } from "react-router-dom"
import ToolCard from "../components/ToolCard"
import { useStoredTools } from "../hooks/useStoredTools"
import { usePageMeta } from "../hooks/usePageMeta"
import { tools } from "../tools"

export default function FavoritesPage() {
  usePageMeta("收藏工具", "查看你在禄若阳的工具站收藏的常用在线工具。", "/favorites", false)
  const { favorites } = useStoredTools()
  const favoriteTools = tools.filter((tool) => favorites.includes(tool.id))
  return <div className="page-container listing-page">
    <div className="page-intro"><span className="section-kicker">YOUR COLLECTION</span><h1>收藏工具</h1><p>把经常使用的工具放在手边。</p></div>
    {favoriteTools.length ? <div className="tool-grid">{favoriteTools.map((tool) => <ToolCard key={tool.id} tool={tool} favorite />)}</div> : <div className="empty-state"><Star size={30} /><h3>还没有收藏工具</h3><p>点击工具卡片上的星标，随时在这里找到它。</p><Link className="button link-button" to="/tools">浏览全部工具</Link></div>}
  </div>
}
