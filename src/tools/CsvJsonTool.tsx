import { useState } from "react"
import { Button, EditorPanel, Status, ToolWorkspace } from "../components/ui"

function parseCsv(input: string) {
  const rows: string[][] = [[]]
  let value = "", quoted = false
  for (let i = 0; i < input.length; i++) {
    const char = input[i]
    if (char === '"' && quoted && input[i + 1] === '"') { value += '"'; i++ }
    else if (char === '"') quoted = !quoted
    else if (char === "," && !quoted) { rows.at(-1)!.push(value); value = "" }
    else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && input[i + 1] === "\n") i++
      rows.at(-1)!.push(value); value = ""; rows.push([])
    } else value += char
  }
  rows.at(-1)!.push(value)
  if (rows.at(-1)!.length === 1 && rows.at(-1)![0] === "") rows.pop()
  const [headers = [], ...data] = rows
  return data.map((row) => Object.fromEntries(headers.map((header, index) => [header.trim(), row[index] ?? ""])))
}

const escapeCell = (value: unknown) => {
  const text = value == null ? "" : String(value)
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

function jsonToCsv(input: string) {
  const data = JSON.parse(input)
  if (!Array.isArray(data) || !data.every((item) => item && typeof item === "object" && !Array.isArray(item))) throw new Error("请输入对象数组形式的 JSON")
  const headers = [...new Set(data.flatMap((item) => Object.keys(item)))]
  return [headers.map(escapeCell).join(","), ...data.map((item) => headers.map((header) => escapeCell(item[header])).join(","))].join("\n")
}

export default function CsvJsonTool() {
  const [input, setInput] = useState("name,type,local\nJSON,developer,true\nBase64,encoding,true")
  const [output, setOutput] = useState("")
  const [error, setError] = useState("")
  const run = (mode: "csv" | "json") => {
    try { setOutput(mode === "csv" ? JSON.stringify(parseCsv(input), null, 2) : jsonToCsv(input)); setError("") }
    catch (reason) { setError(reason instanceof Error ? reason.message : "转换失败") }
  }
  return <><ToolWorkspace><EditorPanel label="输入" value={input} onChange={setInput} /><EditorPanel label="转换结果" value={output} readOnly /></ToolWorkspace><div className="tool-controls"><Button onClick={() => run("csv")}>CSV → JSON</Button><Button className="button-secondary" onClick={() => run("json")}>JSON → CSV</Button>{error && <Status error>{error}</Status>}</div></>
}
