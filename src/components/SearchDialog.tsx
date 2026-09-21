import { Search, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { searchTools } from "../tools"

export default function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  useEffect(() => {
    if (open) { setQuery(""); window.setTimeout(() => inputRef.current?.focus(), 10) }
  }, [open])
  useEffect(() => {
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") onClose() }
    window.addEventListener("keydown", escape)
    return () => window.removeEventListener("keydown", escape)
  }, [onClose])
  if (!open) return null
  const results = searchTools(query)
  const select = (id: string) => { navigate(`/tools/${id}`); onClose() }
  return <div className="dialog-backdrop" onMouseDown={onClose}>
    <div className="search-dialog" role="dialog" aria-modal="true" aria-label="搜索工具" onMouseDown={(event) => event.stopPropagation()}>
      <div className="dialog-input"><Search size={20} /><input ref={inputRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索工具，例如 JSON、时间戳…" onKeyDown={(event) => { if (event.key === "Enter" && results[0]) select(results[0].id) }} /><button onClick={onClose}><X size={18} /></button></div>
      <div className="dialog-results">
        <span className="dialog-label">{query ? `找到 ${results.length} 个工具` : "全部工具"}</span>
        {results.map((tool) => { const Icon = tool.icon; return <button key={tool.id} onClick={() => select(tool.id)}><span className={`tool-icon ${tool.accent}`}><Icon size={18} /></span><span><strong>{tool.name}</strong><small>{tool.description}</small></span><kbd>↵</kbd></button> })}
        {!results.length && <div className="empty-small">没有找到相关工具，换个关键词试试。</div>}
      </div>
      <div className="dialog-foot"><span><kbd>↑↓</kbd> 浏览</span><span><kbd>↵</kbd> 打开</span><span><kbd>esc</kbd> 关闭</span></div>
    </div>
  </div>
}
