import { useMemo, useState, type ReactNode } from "react"
import { EditorPanel, Status } from "../components/ui"

function renderMarkdown(value: string) {
  const nodes: ReactNode[] = []
  let codeLines: string[] = [], inCode = false
  value.split(/\r?\n/).forEach((line, index) => {
    if (line.startsWith("```")) {
      if (inCode) { nodes.push(<pre key={`code-${index}`}><code>{codeLines.join("\n")}</code></pre>); codeLines = [] }
      inCode = !inCode
    } else if (inCode) codeLines.push(line)
    else if (line.startsWith("### ")) nodes.push(<h3 key={index}>{line.slice(4)}</h3>)
    else if (line.startsWith("## ")) nodes.push(<h2 key={index}>{line.slice(3)}</h2>)
    else if (line.startsWith("# ")) nodes.push(<h1 key={index}>{line.slice(2)}</h1>)
    else if (line.startsWith("> ")) nodes.push(<blockquote key={index}>{line.slice(2)}</blockquote>)
    else if (/^[-*] /.test(line)) nodes.push(<div className="md-list-item" key={index}>• {line.slice(2)}</div>)
    else if (/^---+$/.test(line)) nodes.push(<hr key={index} />)
    else if (line.trim()) nodes.push(<p key={index}>{line}</p>)
    else nodes.push(<div className="md-space" key={index} />)
  })
  if (codeLines.length) nodes.push(<pre key="code-final"><code>{codeLines.join("\n")}</code></pre>)
  return nodes
}

export default function MarkdownTool() {
  const [input, setInput] = useState("# 禄若阳的工具站\n\n> 简单、私密的在线工具。\n\n## 特点\n\n- 浏览器本地处理\n- 无需注册\n- 支持多开布局\n\n```ts\nconst privateByDefault = true\n```")
  const preview = useMemo(() => renderMarkdown(input), [input])
  return <><div className="markdown-workspace"><EditorPanel label="Markdown" value={input} onChange={setInput} /><section className="markdown-preview"><div className="flex min-h-11 items-center border-b border-app-line bg-app-soft/70 px-3"><span className="text-[13px] font-bold text-app-muted">安全预览</span></div><div className="markdown-body">{preview}</div></section></div><div className="tool-controls"><Status>预览不会执行输入内容中的 HTML</Status></div></>
}
