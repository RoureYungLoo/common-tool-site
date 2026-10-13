import { ArrowUpRight, Star } from "lucide-react"
import { Link } from "react-router-dom"
import { toggleFavorite } from "../lib/storage"
import type { ToolDefinition } from "../types"

export default function ToolCard({ tool, favorite, dense = false }: { tool: ToolDefinition; favorite: boolean; dense?: boolean }) {
  const Icon = tool.icon
  return <article className={`tool-card${dense ? " dense" : ""}`}>
    <Link to={`/tools/${tool.id}`} className="tool-card-link" aria-label={`打开${tool.name}`}>
      <span className={`tool-icon ${tool.accent}`}><Icon size={dense ? 17 : 21} strokeWidth={1.8} /></span>
      <span className="tool-card-copy"><strong>{tool.shortName}</strong>{!dense && <small>{tool.description}</small>}</span>
      {!dense && <ArrowUpRight className="card-arrow" size={17} />}
    </Link>
    <button className={`favorite-button ${favorite ? "selected" : ""}`} aria-label={favorite ? "取消收藏" : "收藏"} onClick={() => toggleFavorite(tool.id)}><Star size={15} fill={favorite ? "currentColor" : "none"} /></button>
  </article>
}
