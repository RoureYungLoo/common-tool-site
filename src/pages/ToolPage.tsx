import { ChevronLeft, LockKeyhole, Star } from "lucide-react"
import { useEffect } from "react"
import { Link, Navigate, useParams } from "react-router-dom"
import { useStoredTools } from "../hooks/useStoredTools"
import { addRecent, toggleFavorite } from "../lib/storage"
import { findTool } from "../tools"

export default function ToolPage() {
  const { id } = useParams()
  const tool = findTool(id)
  const { favorites } = useStoredTools()
  useEffect(() => { if (tool) addRecent(tool.id) }, [tool])
  if (!tool) return <Navigate to="/tools" replace />
  const ToolComponent = tool.component
  const Icon = tool.icon
  const favorite = favorites.includes(tool.id)
  return <div className="page-container tool-page">
    <Link to="/tools" className="back-link"><ChevronLeft size={16} />全部工具</Link>
    <div className="tool-title-row">
      <div className="tool-title"><span className={`tool-icon large ${tool.accent}`}><Icon size={26} /></span><div><span className="section-kicker">{tool.category.toUpperCase()} TOOL</span><h1>{tool.name}</h1><p>{tool.description}</p></div></div>
      <button className={`favorite-large ${favorite ? "selected" : ""}`} onClick={() => toggleFavorite(tool.id)}><Star size={17} fill={favorite ? "currentColor" : "none"} />{favorite ? "已收藏" : "收藏"}</button>
    </div>
    <div className="workspace-card"><ToolComponent /></div>
    <div className="tool-privacy"><LockKeyhole size={15} />所有处理均在本地完成，你的内容不会离开此设备。</div>
  </div>
}
