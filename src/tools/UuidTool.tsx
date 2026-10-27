import { useState } from "react"
import { Check, Copy, RefreshCw } from "lucide-react"
import { Button } from "../components/ui"
import { copyText } from "../lib/utils"

const create = (count: number) => Array.from({ length: count }, () => crypto.randomUUID())

export default function UuidTool() {
  const [count, setCount] = useState(5)
  const [values, setValues] = useState(() => create(5))
  const [copied, setCopied] = useState(false)
  const [copyError, setCopyError] = useState(false)
  const copy = async () => {
    try {
      await copyText(values.join("\n")); setCopyError(false); setCopied(true); window.setTimeout(() => setCopied(false), 1400)
    } catch { setCopyError(true) }
  }
  return <div className="uuid-layout">
    <div className="option-row">
      <label>生成数量</label>
      {[1, 5, 10, 20].map((item) => <button key={item} className={count === item ? "choice active" : "choice"} onClick={() => setCount(item)}>{item}</button>)}
      <Button onClick={() => setValues(create(count))}><RefreshCw size={16} />重新生成</Button>
    </div>
    <div className="result-list">
      <div className="flex min-h-11 items-center justify-between border-b border-app-line bg-app-soft/70 pr-2 pl-3"><span className="text-[13px] font-bold text-app-muted">UUID v4</span><button type="button" className="inline-flex min-h-11 items-center gap-1.5 bg-transparent px-2 text-sm text-app-muted hover:text-app-text focus-visible:outline-2 focus-visible:outline-app-brand-deep" onClick={copy}>{copied ? <Check size={14} /> : <Copy size={14} />}{copyError ? "复制失败" : copied ? "已复制" : "复制全部"}</button></div>
      {values.map((value, index) => <code key={`${value}-${index}`}>{value}</code>)}
    </div>
  </div>
}
