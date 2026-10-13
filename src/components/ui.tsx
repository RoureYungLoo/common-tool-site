import { Check, Copy, Trash2 } from "lucide-react"
import { useState, type ButtonHTMLAttributes, type PropsWithChildren, type TextareaHTMLAttributes } from "react"
import SimpleEditorImport from "react-simple-code-editor"
import Prism from "prismjs"
import { copyText } from "../lib/utils"

const CodeEditor = ((SimpleEditorImport as unknown as { default?: typeof SimpleEditorImport }).default ?? SimpleEditorImport) as typeof SimpleEditorImport

Prism.languages.json = {
  property: { pattern: /(^|[^\\])"(?:\\.|[^\\"\r\n])*"(?=\s*:)/, lookbehind: true, greedy: true },
  string: { pattern: /(^|[^\\])"(?:\\.|[^\\"\r\n])*"(?!\s*:)/, lookbehind: true, greedy: true },
  number: /-?\b\d+(?:\.\d+)?(?:e[+-]?\d+)?\b/i,
  punctuation: /[{}[\],]/,
  operator: /:/,
  boolean: /\b(?:false|true)\b/,
  null: { pattern: /\bnull\b/, alias: "keyword" },
}

export function Button({ className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={`button ${className}`} {...props} />
}

export function Textarea({ className = "", ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={`code-area ${className}`} spellCheck={false} {...props} />
}

export function EditorPanel({ label, value, onChange, placeholder, readOnly = false, autoGrow = false, language }: {
  label: string; value: string; onChange?: (value: string) => void; placeholder?: string; readOnly?: boolean; autoGrow?: boolean; language?: "json"
}) {
  const [copied, setCopied] = useState(false)
  const onCopy = async () => {
    await copyText(value)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1400)
  }
  return (
    <section className="editor-panel">
      <div className="editor-head">
        <span>{label}</span>
        <div className="editor-actions">
          {value && !readOnly && <button className="icon-text" onClick={() => onChange?.("")}><Trash2 size={14} />清空</button>}
          {value && <button className="icon-text" onClick={onCopy}>{copied ? <Check size={14} /> : <Copy size={14} />}{copied ? "已复制" : "复制"}</button>}
        </div>
      </div>
      {language === "json" ? <CodeEditor
        className={`code-area json-code-editor language-json${autoGrow ? " code-area-auto" : ""}`}
        value={value}
        onValueChange={(nextValue) => onChange?.(nextValue)}
        highlight={(code) => Prism.highlight(code, Prism.languages.json, "json")}
        padding={13}
        placeholder={placeholder}
        readOnly={readOnly}
        textareaClassName="json-code-textarea"
      /> : <Textarea className={autoGrow ? "code-area-auto" : ""} rows={autoGrow ? Math.max(2, value.split("\n").length) : undefined} value={value} onChange={(event) => onChange?.(event.target.value)} placeholder={placeholder} readOnly={readOnly} />}
    </section>
  )
}

export function ToolWorkspace({ children }: PropsWithChildren) {
  return <div className="tool-workspace">{children}</div>
}

export function Status({ error, children }: PropsWithChildren<{ error?: boolean }>) {
  return <div className={`status ${error ? "status-error" : ""}`}>{children}</div>
}
