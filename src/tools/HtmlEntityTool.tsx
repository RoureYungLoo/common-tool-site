import { useState } from "react"
import { Button, EditorPanel, Status, ToolWorkspace } from "../components/ui"

const encode = (value: string) => {
  const element = document.createElement("div")
  element.textContent = value
  return element.innerHTML
}

const decode = (value: string) => {
  const element = document.createElement("textarea")
  element.innerHTML = value
  return element.value
}

export default function HtmlEntityTool() {
  const [input, setInput] = useState('<section class="tool">禄若阳 & Tools</section>')
  const [output, setOutput] = useState("")
  return <>
    <ToolWorkspace>
      <EditorPanel label="输入内容" value={input} onChange={setInput} placeholder="输入 HTML 或实体内容…" />
      <EditorPanel label="转换结果" value={output} readOnly placeholder="结果会显示在这里" />
    </ToolWorkspace>
    <div className="tool-controls"><Button onClick={() => setOutput(encode(input))}>编码实体</Button><Button className="button-secondary" onClick={() => setOutput(decode(input))}>解码实体</Button><Status>支持命名实体与数字实体</Status></div>
  </>
}
