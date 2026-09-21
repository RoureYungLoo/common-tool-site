import { useMemo, useState } from "react"
import { EditorPanel, Status, ToolWorkspace } from "../components/ui"

function diffLines(before: string, after: string) {
  const left = before.split(/\r?\n/).slice(0, 250)
  const right = after.split(/\r?\n/).slice(0, 250)
  const table = Array.from({ length: left.length + 1 }, () => Array<number>(right.length + 1).fill(0))
  for (let i = left.length - 1; i >= 0; i--) for (let j = right.length - 1; j >= 0; j--) table[i][j] = left[i] === right[j] ? table[i + 1][j + 1] + 1 : Math.max(table[i + 1][j], table[i][j + 1])
  const result: string[] = []
  let i = 0, j = 0, added = 0, removed = 0
  while (i < left.length || j < right.length) {
    if (i < left.length && j < right.length && left[i] === right[j]) { result.push(`  ${left[i]}`); i++; j++ }
    else if (j < right.length && (i === left.length || table[i][j + 1] >= table[i + 1][j])) { result.push(`+ ${right[j]}`); added++; j++ }
    else { result.push(`- ${left[i]}`); removed++; i++ }
  }
  return { output: result.join("\n"), added, removed }
}

export default function TextDiffTool() {
  const [before, setBefore] = useState("第一行\n这是一段旧文本\n保持不变")
  const [after, setAfter] = useState("第一行\n这是一段新文本\n保持不变\n新增一行")
  const diff = useMemo(() => diffLines(before, after), [before, after])
  return <>
    <ToolWorkspace><EditorPanel label="原始文本" value={before} onChange={setBefore} /><EditorPanel label="新文本" value={after} onChange={setAfter} /></ToolWorkspace>
    <div className="diff-result"><EditorPanel label={`差异结果 · +${diff.added} / -${diff.removed}`} value={diff.output} readOnly /></div>
    <div className="tool-controls"><Status>按行比较，最多处理前 250 行</Status></div>
  </>
}
