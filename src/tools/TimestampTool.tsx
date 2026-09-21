import { useMemo, useState } from "react"
import { Button } from "../components/ui"

const currentSeconds = () => Math.floor(Date.now() / 1000).toString()

export default function TimestampTool() {
  const [timestamp, setTimestamp] = useState(currentSeconds)
  const milliseconds = timestamp.length > 10 ? Number(timestamp) : Number(timestamp) * 1000
  const date = useMemo(() => new Date(milliseconds), [milliseconds])
  const valid = !Number.isNaN(date.getTime())
  return <div className="timestamp-layout">
    <div className="timestamp-input">
      <label htmlFor="timestamp">Unix 时间戳</label>
      <div className="inline-input"><input id="timestamp" value={timestamp} onChange={(e) => setTimestamp(e.target.value.replace(/[^0-9-]/g, ""))} /><Button onClick={() => setTimestamp(currentSeconds())}>现在</Button></div>
      <p>自动识别秒（10 位）与毫秒（13 位）</p>
    </div>
    <div className="time-cards">
      <div><span>本地时间</span><strong>{valid ? date.toLocaleString("zh-CN", { hour12: false }) : "无效时间"}</strong></div>
      <div><span>ISO 8601</span><strong>{valid ? date.toISOString() : "—"}</strong></div>
      <div><span>相对现在</span><strong>{valid ? `${Math.round((date.getTime() - Date.now()) / 1000)} 秒` : "—"}</strong></div>
    </div>
  </div>
}
