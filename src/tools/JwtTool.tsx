import { useState } from "react"
import { EditorPanel, Status, ToolWorkspace } from "../components/ui"
import { base64UrlDecode } from "../lib/utils"

const sample = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IuW8oOS4iSIsImlhdCI6MTUxNjIzOTAyMn0.signature"

export default function JwtTool() {
  const [input, setInput] = useState(sample)
  let output = "", error = ""
  try {
    const [header, payload] = input.split(".")
    if (!header || !payload) throw new Error()
    output = `HEADER\n${JSON.stringify(JSON.parse(base64UrlDecode(header)), null, 2)}\n\nPAYLOAD\n${JSON.stringify(JSON.parse(base64UrlDecode(payload)), null, 2)}`
  } catch { error = "请输入结构正确的 JWT" }
  return <>
    <ToolWorkspace>
      <EditorPanel label="JWT" value={input} onChange={setInput} placeholder="粘贴 JWT…" />
      <EditorPanel label="解析结果" value={output} readOnly placeholder="Header 与 Payload 会显示在这里" />
    </ToolWorkspace>
    <div className="tool-controls">{error ? <Status error>{error}</Status> : <Status>仅解析内容，不验证签名</Status>}</div>
  </>
}
