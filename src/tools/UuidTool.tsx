import { useState } from "react"
import { Check, Copy, RefreshCw } from "lucide-react"
import { Button } from "../components/ui"
import { copyText } from "../lib/utils"

const create = (count: number) => Array.from({ length: count }, () => crypto.randomUUID())

export default function UuidTool() {
  const [count, setCount] = useState(5)
  const [values, setValues] = useState(() => create(5))
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    await copyText(values.join("\n")); setCopied(true); window.setTimeout(() => setCopied(false), 1400)
  }
  return <div className="uuid-layout">
    <div className="option-row">
      <label>生成数量</label>
      {[1, 5, 10, 20].map((item) => <button key={item} className={count === item ? "choice active" : "choice"} onClick={() => setCount(item)}>{item}</button>)}
      <Button onClick={() => setValues(create(count))}><RefreshCw size={16} />重新生成</Button>
    </div>
    <div className="result-list">
      <div className="editor-head"><span>UUID v4</span><button className="icon-text" onClick={copy}>{copied ? <Check size={14} /> : <Copy size={14} />}{copied ? "已复制" : "复制全部"}</button></div>
      {values.map((value, index) => <code key={`${value}-${index}`}>{value}</code>)}
    </div>
  </div>
}
