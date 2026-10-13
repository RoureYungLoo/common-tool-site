import { Check, Clock3, Copy, RefreshCw } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { Button, Status } from "../components/ui"
import { copyText } from "../lib/utils"

type TimestampUnit = "auto" | "seconds" | "milliseconds"

const commonTimezones = [
  "Asia/Shanghai",
  "UTC",
  "Asia/Tokyo",
  "Asia/Singapore",
  "Europe/London",
  "America/New_York",
  "America/Los_Angeles",
]

function toDateTimeLocal(date: Date) {
  const offset = date.getTimezoneOffset() * 60_000
  return new Date(date.getTime() - offset).toISOString().slice(0, 19)
}

function parseTimestamp(value: string, unit: TimestampUnit) {
  const trimmed = value.trim()
  if (!trimmed) return null
  const numeric = Number(trimmed)
  if (!Number.isFinite(numeric)) return null
  const detectedUnit = unit === "auto" ? Math.abs(numeric) >= 100_000_000_000 ? "milliseconds" : "seconds" : unit
  const milliseconds = detectedUnit === "seconds" ? numeric * 1000 : numeric
  const date = new Date(milliseconds)
  if (Number.isNaN(date.getTime())) return null
  return { date, milliseconds, detectedUnit }
}

function formatInTimezone(date: Date, timeZone: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).format(date)
}

function formatRelative(target: number, now: number) {
  const seconds = Math.round((target - now) / 1000)
  const absolute = Math.abs(seconds)
  if (absolute < 5) return "现在"
  const suffix = seconds > 0 ? "后" : "前"
  if (absolute < 60) return `${absolute} 秒${suffix}`
  if (absolute < 3600) return `${Math.round(absolute / 60)} 分钟${suffix}`
  if (absolute < 86_400) return `${Math.round(absolute / 3600)} 小时${suffix}`
  if (absolute < 2_592_000) return `${Math.round(absolute / 86_400)} 天${suffix}`
  if (absolute < 31_536_000) return `${Math.round(absolute / 2_592_000)} 个月${suffix}`
  return `${Math.round(absolute / 31_536_000)} 年${suffix}`
}

export default function TimestampTool() {
  const localTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Shanghai"
  const timezoneOptions = [localTimezone, ...commonTimezones.filter((item) => item !== localTimezone)]
  const [now, setNow] = useState(Date.now())
  const [timestamp, setTimestamp] = useState(() => Math.floor(Date.now() / 1000).toString())
  const [unit, setUnit] = useState<TimestampUnit>("auto")
  const [timezone, setTimezone] = useState(localTimezone)
  const [dateInput, setDateInput] = useState(() => toDateTimeLocal(new Date()))
  const [copied, setCopied] = useState("")

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  const parsed = useMemo(() => parseTimestamp(timestamp, unit), [timestamp, unit])
  const inputDate = useMemo(() => {
    if (!dateInput) return null
    const date = new Date(dateInput)
    return Number.isNaN(date.getTime()) ? null : date
  }, [dateInput])

  const copy = async (key: string, value: string) => {
    await copyText(value)
    setCopied(key)
    window.setTimeout(() => setCopied((current) => current === key ? "" : current), 1400)
  }

  const useTimestamp = (milliseconds: number, preferredUnit: Exclude<TimestampUnit, "auto"> = "seconds") => {
    setTimestamp(preferredUnit === "seconds" ? Math.floor(milliseconds / 1000).toString() : Math.floor(milliseconds).toString())
    setUnit(preferredUnit)
  }

  const setTodayBoundary = (end = false) => {
    const date = new Date()
    if (end) date.setHours(23, 59, 59, 999)
    else date.setHours(0, 0, 0, 0)
    useTimestamp(date.getTime())
  }

  const outputCard = (key: string, label: string, value: string) => <button type="button" className="timestamp-output-card" onClick={() => copy(key, value)} title="点击复制">
    <span>{label}</span>
    <strong>{value}</strong>
    <small>{copied === key ? <><Check size={12} />已复制</> : <><Copy size={12} />复制</>}</small>
  </button>

  const inputMilliseconds = inputDate?.getTime()

  return <div className="timestamp-tool">
    <section className="timestamp-live">
      <div className="timestamp-section-head">
        <div><span className="timestamp-live-dot" />当前时间</div>
        <strong>{formatInTimezone(new Date(now), timezone)}</strong>
      </div>
      <div className="timestamp-live-values">
        <button onClick={() => copy("now-seconds", Math.floor(now / 1000).toString())}><span>Unix 秒</span><strong>{Math.floor(now / 1000)}</strong>{copied === "now-seconds" ? <Check size={14} /> : <Copy size={14} />}</button>
        <button onClick={() => copy("now-milliseconds", now.toString())}><span>Unix 毫秒</span><strong>{now}</strong>{copied === "now-milliseconds" ? <Check size={14} /> : <Copy size={14} />}</button>
      </div>
    </section>

    <div className="timestamp-toolbar">
      <label><span>显示时区</span><select className="select-input" value={timezone} onChange={(event) => setTimezone(event.target.value)}>
        {timezoneOptions.map((item) => <option key={item} value={item}>{item === localTimezone ? `${item}（本地）` : item}</option>)}
      </select></label>
      <Status><Clock3 size={13} />日期输入按浏览器本地时区解析</Status>
    </div>

    <div className="timestamp-converters">
      <section className="timestamp-panel">
        <div className="timestamp-panel-title"><div><b>时间戳 → 日期时间</b><span>支持负数和小数</span></div><Button className="button-secondary" onClick={() => { setTimestamp(Math.floor(Date.now() / 1000).toString()); setUnit("auto") }}><RefreshCw size={14} />现在</Button></div>
        <div className="timestamp-input-row">
          <input className="text-input mono" value={timestamp} onChange={(event) => setTimestamp(event.target.value)} inputMode="decimal" placeholder="例如 1704067200" />
          <select className="select-input" value={unit} onChange={(event) => setUnit(event.target.value as TimestampUnit)}>
            <option value="auto">自动识别</option>
            <option value="seconds">秒</option>
            <option value="milliseconds">毫秒</option>
          </select>
        </div>
        <div className="timestamp-quick-actions">
          <button onClick={() => setTodayBoundary(false)}>今天 00:00</button>
          <button onClick={() => setTodayBoundary(true)}>今天 23:59:59</button>
          <button onClick={() => useTimestamp((parsed?.milliseconds ?? Date.now()) - 86_400_000)}>−1 天</button>
          <button onClick={() => useTimestamp((parsed?.milliseconds ?? Date.now()) + 3_600_000)}>+1 小时</button>
          <button onClick={() => useTimestamp((parsed?.milliseconds ?? Date.now()) + 86_400_000)}>+1 天</button>
        </div>
        {parsed ? <Status>识别为{parsed.detectedUnit === "seconds" ? "秒" : "毫秒"}级时间戳</Status> : <Status error>请输入有效的 Unix 时间戳</Status>}
      </section>

      <section className="timestamp-panel">
        <div className="timestamp-panel-title"><div><b>日期时间 → 时间戳</b><span>精确到秒</span></div>{parsed && <Button className="button-secondary" onClick={() => setDateInput(toDateTimeLocal(parsed.date))}>载入左侧</Button>}</div>
        <input className="text-input timestamp-date-input" type="datetime-local" step="1" value={dateInput} onChange={(event) => setDateInput(event.target.value)} />
        <div className="timestamp-date-results">
          <button disabled={!inputDate} onClick={() => inputDate && copy("input-seconds", Math.floor(inputDate.getTime() / 1000).toString())}><span>秒</span><strong>{inputDate ? Math.floor(inputDate.getTime() / 1000) : "—"}</strong>{copied === "input-seconds" ? <Check size={13} /> : <Copy size={13} />}</button>
          <button disabled={!inputDate} onClick={() => inputDate && copy("input-milliseconds", inputDate.getTime().toString())}><span>毫秒</span><strong>{inputDate?.getTime() ?? "—"}</strong>{copied === "input-milliseconds" ? <Check size={13} /> : <Copy size={13} />}</button>
        </div>
        <div className="timestamp-quick-actions">
          <button onClick={() => setDateInput(toDateTimeLocal(new Date()))}>当前时间</button>
          <button disabled={!inputDate} onClick={() => inputMilliseconds !== undefined && useTimestamp(inputMilliseconds)}>发送到左侧</button>
        </div>
      </section>
    </div>

    <section className="timestamp-results">
      <div className="timestamp-results-title"><b>转换结果</b><span>点击任意结果即可复制</span></div>
      {parsed ? <div className="timestamp-output-grid">
        {outputCard("selected-timezone", timezone, formatInTimezone(parsed.date, timezone))}
        {outputCard("iso", "ISO 8601", parsed.date.toISOString())}
        {outputCard("utc", "UTC", parsed.date.toUTCString())}
        {outputCard("unix-seconds", "Unix 秒", Math.floor(parsed.milliseconds / 1000).toString())}
        {outputCard("unix-milliseconds", "Unix 毫秒", Math.floor(parsed.milliseconds).toString())}
        {outputCard("relative", "相对现在", formatRelative(parsed.milliseconds, now))}
      </div> : <div className="timestamp-empty">输入有效时间戳后显示转换结果</div>}
    </section>
  </div>
}
