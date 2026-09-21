import { useMemo, useState } from "react"
import { Status } from "../components/ui"

const bases = [{ value: 2, label: "二进制" }, { value: 8, label: "八进制" }, { value: 10, label: "十进制" }, { value: 16, label: "十六进制" }]

export default function BaseConverterTool() {
  const [input, setInput] = useState("2026")
  const [base, setBase] = useState(10)
  const parsed = useMemo(() => {
    const normalized = input.trim().replace(/^0[xob]/i, "")
    const patterns: Record<number, RegExp> = { 2: /^-?[01]+$/, 8: /^-?[0-7]+$/, 10: /^-?\d+$/, 16: /^-?[0-9a-f]+$/i }
    if (!patterns[base].test(normalized)) return null
    const value = Number.parseInt(normalized, base)
    return Number.isNaN(value) ? null : value
  }, [input, base])

  return <div className="converter-layout">
    <div className="field-row">
      <label className="field-grow"><span>输入数值</span><input className="text-input mono" value={input} onChange={(event) => setInput(event.target.value)} /></label>
      <label><span>输入进制</span><select className="select-input" value={base} onChange={(event) => setBase(Number(event.target.value))}>{bases.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
    </div>
    <div className="value-card-grid">{bases.map((item) => <div key={item.value}><span>{item.label}</span><code>{parsed === null ? "—" : parsed.toString(item.value).toUpperCase()}</code><small>Base {item.value}</small></div>)}</div>
    <div className="tool-controls"><Status error={parsed === null}>{parsed === null ? "请输入当前进制下的有效数字" : "转换结果已实时更新"}</Status></div>
  </div>
}
