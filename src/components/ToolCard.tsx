import { ArrowUpRight, Star } from "lucide-react"
import { Link } from "react-router-dom"
import { toggleFavorite } from "../lib/storage"
import { preloadTool } from "../tools"
import type { ToolDefinition } from "../types"

export default function ToolCard({ tool, favorite, dense = false }: { tool: ToolDefinition; favorite: boolean; dense?: boolean }) {
  const Icon = tool.icon
  return <article className="group relative min-w-0 border border-app-line bg-app-surface transition-[transform,box-shadow,border-color,background] duration-200 before:absolute before:-inset-y-px before:-left-px before:z-[2] before:w-[3px] before:origin-bottom before:scale-y-0 before:bg-app-brand-deep before:transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 hover:border-app-brand-deep hover:bg-app-soft hover:shadow-[0_10px_26px_-8px_color-mix(in_srgb,var(--brand-deep)_28%,transparent)] hover:before:scale-y-100 focus-within:-translate-x-0.5 focus-within:-translate-y-0.5 focus-within:border-app-brand-deep focus-within:shadow-[0_10px_26px_-8px_color-mix(in_srgb,var(--brand-deep)_28%,transparent)] focus-within:before:scale-y-100 motion-reduce:transition-none motion-reduce:before:transition-none">
    <Link to={`/tools/${tool.id}`} className={`flex focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-brand-deep ${dense ? "min-h-[58px] items-center gap-2 px-2.5 py-2 pr-9" : "min-h-[94px] items-start gap-3 px-4 py-[15px] pr-[42px]"}`} aria-label={`打开${tool.name}`} onMouseEnter={() => preloadTool(tool.id)} onFocus={() => preloadTool(tool.id)}>
      <span className={`tool-icon ${tool.accent} grid flex-none place-items-center transition-transform group-hover:-translate-y-0.5 group-focus-within:-translate-y-0.5 motion-reduce:transition-none ${dense ? "h-[30px] w-[30px]" : "h-9 w-9"}`}><Icon size={dense ? 17 : 21} strokeWidth={1.8} /></span>
      <span className="flex min-w-0 flex-col"><strong className={dense ? "truncate text-xs" : "text-[15px]"}>{tool.shortName}</strong>{!dense && <small className="mt-2 line-clamp-2 text-xs leading-6 text-app-muted">{tool.description}</small>}</span>
      {!dense && <ArrowUpRight className="absolute right-[17px] bottom-[17px] text-app-muted opacity-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100 group-focus-within:opacity-100" size={17} />}
    </Link>
    <button type="button" className={`absolute right-1.5 grid h-11 w-11 place-items-center border-0 bg-transparent focus-visible:outline-2 focus-visible:outline-app-brand-deep ${dense ? "top-1/2 -translate-y-1/2" : "top-0.5"} ${favorite ? "text-amber-600" : "text-zinc-400 hover:text-amber-600"}`} aria-label={favorite ? "取消收藏" : "收藏"} aria-pressed={favorite} onClick={() => toggleFavorite(tool.id)}><Star size={15} fill={favorite ? "currentColor" : "none"} /></button>
  </article>
}
