import { Search, X } from "lucide-react"
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react"
import { useNavigate } from "react-router-dom"
import { preloadTool, searchTools } from "../tools"

const focusableSelector = 'button:not([disabled]), input:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'

export default function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("")
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)
  const listboxId = useId()
  const navigate = useNavigate()
  const results = searchTools(query)
  const activeResult = results[activeIndex]

  useEffect(() => {
    if (!open) return
    previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    setQuery("")
    setActiveIndex(0)
    const frame = requestAnimationFrame(() => inputRef.current?.focus())
    document.body.style.overflow = "hidden"
    return () => {
      cancelAnimationFrame(frame)
      document.body.style.overflow = ""
      previousFocusRef.current?.focus()
    }
  }, [open])

  useEffect(() => {
    if (!open || !activeResult) return
    document.getElementById(`${listboxId}-${activeResult.id}`)?.scrollIntoView({ block: "nearest" })
    preloadTool(activeResult.id)
  }, [activeResult, listboxId, open])

  if (!open) return null

  const select = (id: string) => {
    preloadTool(id)
    navigate(`/tools/${id}`)
    onClose()
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault()
      if (!results.length) return
      const direction = event.key === "ArrowDown" ? 1 : -1
      setActiveIndex((current) => (current + direction + results.length) % results.length)
    } else if (event.key === "Home" && event.target !== inputRef.current) {
      event.preventDefault()
      setActiveIndex(0)
    } else if (event.key === "End" && event.target !== inputRef.current) {
      event.preventDefault()
      setActiveIndex(Math.max(0, results.length - 1))
    } else if (event.key === "Enter" && activeResult) {
      event.preventDefault()
      select(activeResult.id)
    } else if (event.key === "Escape") {
      event.preventDefault()
      onClose()
    } else if (event.key === "Tab") {
      const focusable = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>(focusableSelector) ?? [])
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
  }

  return <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/50 px-5 pt-[14vh] pb-5 backdrop-blur-sm motion-safe:animate-[fade-in_.15s_ease]" onMouseDown={onClose}>
    <div ref={dialogRef} className="w-full max-w-[620px] overflow-hidden border border-app-line bg-app-surface shadow-[0_28px_90px_rgba(0,0,0,.28)] motion-safe:animate-[rise-in_.2s_ease]" role="dialog" aria-modal="true" aria-label="搜索工具" onMouseDown={(event) => event.stopPropagation()} onKeyDown={handleKeyDown}>
      <div className="flex h-[62px] items-center gap-3 border-b border-app-line px-[17px] text-app-muted">
        <Search size={20} />
        <input
          ref={inputRef}
          role="combobox"
          aria-expanded="true"
          aria-autocomplete="list"
          aria-controls={listboxId}
          aria-activedescendant={activeResult ? `${listboxId}-${activeResult.id}` : undefined}
          value={query}
          onChange={(event) => { setQuery(event.target.value); setActiveIndex(0) }}
          className="min-w-0 flex-1 border-0 bg-transparent text-[15px] text-app-text outline-none"
          placeholder="搜索工具，例如 JSON、时间戳…"
        />
        <button type="button" className="grid h-11 w-11 place-items-center text-app-muted hover:text-app-text focus-visible:outline-2 focus-visible:outline-app-brand-deep" onClick={onClose} aria-label="关闭搜索"><X size={18} /></button>
      </div>
      <div id={listboxId} className="max-h-[390px] overflow-auto p-2.5" role="listbox" aria-label="工具搜索结果">
        <span className="block px-2 pt-1 pb-2 text-xs font-extrabold tracking-[.1em] text-app-muted">{query ? `找到 ${results.length} 个工具` : "全部工具"}</span>
        {results.map((tool, index) => {
          const Icon = tool.icon
          return <button
            id={`${listboxId}-${tool.id}`}
            key={tool.id}
            type="button"
            role="option"
            tabIndex={-1}
            aria-selected={activeIndex === index}
            className={`flex min-h-[62px] w-full items-center gap-3 border-0 px-3 py-2 text-left focus-visible:outline-2 focus-visible:outline-app-brand-deep ${activeIndex === index ? "bg-app-soft" : "bg-transparent hover:bg-app-soft"}`}
            onMouseEnter={() => setActiveIndex(index)}
            onClick={() => select(tool.id)}
          >
            <span className={`tool-icon ${tool.accent}`}><Icon size={18} /></span>
            <span className="flex min-w-0 flex-1 flex-col gap-1"><strong className="text-[13px]">{tool.name}</strong><small className="text-[13px] text-app-muted">{tool.description}</small></span>
            <kbd className={activeIndex === index ? "opacity-100" : "opacity-0"}>↵</kbd>
          </button>
        })}
        {!results.length && <div className="px-5 py-10 text-center text-[13px] text-app-muted">没有找到相关工具，换个关键词试试。</div>}
      </div>
      <div className="flex h-[42px] items-center justify-end gap-3.5 border-t border-app-line bg-app-soft px-3.5 text-xs text-app-muted"><span className="flex items-center gap-1"><kbd>↑↓</kbd> 浏览</span><span className="flex items-center gap-1"><kbd>↵</kbd> 打开</span><span className="flex items-center gap-1"><kbd>esc</kbd> 关闭</span></div>
    </div>
  </div>
}
