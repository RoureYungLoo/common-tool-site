import { useMemo, useState } from "react"
import { EditorPanel, Status } from "../components/ui"

export default function UrlParserTool() {
  const [input, setInput] = useState("https://example.com:8080/tools/search?q=json&lang=zh#result")
  const parsed = useMemo(() => {
    try {
      const url = new URL(input)
      return { error: "", output: JSON.stringify({ protocol: url.protocol, host: url.host, hostname: url.hostname, port: url.port || "默认", pathname: url.pathname, search: url.search, hash: url.hash, query: Object.fromEntries(url.searchParams.entries()), origin: url.origin }, null, 2) }
    } catch { return { error: "请输入包含协议的完整 URL", output: "" } }
  }, [input])
  return <>
    <label className="block-field"><span>URL 地址</span><input className="text-input mono" value={input} onChange={(event) => setInput(event.target.value)} placeholder="https://example.com/path?key=value" /></label>
    <EditorPanel label="解析结果" value={parsed.output} readOnly placeholder="URL 各部分会显示在这里" />
    <div className="tool-controls">{parsed.error ? <Status error>{parsed.error}</Status> : <Status>URL 解析成功</Status>}</div>
  </>
}
