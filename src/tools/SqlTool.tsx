import { useState } from "react"
import { Button, EditorPanel, Status, ToolWorkspace } from "../components/ui"

const majorKeywords = ["SELECT", "FROM", "WHERE", "GROUP BY", "ORDER BY", "HAVING", "LIMIT", "INSERT INTO", "VALUES", "UPDATE", "SET", "DELETE FROM", "LEFT JOIN", "RIGHT JOIN", "INNER JOIN", "OUTER JOIN", "JOIN", "UNION", "AND", "OR"]

function formatSql(value: string) {
  let sql = value.replace(/\s+/g, " ").trim()
  for (const keyword of majorKeywords) {
    const expression = new RegExp(`\\b${keyword.replace(" ", "\\s+")}\\b`, "gi")
    sql = sql.replace(expression, `\n${keyword}`)
  }
  return sql.trim().replace(/,\s*/g, ",\n  ").replace(/\n(AND|OR)\b/g, "\n  $1")
}

export default function SqlTool() {
  const [input, setInput] = useState("select u.id,u.name,count(o.id) as orders from users u left join orders o on o.user_id=u.id where u.active=1 group by u.id,u.name order by orders desc;")
  const [output, setOutput] = useState("")
  return <><ToolWorkspace><EditorPanel label="SQL 输入" value={input} onChange={setInput} /><EditorPanel label="处理结果" value={output} readOnly /></ToolWorkspace><div className="tool-controls"><Button onClick={() => setOutput(formatSql(input))}>格式化</Button><Button className="button-secondary" onClick={() => setOutput(input.replace(/\s+/g, " ").trim())}>压缩</Button><Status>轻量格式化，适合常见 SQL</Status></div></>
}
