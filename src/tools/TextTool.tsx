import { useMemo, useState } from "react"
import { Button, EditorPanel, ToolWorkspace } from "../components/ui"

export default function TextTool() {
  const [input, setInput] = useState("Make everyday work a little lighter.")
  const [output, setOutput] = useState("")
  const stats = useMemo(() => ({ chars: input.length, words: input.trim() ? input.trim().split(/\s+/).length : 0, lines: input ? input.split(/\r?\n/).length : 0 }), [input])
  return <>
    <div className="stat-strip"><span><b>{stats.chars}</b> 字符</span><span><b>{stats.words}</b> 单词</span><span><b>{stats.lines}</b> 行</span></div>
    <ToolWorkspace>
      <EditorPanel label="输入文本" value={input} onChange={setInput} placeholder="输入文本…" />
      <EditorPanel label="转换结果" value={output} readOnly placeholder="选择下方转换方式" />
    </ToolWorkspace>
    <div className="tool-controls">
      <Button onClick={() => setOutput(input.toUpperCase())}>大写</Button>
      <Button className="button-secondary" onClick={() => setOutput(input.toLowerCase())}>小写</Button>
      <Button className="button-secondary" onClick={() => setOutput(input.trim().replace(/\s+/g, " "))}>合并空白</Button>
      <Button className="button-secondary" onClick={() => setOutput(input.split("").reverse().join(""))}>反转</Button>
    </div>
  </>
}
