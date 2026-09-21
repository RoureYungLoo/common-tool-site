import { useState } from "react"
import { Button, EditorPanel, Status, ToolWorkspace } from "../components/ui"
import { decodeBase64, encodeBase64 } from "../lib/utils"

export default function Base64Tool() {
  const [input, setInput] = useState("你好，世界 👋")
  const [output, setOutput] = useState("")
  const [error, setError] = useState("")
  const run = (mode: "encode" | "decode") => {
    try {
      setOutput(mode === "encode" ? encodeBase64(input) : decodeBase64(input))
      setError("")
    } catch { setError("输入不是有效的 Base64 内容") }
  }
  return <>
    <ToolWorkspace>
      <EditorPanel label="原始内容" value={input} onChange={setInput} placeholder="输入文本或 Base64…" />
      <EditorPanel label="转换结果" value={output} readOnly placeholder="结果会显示在这里" />
    </ToolWorkspace>
    <div className="tool-controls"><Button onClick={() => run("encode")}>编码</Button><Button className="button-secondary" onClick={() => run("decode")}>解码</Button>{error && <Status error>{error}</Status>}</div>
  </>
}
