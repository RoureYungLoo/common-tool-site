import { useState } from "react"
import { Button, EditorPanel, ToolWorkspace } from "../components/ui"

export default function ListTool() {
  const [input, setInput] = useState("orange\napple\nbanana\napple\n\ngrape")
  const [output, setOutput] = useState("")
  const lines = () => input.split(/\r?\n/)
  return <><ToolWorkspace><EditorPanel label={`输入列表 · ${lines().length} 行`} value={input} onChange={setInput} /><EditorPanel label="处理结果" value={output} readOnly /></ToolWorkspace><div className="tool-controls"><Button onClick={() => setOutput([...lines()].sort((a, b) => a.localeCompare(b, "zh-CN")).join("\n"))}>升序</Button><Button className="button-secondary" onClick={() => setOutput([...lines()].sort((a, b) => b.localeCompare(a, "zh-CN")).join("\n"))}>降序</Button><Button className="button-secondary" onClick={() => setOutput([...new Set(lines())].join("\n"))}>去重</Button><Button className="button-secondary" onClick={() => setOutput(lines().filter((line) => line.trim()).join("\n"))}>删除空行</Button><Button className="button-secondary" onClick={() => setOutput(lines().reverse().join("\n"))}>反转</Button></div></>
}
