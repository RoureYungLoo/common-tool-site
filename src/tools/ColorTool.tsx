import { useMemo, useState } from "react"
import { EditorPanel, Status } from "../components/ui"

function parseHex(value: string) {
  let hex = value.trim().replace(/^#/, "")
  if (hex.length === 3) hex = hex.split("").map((char) => char + char).join("")
  if (!/^[0-9a-f]{6}$/i.test(hex)) return null
  return { r: Number.parseInt(hex.slice(0, 2), 16), g: Number.parseInt(hex.slice(2, 4), 16), b: Number.parseInt(hex.slice(4, 6), 16), hex: `#${hex.toUpperCase()}` }
}

function toHsl(r: number, g: number, b: number) {
  const [red, green, blue] = [r / 255, g / 255, b / 255]
  const max = Math.max(red, green, blue), min = Math.min(red, green, blue)
  let h = 0, s = 0
  const l = (max + min) / 2
  if (max !== min) {
    const delta = max - min
    s = l > .5 ? delta / (2 - max - min) : delta / (max + min)
    if (max === red) h = (green - blue) / delta + (green < blue ? 6 : 0)
    else if (max === green) h = (blue - red) / delta + 2
    else h = (red - green) / delta + 4
    h /= 6
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}

export default function ColorTool() {
  const [value, setValue] = useState("#B7EF45")
  const color = useMemo(() => parseHex(value), [value])
  const output = color ? (() => { const hsl = toHsl(color.r, color.g, color.b); return `${color.hex}\nrgb(${color.r}, ${color.g}, ${color.b})\nhsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` })() : ""
  return <div className="color-layout">
    <div className="color-picker-card">
      <div className="color-preview" style={{ background: color?.hex ?? "transparent" }}><input type="color" value={color?.hex ?? "#000000"} onChange={(event) => setValue(event.target.value)} aria-label="选择颜色" /></div>
      <label><span>HEX 颜色</span><input className="text-input mono" value={value} onChange={(event) => setValue(event.target.value)} placeholder="#B7EF45" /></label>
      <small>点击色块选择颜色，或直接输入 3/6 位十六进制颜色。</small>
    </div>
    <EditorPanel label="颜色格式" value={output} readOnly placeholder="输入有效颜色后显示结果" />
    <div className="tool-controls">{color ? <Status>颜色格式有效</Status> : <Status error>请输入有效的 HEX 颜色</Status>}</div>
  </div>
}
