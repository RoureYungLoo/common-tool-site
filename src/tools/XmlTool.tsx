import { useState } from "react"
import { Button, EditorPanel, Status, ToolWorkspace } from "../components/ui"

function parseXml(value: string) {
  const document = new DOMParser().parseFromString(value, "application/xml")
  const error = document.querySelector("parsererror")
  if (error) throw new Error(error.textContent?.split("\n")[0] || "XML 格式不正确")
  return new XMLSerializer().serializeToString(document)
}

function prettyXml(value: string) {
  const serialized = parseXml(value).replace(/>\s*</g, "><").replace(/(>)(<)(\/*)/g, "$1\n$2$3")
  let depth = 0
  return serialized.split("\n").map((line) => {
    if (/^<\//.test(line)) depth = Math.max(0, depth - 1)
    const result = `${"  ".repeat(depth)}${line}`
    if (/^<[^!?/][^>]*[^/]?>$/.test(line) && !/<\/[^>]+>$/.test(line)) depth++
    return result
  }).join("\n")
}

export default function XmlTool() {
  const [input, setInput] = useState('<tools><tool id="1"><name>JSON</name><local>true</local></tool></tools>')
  const [output, setOutput] = useState("")
  const [error, setError] = useState("")
  const run = (compact: boolean) => {
    try { setOutput(compact ? parseXml(input) : prettyXml(input)); setError("") }
    catch (reason) { setError(reason instanceof Error ? reason.message : "XML 格式不正确") }
  }
  return <><ToolWorkspace><EditorPanel label="XML 输入" value={input} onChange={setInput} /><EditorPanel label="处理结果" value={output} readOnly /></ToolWorkspace><div className="tool-controls"><Button onClick={() => run(false)}>格式化</Button><Button className="button-secondary" onClick={() => run(true)}>压缩</Button>{error ? <Status error>{error}</Status> : output && <Status>XML 有效</Status>}</div></>
}
