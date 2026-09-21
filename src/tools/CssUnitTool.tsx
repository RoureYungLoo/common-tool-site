import { useMemo, useState } from "react"
import { Status } from "../components/ui"

export default function CssUnitTool() {
  const [pixels, setPixels] = useState("24")
  const [rootSize, setRootSize] = useState("16")
  const [viewport, setViewport] = useState("1440")
  const values = useMemo(() => {
    const px = Number(pixels), root = Number(rootSize), width = Number(viewport)
    if (![px, root, width].every(Number.isFinite) || root <= 0 || width <= 0) return null
    const format = (value: number) => Number(value.toFixed(6)).toString()
    return [{ label: "像素", value: `${format(px)}px` }, { label: "REM", value: `${format(px / root)}rem` }, { label: "EM", value: `${format(px / root)}em` }, { label: "视口宽度", value: `${format(px / width * 100)}vw` }]
  }, [pixels, rootSize, viewport])
  return <div className="css-unit-layout"><div className="field-row"><label className="field-grow"><span>像素值</span><input className="text-input mono" value={pixels} onChange={(event) => setPixels(event.target.value)} /></label><label><span>根字号</span><input className="text-input mono short-input" value={rootSize} onChange={(event) => setRootSize(event.target.value)} /></label><label><span>视口宽度</span><input className="text-input mono short-input" value={viewport} onChange={(event) => setViewport(event.target.value)} /></label></div><div className="value-card-grid">{(values ?? [{ label: "像素", value: "—" }, { label: "REM", value: "—" }, { label: "EM", value: "—" }, { label: "视口宽度", value: "—" }]).map((item) => <div key={item.label}><span>{item.label}</span><code>{item.value}</code></div>)}</div><div className="tool-controls"><Status error={!values}>{values ? "单位结果实时更新" : "请输入有效的正数配置"}</Status></div></div>
}
