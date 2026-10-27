import { Check, ChevronDown, ChevronLeft, Columns2, Columns3, Grid2X2, Rows2, Rows3, Search, Square, Star } from "lucide-react"
import { Suspense, useEffect, useId, useRef, useState, type ComponentType, type KeyboardEvent } from "react"
import { Link, Navigate, useParams } from "react-router-dom"
import { useStoredTools } from "../hooks/useStoredTools"
import { usePageMeta } from "../hooks/usePageMeta"
import { addRecent, toggleFavorite } from "../lib/storage"
import { findTool, searchTools, tools } from "../tools"
import ErrorBoundary from "../components/ErrorBoundary"
import { ToolStateScope } from "../components/ui"

type LayoutId = "single" | "columns-2" | "rows-2" | "columns-3" | "rows-3" | "grid-4"

const layouts: { id: LayoutId; name: string; slots: number; icon: ComponentType<{ size?: number }> }[] = [
  { id: "single", name: "单窗", slots: 1, icon: Square },
  { id: "columns-2", name: "双列", slots: 2, icon: Columns2 },
  { id: "rows-2", name: "双行", slots: 2, icon: Rows2 },
  { id: "columns-3", name: "三列", slots: 3, icon: Columns3 },
  { id: "rows-3", name: "三行", slots: 3, icon: Rows3 },
  { id: "grid-4", name: "田字", slots: 4, icon: Grid2X2 },
]

const WORKSPACE_STORAGE_PREFIX = "foldrule-workspace-v1:"
const isLayoutId = (value: unknown): value is LayoutId => layouts.some((layout) => layout.id === value)
const slotsFor = (layout: LayoutId) => layouts.find((item) => item.id === layout)?.slots ?? 1
const layoutGridClasses: Record<LayoutId, string> = {
  "single": "grid-cols-1",
  "columns-2": "grid-cols-2 max-[800px]:grid-cols-1",
  "rows-2": "grid-cols-1",
  "columns-3": "grid-cols-3 max-[800px]:grid-cols-1",
  "rows-3": "grid-cols-1",
  "grid-4": "grid-cols-2 max-[800px]:grid-cols-1",
}

interface PaneState {
  key: string
  toolId: string
}

function createWorkspace(routeToolId: string) {
  let stored: { layout?: unknown; tools?: unknown } | null = null
  try {
    stored = JSON.parse(sessionStorage.getItem(`${WORKSPACE_STORAGE_PREFIX}${routeToolId}`) ?? "null")
  } catch { /* Ignore unavailable or invalid session data. */ }
  const params = new URLSearchParams(window.location.search)
  const requestedLayout = params.get("layout") ?? stored?.layout
  const layout: LayoutId = isLayoutId(requestedLayout) ? requestedLayout : "single"
  const urlTools = params.get("tools")?.split(",")
  const requestedTools = urlTools?.length ? urlTools : Array.isArray(stored?.tools) ? stored.tools : []
  const toolIds = Array.from({ length: 4 }, (_, index) => {
    const candidate = typeof requestedTools[index] === "string" ? requestedTools[index] : routeToolId
    return findTool(candidate) ? candidate : routeToolId
  })
  return {
    layout,
    panes: toolIds.map((toolId) => ({ key: crypto.randomUUID(), toolId })),
    mountedSlots: slotsFor(layout),
  }
}

interface ToolPickerProps {
  value: string
  paneIndex: number
  onChange: (toolId: string) => void
}

function ToolPicker({ value, paneIndex, onChange }: ToolPickerProps) {
  const selectedTool = findTool(value) ?? tools[0]
  const selectedIndex = Math.max(0, tools.findIndex((item) => item.id === selectedTool.id))
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(selectedIndex)
  const [query, setQuery] = useState("")
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const optionsRef = useRef<HTMLDivElement>(null)
  const listboxId = useId()
  const SelectedIcon = selectedTool.icon
  const filteredTools = searchTools(query)

  useEffect(() => {
    if (!open) return
    setQuery("")
    setActiveIndex(selectedIndex)
    const frame = requestAnimationFrame(() => searchRef.current?.focus())
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener("pointerdown", closeOnOutsideClick)
    return () => {
      cancelAnimationFrame(frame)
      document.removeEventListener("pointerdown", closeOnOutsideClick)
    }
  }, [open, selectedIndex])

  useEffect(() => {
    if (!open) return
    const activeOption = optionsRef.current?.children.item(activeIndex)
    if (activeOption instanceof HTMLElement) activeOption.scrollIntoView({ block: "nearest" })
  }, [activeIndex, open])

  const chooseTool = (toolId: string) => {
    onChange(toolId)
    setOpen(false)
    requestAnimationFrame(() => triggerRef.current?.focus())
  }

  const handleMenuKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault()
      const direction = event.key === "ArrowDown" ? 1 : -1
      if (filteredTools.length) setActiveIndex((current) => (current + direction + filteredTools.length) % filteredTools.length)
    } else if ((event.key === "Home" || event.key === "End") && event.target !== searchRef.current) {
      event.preventDefault()
      setActiveIndex(event.key === "Home" ? 0 : filteredTools.length - 1)
    } else if (event.key === "Enter" || (event.key === " " && event.target !== searchRef.current)) {
      event.preventDefault()
      if (filteredTools[activeIndex]) chooseTool(filteredTools[activeIndex].id)
    } else if (event.key === "Escape") {
      event.preventDefault()
      setOpen(false)
      triggerRef.current?.focus()
    } else if (event.key === "Tab") {
      setOpen(false)
    }
  }

  return <div className="relative min-w-0" ref={rootRef}>
    <button
      ref={triggerRef}
      type="button"
      className="flex h-11 max-w-full items-center gap-2 border border-transparent bg-transparent px-1.5 text-left text-sm font-semibold hover:border-app-line hover:bg-app-surface focus-visible:outline-2 focus-visible:outline-app-brand-deep"
      aria-label={`窗口 ${paneIndex + 1} 的工具：${selectedTool.name}`}
      aria-haspopup="listbox"
      aria-expanded={open}
      aria-controls={listboxId}
      onClick={() => setOpen((current) => !current)}
      onKeyDown={(event) => {
        if (event.key === "ArrowDown" || event.key === "ArrowUp") {
          event.preventDefault()
          setOpen(true)
        }
      }}
    >
      <span className={`tool-icon ${selectedTool.accent} grid h-[25px] w-[25px] flex-none place-items-center`}><SelectedIcon size={14} /></span>
      <span className="min-w-0 truncate">{selectedTool.name}</span>
      <ChevronDown className={`flex-none text-app-muted transition-transform ${open ? "rotate-180" : ""}`} size={14} />
    </button>
    {open && <div
      className="absolute top-[calc(100%+6px)] left-0 z-30 w-[min(320px,calc(100vw-48px))] overflow-hidden border border-app-line bg-app-surface p-1 shadow-[0_16px_42px_rgba(24,33,28,.16)]"
      onKeyDown={handleMenuKeyDown}
    >
      <div className="mb-1 flex h-[42px] items-center gap-2 border border-app-line bg-app-bg px-2 text-app-muted focus-within:border-app-brand-deep focus-within:outline-2 focus-within:outline-app-brand-deep/20">
        <Search size={15} />
        <input
          ref={searchRef}
          type="search"
          value={query}
          placeholder="搜索工具…"
          className="min-w-0 flex-1 border-0 bg-transparent text-[13px] text-app-text outline-none"
          aria-label="搜索工具"
          role="combobox"
          aria-expanded="true"
          aria-autocomplete="list"
          aria-controls={listboxId}
          aria-activedescendant={filteredTools[activeIndex] ? `${listboxId}-${filteredTools[activeIndex].id}` : undefined}
          onChange={(event) => {
            setQuery(event.target.value)
            setActiveIndex(0)
          }}
        />
      </div>
      <div ref={optionsRef} id={listboxId} className="max-h-[280px] overflow-y-auto" role="listbox" aria-label={`为窗口 ${paneIndex + 1} 选择工具`}>
      {filteredTools.map((item, itemIndex) => {
        const ItemIcon = item.icon
        const selected = item.id === selectedTool.id
        return <button
          key={item.id}
          id={`${listboxId}-${item.id}`}
          type="button"
          role="option"
          tabIndex={-1}
          className={`flex min-h-11 w-full items-center gap-2 border-0 px-2 py-1 text-left focus-visible:outline-2 focus-visible:outline-app-brand-deep ${selected ? "text-app-brand-deep" : "text-app-text"} ${activeIndex === itemIndex ? "bg-app-soft" : "bg-transparent hover:bg-app-soft"}`}
          aria-selected={selected}
          onMouseEnter={() => setActiveIndex(itemIndex)}
          onClick={() => chooseTool(item.id)}
        >
          <span className={`tool-icon ${item.accent} grid h-[29px] w-[29px] flex-none place-items-center`}><ItemIcon size={15} /></span>
          <span className="flex min-w-0 flex-1 items-baseline gap-2"><strong className="truncate text-sm">{item.name}</strong><small className="flex-none text-xs text-app-muted">{item.category}</small></span>
          {selected && <Check className="flex-none text-app-brand-deep" size={15} />}
        </button>
      })}
      {!filteredTools.length && <div className="grid min-h-[90px] place-items-center text-xs text-app-muted">没有找到匹配的工具</div>}
      </div>
    </div>}
  </div>
}

export default function ToolPage() {
  const { id } = useParams()
  const tool = findTool(id)
  const { favorites } = useStoredTools()
  const routeToolId = tool?.id ?? "json-formatter"
  const initialWorkspace = useRef<ReturnType<typeof createWorkspace> | null>(null)
  if (!initialWorkspace.current) initialWorkspace.current = createWorkspace(routeToolId)
  const [layout, setLayout] = useState<LayoutId>(initialWorkspace.current.layout)
  const [panes, setPanes] = useState<PaneState[]>(initialWorkspace.current.panes)
  const [mountedSlots, setMountedSlots] = useState(initialWorkspace.current.mountedSlots)
  const activeRouteRef = useRef(routeToolId)
  const skipPersistRef = useRef(false)
  usePageMeta(
    tool?.name ?? "在线工具",
    tool?.seoDescription ?? "禄若阳的工具站提供免费、私密的在线开发工具。",
    tool ? `/tools/${tool.id}` : "/tools",
    Boolean(tool),
  )
  useEffect(() => {
    if (!tool) return
    addRecent(tool.id)
    if (activeRouteRef.current !== tool.id) {
      const next = createWorkspace(tool.id)
      activeRouteRef.current = tool.id
      skipPersistRef.current = true
      setPanes(next.panes)
      setLayout(next.layout)
      setMountedSlots(next.mountedSlots)
    }
  }, [tool])
  useEffect(() => {
    if (!tool || activeRouteRef.current !== tool.id) return
    if (skipPersistRef.current) {
      skipPersistRef.current = false
      return
    }
    const toolIds = panes.map((pane) => pane.toolId)
    try { sessionStorage.setItem(`${WORKSPACE_STORAGE_PREFIX}${tool.id}`, JSON.stringify({ layout, tools: toolIds })) } catch { /* Session storage is optional. */ }
    const url = new URL(window.location.href)
    if (layout === "single") url.searchParams.delete("layout")
    else url.searchParams.set("layout", layout)
    if (layout === "single" && toolIds[0] === tool.id) url.searchParams.delete("tools")
    else url.searchParams.set("tools", toolIds.join(","))
    window.history.replaceState(window.history.state, "", `${url.pathname}${url.search}${url.hash}`)
  }, [layout, panes, tool])
  if (!tool) return <Navigate to="/tools" replace />
  const Icon = tool.icon
  const favorite = favorites.includes(tool.id)

  const applyLayout = (nextLayout: LayoutId) => {
    const preset = layouts.find((item) => item.id === nextLayout)!
    setLayout(nextLayout)
    setMountedSlots((current) => Math.max(current, preset.slots))
  }

  const changePaneTool = (paneKey: string, toolId: string) => {
    setPanes((current) => current.map((pane) => pane.key === paneKey ? { ...pane, toolId } : pane))
    addRecent(toolId)
  }

  return <div className="mx-auto w-[calc(100%-2rem)] max-w-[1680px] pt-[38px] pb-8 max-[540px]:pt-[26px]">
    <Link to="/tools" className="mb-[18px] inline-flex min-h-11 items-center gap-1 text-sm text-app-muted hover:text-app-text focus-visible:outline-2 focus-visible:outline-app-brand-deep"><ChevronLeft size={16} />全部工具</Link>
    <div className="mb-[18px] flex items-center justify-between max-[540px]:items-start max-[540px]:gap-3">
      <div className="flex items-center gap-3 max-[540px]:items-start"><span className={`tool-icon ${tool.accent} grid h-12 w-12 flex-none place-items-center max-[540px]:hidden`}><Icon size={26} /></span><h1 className="my-1 text-[26px] tracking-[-.035em]">{tool.name}</h1></div>
      <button type="button" className={`flex min-h-11 items-center gap-2 border border-app-line bg-app-surface px-3 text-xs focus-visible:outline-2 focus-visible:outline-app-brand-deep max-[540px]:w-11 max-[540px]:justify-center max-[540px]:px-0 max-[540px]:text-[0] ${favorite ? "border-amber-300 bg-amber-50 text-amber-700 dark:bg-amber-950/30" : ""}`} aria-pressed={favorite} onClick={() => toggleFavorite(tool.id)}><Star size={17} fill={favorite ? "currentColor" : "none"} />{favorite ? "已收藏" : "收藏"}</button>
    </div>
    <div className="mb-2 flex min-h-[54px] items-center justify-center border border-app-line bg-app-surface px-3 py-1.5">
      <div className="flex w-full gap-1 bg-app-soft p-0.5" role="group" aria-label="工作区布局">
        {layouts.map((item) => {
          const LayoutIcon = item.icon
          return <button type="button" key={item.id} className={`flex h-11 min-w-0 flex-1 items-center justify-center text-app-muted hover:text-app-text focus-visible:outline-2 focus-visible:outline-app-brand-deep ${layout === item.id ? "bg-app-surface text-app-text shadow-sm" : "bg-transparent"}`} onClick={() => applyLayout(item.id)} aria-label={item.name} aria-pressed={layout === item.id} title={item.name}>
            <LayoutIcon size={16} />
          </button>
        })}
      </div>
    </div>
    <div className={`multi-workspace layout-${layout} grid items-stretch gap-2 ${layoutGridClasses[layout]}`}>
      {panes.slice(0, mountedSlots).map((pane, index) => {
        const paneTool = findTool(pane.toolId) ?? tool
        const PaneTool = paneTool.component
        return <section className="workspace-pane flex min-w-0 flex-col" key={pane.key} hidden={index >= slotsFor(layout)}>
          <div className="flex min-h-[52px] items-center border border-b-0 border-app-line bg-app-soft/60 px-2 py-1">
            <ToolPicker value={paneTool.id} paneIndex={index} onChange={(toolId) => changePaneTool(pane.key, toolId)} />
          </div>
          <div className="workspace-card min-w-0 flex-1 border border-app-line bg-app-surface p-3 shadow-[0_6px_24px_rgba(24,33,28,.035)] max-[540px]:p-2"><ErrorBoundary compact resetKey={paneTool.id}><Suspense fallback={<div className="grid min-h-64 place-items-center text-sm text-app-muted" role="status">正在加载工具…</div>}><ToolStateScope scope={`${routeToolId}:${index}:${paneTool.id}`}><PaneTool key={paneTool.id} /></ToolStateScope></Suspense></ErrorBoundary></div>
        </section>
      })}
    </div>
  </div>
}
