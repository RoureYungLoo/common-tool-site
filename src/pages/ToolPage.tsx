import { ChevronLeft, Columns2, Columns3, Grid2X2, LayoutGrid, LockKeyhole, Rows2, Rows3, Square, Star } from "lucide-react"
import { useEffect, useState, type ComponentType } from "react"
import { Link, Navigate, useParams } from "react-router-dom"
import { useStoredTools } from "../hooks/useStoredTools"
import { usePageMeta } from "../hooks/usePageMeta"
import { addRecent, toggleFavorite } from "../lib/storage"
import { findTool, tools } from "../tools"

type LayoutId = "single" | "columns-2" | "rows-2" | "columns-3" | "rows-3" | "grid-4"

const layouts: { id: LayoutId; name: string; slots: number; icon: ComponentType<{ size?: number }> }[] = [
  { id: "single", name: "单窗", slots: 1, icon: Square },
  { id: "columns-2", name: "双列", slots: 2, icon: Columns2 },
  { id: "rows-2", name: "双行", slots: 2, icon: Rows2 },
  { id: "columns-3", name: "三列", slots: 3, icon: Columns3 },
  { id: "rows-3", name: "三行", slots: 3, icon: Rows3 },
  { id: "grid-4", name: "田字", slots: 4, icon: Grid2X2 },
]

interface PaneState {
  key: string
  toolId: string
}

export default function ToolPage() {
  const { id } = useParams()
  const tool = findTool(id)
  const { favorites } = useStoredTools()
  const [layout, setLayout] = useState<LayoutId>("single")
  const [panes, setPanes] = useState<PaneState[]>(() => [{ key: crypto.randomUUID(), toolId: id ?? "json-formatter" }])
  usePageMeta(
    tool?.name ?? "在线工具",
    tool ? `${tool.description}。免费使用，所有数据均在浏览器本地处理。` : "禄若阳的工具站提供免费、私密的在线开发工具。",
    tool ? `/tools/${tool.id}` : "/tools",
    Boolean(tool),
  )
  useEffect(() => {
    if (!tool) return
    addRecent(tool.id)
    setPanes([{ key: crypto.randomUUID(), toolId: tool.id }])
    setLayout("single")
  }, [tool])
  if (!tool) return <Navigate to="/tools" replace />
  const Icon = tool.icon
  const favorite = favorites.includes(tool.id)

  const applyLayout = (nextLayout: LayoutId) => {
    const preset = layouts.find((item) => item.id === nextLayout)!
    setLayout(nextLayout)
    setPanes((current) => Array.from({ length: preset.slots }, (_, index) => current[index] ?? {
      key: crypto.randomUUID(),
      toolId: tool.id,
    }))
  }

  const changePaneTool = (paneKey: string, toolId: string) => {
    setPanes((current) => current.map((pane) => pane.key === paneKey ? { ...pane, toolId } : pane))
    addRecent(toolId)
  }

  return <div className="page-container tool-page">
    <Link to="/tools" className="back-link"><ChevronLeft size={16} />全部工具</Link>
    <div className="tool-title-row">
      <div className="tool-title"><span className={`tool-icon large ${tool.accent}`}><Icon size={26} /></span><h1>{tool.name}</h1></div>
      <button className={`favorite-large ${favorite ? "selected" : ""}`} onClick={() => toggleFavorite(tool.id)}><Star size={17} fill={favorite ? "currentColor" : "none"} />{favorite ? "已收藏" : "收藏"}</button>
    </div>
    <div className="workspace-toolbar">
      <div className="workspace-label"><LayoutGrid size={17} /><span>多开工作区</span><small>{panes.length} 个窗口</small></div>
      <div className="layout-switcher" role="group" aria-label="工作区布局">
        {layouts.map((item) => {
          const LayoutIcon = item.icon
          return <button key={item.id} className={layout === item.id ? "active" : ""} onClick={() => applyLayout(item.id)} aria-pressed={layout === item.id} title={item.name}>
            <LayoutIcon size={16} /><span>{item.name}</span>
          </button>
        })}
      </div>
    </div>
    <div className={`multi-workspace layout-${layout}`}>
      {panes.map((pane, index) => {
        const paneTool = findTool(pane.toolId) ?? tool
        const PaneTool = paneTool.component
        return <section className="workspace-pane" key={pane.key}>
          <div className="pane-header">
            <span className="pane-number">窗口 {index + 1}</span>
            <label>
              <span className={`pane-tool-dot ${paneTool.accent}`} />
              <select value={paneTool.id} onChange={(event) => changePaneTool(pane.key, event.target.value)} aria-label={`窗口 ${index + 1} 的工具`}>
                {tools.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}
              </select>
            </label>
          </div>
          <div className="workspace-card"><PaneTool key={paneTool.id} /></div>
        </section>
      })}
    </div>
    <div className="tool-privacy"><LockKeyhole size={15} />所有处理均在本地完成，你的内容不会离开此设备。</div>
  </div>
}
