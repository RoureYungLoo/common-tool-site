import { useState } from "react"
import { Button, EditorPanel, Status, ToolWorkspace } from "../components/ui"

export default function UrlTool() {
  const [input, setInput] = useState("https://example.com/搜索?q=常用工具")
  const [output, setOutput] = useState("")
  const [error, setError] = useState("")
  const run = (decode: boolean) => {
    try { setOutput(decode ? decodeURIComponent(input) : encodeURIComponent(input)); setError("") }
    catch { setError("内容包含无效的 URL 编码序列") }
  }
  return <>
    <ToolWorkspace>
      <EditorPanel label="输入" value={input} onChange={setInput} placeholder="输入 URL 或编码内容…" />
      <EditorPanel label="输出" value={output} readOnly placeholder="结果会显示在这里" />
    </ToolWorkspace>
    <div className="tool-controls"><Button onClick={() => run(false)}>编码</Button><Button className="button-secondary" onClick={() => run(true)}>解码</Button>{error && <Status error>{error}</Status>}</div>
  </>
}
