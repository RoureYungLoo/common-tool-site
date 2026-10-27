import { useEffect, useState } from "react"
import { EditorPanel, Status, ToolWorkspace } from "../components/ui"

export default function RegexTool() {
  const [pattern, setPattern] = useState("(\\w+)@(\\w+\\.\\w+)")
  const [text, setText] = useState("联系 alice@example.com 或 bob@tool.dev 获取帮助。")
  const [flags, setFlags] = useState("gi")
  const [result, setResult] = useState({ error: "", output: "正在匹配…", count: 0, running: true })
  useEffect(() => {
    setResult((current) => ({ ...current, error: "", running: true }))
    let worker: Worker | null = null
    const start = window.setTimeout(() => {
      worker = new Worker(new URL("./regex.worker.ts", import.meta.url), { type: "module" })
      const timeout = window.setTimeout(() => {
        worker?.terminate()
        worker = null
        setResult({ error: "表达式执行时间过长，已安全终止", output: "", count: 0, running: false })
      }, 500)
      worker.onmessage = (event) => {
        window.clearTimeout(timeout)
        setResult({ ...event.data, running: false })
        worker?.terminate()
        worker = null
      }
      worker.onerror = () => {
        window.clearTimeout(timeout)
        setResult({ error: "正则匹配线程运行失败", output: "", count: 0, running: false })
        worker?.terminate()
        worker = null
      }
      worker.postMessage({ pattern, text, flags })
    }, 160)
    return () => {
      window.clearTimeout(start)
      worker?.terminate()
    }
  }, [pattern, text, flags])

  const toggleFlag = (flag: string) => setFlags((current) => current.includes(flag) ? current.replace(flag, "") : `${current}${flag}`)

  return <>
    <div className="field-row regex-bar">
      <label className="field-grow"><span>表达式</span><input className="text-input mono" value={pattern} onChange={(event) => setPattern(event.target.value)} /></label>
      <div className="flag-group"><span>标志</span>{["g", "i", "m", "s"].map((flag) => <button key={flag} className={flags.includes(flag) ? "choice active" : "choice"} onClick={() => toggleFlag(flag)}>{flag}</button>)}</div>
    </div>
    <ToolWorkspace>
      <EditorPanel label="测试文本" value={text} onChange={setText} placeholder="输入需要匹配的文本…" />
      <EditorPanel label={`匹配结果 · ${result.count}`} value={result.output} readOnly />
    </ToolWorkspace>
    <div className="tool-controls">{result.error ? <Status error>{result.error}</Status> : <Status>{result.running ? "正在安全线程中匹配…" : "实时匹配完成"}</Status>}</div>
  </>
}
