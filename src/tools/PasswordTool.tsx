import { useEffect, useMemo, useState } from "react"
import { RefreshCw } from "lucide-react"
import { Button, EditorPanel, Status } from "../components/ui"

const sets = { lowercase: "abcdefghijklmnopqrstuvwxyz", uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ", numbers: "0123456789", symbols: "!@#$%^&*()-_=+[]{}" }
type SetKey = keyof typeof sets

function createPassword(length: number, enabled: SetKey[]) {
  const chars = enabled.map((key) => sets[key]).join("")
  if (!chars) return ""
  const randomIndex = (max: number) => {
    const limit = Math.floor(0x1_0000_0000 / max) * max
    const value = new Uint32Array(1)
    do crypto.getRandomValues(value)
    while (value[0] >= limit)
    return value[0] % max
  }
  const result = enabled.map((key) => sets[key][randomIndex(sets[key].length)])
  while (result.length < length) result.push(chars[randomIndex(chars.length)])
  for (let index = result.length - 1; index > 0; index--) {
    const target = randomIndex(index + 1)
    ;[result[index], result[target]] = [result[target], result[index]]
  }
  return result.join("")
}

export default function PasswordTool() {
  const [length, setLength] = useState(20)
  const [enabled, setEnabled] = useState<SetKey[]>(["lowercase", "uppercase", "numbers", "symbols"])
  const [password, setPassword] = useState("")
  const generate = () => setPassword(createPassword(length, enabled))
  useEffect(generate, [length, enabled])
  const entropy = useMemo(() => {
    const size = enabled.reduce((sum, key) => sum + sets[key].length, 0)
    return size ? Math.round(length * Math.log2(size)) : 0
  }, [length, enabled])
  const toggle = (key: SetKey) => setEnabled((current) => current.includes(key) ? current.filter((item) => item !== key) : [...current, key])
  return <>
    <div className="password-settings">
      <label className="range-field"><span>长度 <b>{length}</b></span><input type="range" min="6" max="64" value={length} onChange={(event) => setLength(Number(event.target.value))} /></label>
      <div className="check-grid">{(["lowercase", "uppercase", "numbers", "symbols"] as SetKey[]).map((key) => <label key={key}><input type="checkbox" checked={enabled.includes(key)} onChange={() => toggle(key)} /><span>{{ lowercase: "小写字母", uppercase: "大写字母", numbers: "数字", symbols: "符号" }[key]}</span></label>)}</div>
    </div>
    <EditorPanel label="生成结果" value={password} readOnly placeholder="至少选择一种字符类型" />
    <div className="tool-controls"><Button onClick={generate} disabled={!enabled.length}><RefreshCw size={15} />重新生成</Button><Status error={!enabled.length}>{enabled.length ? `估算强度 ${entropy} bits` : "请至少选择一种字符类型"}</Status></div>
  </>
}
