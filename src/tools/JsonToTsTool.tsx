import { useState } from "react"
import { Button, EditorPanel, Status, ToolWorkspace } from "../components/ui"

const typeName = (value: string) => value.replace(/[^a-zA-Z0-9_$]/g, " ").replace(/(^\w|\s\w)/g, (text) => text.trim().toUpperCase()) || "Generated"
const propertyName = (value: string) => /^[a-zA-Z_$][\w$]*$/.test(value) ? value : JSON.stringify(value)

function generateTypes(value: unknown, rootName: string) {
  const declarations: string[] = []
  const infer = (current: unknown, name: string): string => {
    if (current === null) return "null"
    if (Array.isArray(current)) {
      if (!current.length) return "unknown[]"
      const variants = [...new Set(current.slice(0, 20).map((item) => infer(item, `${name}Item`)))]
      return `(${variants.join(" | ")})[]`
    }
    if (typeof current === "object") {
      const interfaceName = typeName(name)
      const fields = Object.entries(current as Record<string, unknown>).map(([key, item]) => `  ${propertyName(key)}: ${infer(item, key)};`)
      declarations.push(`export interface ${interfaceName} {\n${fields.join("\n")}\n}`)
      return interfaceName
    }
    return typeof current
  }
  const rootType = infer(value, rootName)
  if (typeof value !== "object" || value === null || Array.isArray(value)) declarations.push(`export type ${typeName(rootName)} = ${rootType};`)
  return declarations.reverse().join("\n\n")
}

export default function JsonToTsTool() {
  const [input, setInput] = useState('{"id":1,"name":"工具站","active":true,"tags":["json","typescript"],"owner":{"name":"禄若阳"}}')
  const [output, setOutput] = useState("")
  const [error, setError] = useState("")
  const convert = () => {
    try { setOutput(generateTypes(JSON.parse(input), "Root")); setError("") }
    catch (reason) { setError(reason instanceof Error ? reason.message : "JSON 格式不正确") }
  }
  return <>
    <ToolWorkspace><EditorPanel label="JSON 输入" value={input} onChange={setInput} /><EditorPanel label="TypeScript 类型" value={output} readOnly placeholder="生成的类型会显示在这里" /></ToolWorkspace>
    <div className="tool-controls"><Button onClick={convert}>生成类型</Button>{error ? <Status error>{error}</Status> : output && <Status>类型生成完成</Status>}</div>
  </>
}
