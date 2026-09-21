import { useMemo, useState } from "react"
import { Status } from "../components/ui"

const fieldNames = ["分钟", "小时", "日期", "月份", "星期"]
const ranges = [[0, 59], [0, 23], [1, 31], [1, 12], [0, 7]]

function describePart(value: string, name: string) {
  if (value === "*") return `每${name}`
  if (/^\*\/\d+$/.test(value)) return `每 ${value.slice(2)} ${name}`
  if (/^\d+(,\d+)+$/.test(value)) return `${name}为 ${value.split(",").join("、")}`
  if (/^\d+-\d+$/.test(value)) return `${name}从 ${value.replace("-", " 到 ")}`
  return `${name}为 ${value}`
}

export default function CronTool() {
  const [input, setInput] = useState("*/15 9-18 * * 1-5")
  const result = useMemo(() => {
    const fields = input.trim().split(/\s+/)
    if (fields.length !== 5) return { error: "请输入标准的 5 段 Cron 表达式", fields: [] as string[] }
    const invalid = fields.findIndex((field, index) => !/^[\d*/,-]+$/.test(field) || (/^\d+$/.test(field) && (Number(field) < ranges[index][0] || Number(field) > ranges[index][1])))
    if (invalid >= 0) return { error: `${fieldNames[invalid]}字段格式或范围不正确`, fields: [] as string[] }
    return { error: "", fields: fields.map((field, index) => describePart(field, fieldNames[index])) }
  }, [input])
  return <div className="cron-layout"><label className="block-field"><span>Cron 表达式</span><input className="text-input mono" value={input} onChange={(event) => setInput(event.target.value)} placeholder="*/15 9-18 * * 1-5" /></label><div className="cron-fields">{fieldNames.map((name, index) => <div key={name}><span>{name}</span><code>{input.trim().split(/\s+/)[index] ?? "—"}</code><small>{result.fields[index] ?? "等待有效输入"}</small></div>)}</div><div className="tool-controls">{result.error ? <Status error>{result.error}</Status> : <Status>表达式包含 5 个有效字段</Status>}</div></div>
}
