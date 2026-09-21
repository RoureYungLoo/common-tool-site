import { useMemo, useState } from "react"
import { EditorPanel, Status, ToolWorkspace } from "../components/ui"

export default function RegexTool() {
  const [pattern, setPattern] = useState("(\\w+)@(\\w+\\.\\w+)")
  const [text, setText] = useState("联系 alice@example.com 或 bob@tool.dev 获取帮助。")
  const [flags, setFlags] = useState("gi")
  const result = useMemo(() => {
    try {
      const expression = new RegExp(pattern, flags.includes("g") ? flags : `${flags}g`)
      const matches = Array.from(text.matchAll(expression))
      return {
        error: "",
        output: matches.length ? matches.map((match, index) => [
          `#${index + 1} 位置 ${match.index}`,
          `完整匹配: ${match[0]}`,
          ...match.slice(1).map((group, groupIndex) => `分组 ${groupIndex + 1}: ${group ?? ""}`),
        ].join("\n")).join("\n\n") : "没有匹配结果",
        count: matches.length,
      }
    } catch (reason) {
      return { error: reason instanceof Error ? reason.message : "正则表达式无效", output: "", count: 0 }
    }
  }, [pattern, text, flags])

  const toggleFlag = (flag: string) => setFlags((current) => current.includes(flag) ? current.replace(flag, "") : `${current}${flag}`)

  return <>
    <div className="field-row regex-bar">
      <label className="field-grow"><span>表达式</span><input className="text-input mono" value={pattern} onChange={(event) => setPattern(event.target.value)} /></label>
      <div className="flag-group"><span>标志</span>{["g", "i", "m", "s"].map((flag) => <button key={flag} className={flags.includes(flag) ? "choice active" : "choice"} onClick={() => toggleFlag(flag)}>{flag}</button>)}</div>
    </div>
    <ToolWorkspace>
      <EditorPanel label="测试文本" value={text} onChange={setText} placeholder="输入需要匹配的文本…" />
      <EditorPanel label={`匹配结果 · ${result.count}`} value={result.output} readOnly />
    </ToolWorkspace>
    <div className="tool-controls">{result.error ? <Status error>{result.error}</Status> : <Status>实时匹配完成</Status>}</div>
  </>
}
