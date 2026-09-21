import { useState } from "react"
import { Button, EditorPanel, Status } from "../components/ui"

type Algorithm = "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512"

export default function HashTool() {
  const [input, setInput] = useState("Common tools, made simple.")
  const [output, setOutput] = useState("")
  const [algorithm, setAlgorithm] = useState<Algorithm>("SHA-256")
  const run = async () => {
    const digest = await crypto.subtle.digest(algorithm, new TextEncoder().encode(input))
    setOutput(Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join(""))
  }
  return <>
    <div className="hash-options">
      {(["SHA-1", "SHA-256", "SHA-384", "SHA-512"] as Algorithm[]).map((item) => <button key={item} className={algorithm === item ? "choice active" : "choice"} onClick={() => setAlgorithm(item)}>{item}</button>)}
    </div>
    <div className="tool-workspace single-row">
      <EditorPanel label="输入文本" value={input} onChange={setInput} placeholder="输入需要计算哈希的文本…" />
      <EditorPanel label={`${algorithm} 摘要`} value={output} readOnly placeholder="计算结果会显示在这里" />
    </div>
    <div className="tool-controls"><Button onClick={run}>计算摘要</Button><Status>内容仅在当前浏览器中处理</Status></div>
  </>
}
