import { ArrowUpRight, Star } from "lucide-react"
import { Link } from "react-router-dom"
import { toggleFavorite } from "../lib/storage"
import type { ToolDefinition } from "../types"

export default function ToolCard({ tool, favorite, compact = false }: { tool: ToolDefinition; favorite: boolean; compact?: boolean }) {
  const Icon = tool.icon
  return <article className={`tool-card ${compact ? "compact" : ""}`}>
    <Link to={`/tools/${tool.id}`} className="tool-card-link" aria-label={`打开${tool.name}`}>
      <span className={`tool-icon ${tool.accent}`}><Icon size={compact ? 18 : 21} strokeWidth={1.8} /></span>
      <span className="tool-card-copy"><strong>{tool.shortName}</strong>{!compact && <small>{tool.description}</small>}</span>
      <ArrowUpRight className="card-arrow" size={17} />
    </Link>
    {!compact && <button className={`favorite-button ${favorite ? "selected" : ""}`} aria-label={favorite ? "取消收藏" : "收藏"} onClick={() => toggleFavorite(tool.id)}><Star size={15} fill={favorite ? "currentColor" : "none"} /></button>}
  </article>
}
