import { useMemo, useState } from "react"
import { Status } from "../components/ui"

const groups = ["所有者", "用户组", "其他用户"]
const permissions = [{ key: "r", label: "读取", value: 4 }, { key: "w", label: "写入", value: 2 }, { key: "x", label: "执行", value: 1 }] as const

export default function ChmodTool() {
  const [values, setValues] = useState([[true, true, true], [true, false, true], [true, false, true]])
  const result = useMemo(() => {
    const digits = values.map((group) => group.reduce((sum, enabled, index) => sum + (enabled ? permissions[index].value : 0), 0)).join("")
    const symbolic = values.flatMap((group) => group.map((enabled, index) => enabled ? permissions[index].key : "-")).join("")
    return { digits, symbolic }
  }, [values])
  const toggle = (group: number, permission: number) => setValues((current) => current.map((items, groupIndex) => groupIndex === group ? items.map((enabled, index) => index === permission ? !enabled : enabled) : items))
  return <div className="chmod-layout"><div className="permission-table"><div className="permission-row permission-head"><span>身份</span>{permissions.map((item) => <span key={item.key}>{item.label}</span>)}</div>{groups.map((group, groupIndex) => <div className="permission-row" key={group}><strong>{group}</strong>{permissions.map((permission, permissionIndex) => <label key={permission.key}><input type="checkbox" checked={values[groupIndex][permissionIndex]} onChange={() => toggle(groupIndex, permissionIndex)} /><span>{permission.key}</span></label>)}</div>)}</div><div className="permission-result"><div><span>数字权限</span><code>{result.digits}</code></div><div><span>符号权限</span><code>{result.symbolic}</code></div><div><span>命令示例</span><code>chmod {result.digits} filename</code></div></div><div className="tool-controls"><Status>权限结果实时更新</Status></div></div>
}
