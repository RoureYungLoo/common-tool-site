import { useState } from "react"
import { Button, EditorPanel, Status, ToolWorkspace } from "../components/ui"

const sample = '{"name":"禄若阳的工具站","private":true,"tools":["JSON","Base64","UUID"]}'

export default function JsonTool() {
  const [input, setInput] = useState(sample)
  const [output, setOutput] = useState("")
  const [error, setError] = useState("")
  const transform = (compact = false) => {
    try {
      setOutput(JSON.stringify(JSON.parse(input), null, compact ? 0 : 2))
      setError("")
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "JSON 格式不正确")
    }
  }
  return <>
    <ToolWorkspace>
      <EditorPanel label="输入" value={input} onChange={setInput} placeholder="粘贴 JSON…" language="json" />
      <EditorPanel label="输出" value={output} readOnly placeholder="处理结果会显示在这里" language="json" />
    </ToolWorkspace>
    <div className="tool-controls">
      <Button onClick={() => transform(false)}>格式化</Button>
      <Button className="button-secondary" onClick={() => transform(true)}>压缩</Button>
      {error ? <Status error>{error}</Status> : output ? <Status>JSON 有效</Status> : null}
    </div>
  </>
}
