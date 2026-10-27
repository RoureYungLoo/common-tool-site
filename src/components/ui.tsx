import { Check, Copy, Trash2 } from "lucide-react"
import { createContext, useContext, useEffect, useRef, useState, type ButtonHTMLAttributes, type PropsWithChildren, type TextareaHTMLAttributes } from "react"
import SimpleEditorImport from "react-simple-code-editor"
import Prism from "prismjs"
import { copyText } from "../lib/utils"

const CodeEditor = ((SimpleEditorImport as unknown as { default?: typeof SimpleEditorImport }).default ?? SimpleEditorImport) as typeof SimpleEditorImport
const ToolStateContext = createContext<string | null>(null)

export function ToolStateScope({ scope, children }: PropsWithChildren<{ scope: string }>) {
  return <ToolStateContext.Provider value={scope}>{children}</ToolStateContext.Provider>
}

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
  const secondary = className.includes("button-secondary")
  return <button type="button" className={`button inline-flex min-h-[38px] cursor-pointer items-center justify-center gap-2 border px-4 text-xs font-bold shadow-[inset_0_1px_rgba(255,255,255,.3)] transition hover:-translate-y-px hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-brand-deep disabled:cursor-not-allowed disabled:opacity-50 ${secondary ? "border-app-line bg-app-surface text-app-text" : "border-blue-600 bg-app-brand text-white dark:text-slate-950"} ${className}`} {...props} />
}

export function Textarea({ className = "", ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={`code-area block h-[260px] w-full resize-y border-0 bg-transparent p-[13px] font-mono text-xs leading-[1.6] text-app-text outline-none placeholder:text-app-muted/60 read-only:bg-app-soft/40 max-[800px]:h-[230px] ${className}`} spellCheck={false} {...props} />
}

export function EditorPanel({ label, value, onChange, placeholder, readOnly = false, autoGrow = false, scrollable = false, language }: {
  label: string; value: string; onChange?: (value: string) => void; placeholder?: string; readOnly?: boolean; autoGrow?: boolean; scrollable?: boolean; language?: "json"
}) {
  const scope = useContext(ToolStateContext)
  const stateKey = scope ? `foldrule-tool-state-v1:${scope}:${label.replace(/\s*·.*$/, "")}` : null
  const restoredKey = useRef<string | null>(null)
  const skipNextSave = useRef(false)
  const [copied, setCopied] = useState(false)
  const [copyError, setCopyError] = useState(false)
  const onCopy = async () => {
    try {
      await copyText(value)
      setCopyError(false)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1400)
    } catch {
      setCopyError(true)
      window.setTimeout(() => setCopyError(false), 2400)
    }
  }
  useEffect(() => {
    if (!stateKey || readOnly || !onChange || restoredKey.current === stateKey) return
    restoredKey.current = stateKey
    try {
      const saved = sessionStorage.getItem(stateKey)
      if (saved !== null && saved !== value) {
        skipNextSave.current = true
        onChange(saved)
      }
    } catch { /* Tool state persistence is optional. */ }
  }, [onChange, readOnly, stateKey, value])
  useEffect(() => {
    if (!stateKey || readOnly || restoredKey.current !== stateKey) return
    if (skipNextSave.current) {
      skipNextSave.current = false
      return
    }
    try { sessionStorage.setItem(stateKey, value) } catch { /* Tool state persistence is optional. */ }
  }, [readOnly, stateKey, value])
  const jsonEditor = language === "json" ? <CodeEditor
    className={`${scrollable ? "" : "code-area "}json-code-editor language-json${autoGrow ? " code-area-auto" : ""}`}
    style={scrollable ? { minHeight: "100%", minWidth: "100%", width: "max-content", overflow: "visible" } : undefined}
    value={value}
    onValueChange={(nextValue) => onChange?.(nextValue)}
    highlight={(code) => Prism.highlight(code, Prism.languages.json, "json")}
    padding={13}
    placeholder={placeholder}
    readOnly={readOnly}
    textareaClassName="json-code-textarea"
  /> : null
  return (
    <section className="editor-panel overflow-hidden border border-app-line bg-app-bg">
      <div className="editor-head flex min-h-9 items-center justify-between border-b border-app-line bg-app-soft/70 pr-2 pl-3">
        <span className="text-[13px] font-bold tracking-[.03em] text-app-muted">{label}</span>
        <div className="flex gap-1">
          {value && !readOnly && <button type="button" className="icon-text inline-flex min-h-11 items-center gap-1.5 border-0 bg-transparent px-2 text-sm text-app-muted hover:text-app-text focus-visible:outline-2 focus-visible:outline-app-brand-deep" onClick={() => onChange?.("")}><Trash2 size={14} />清空</button>}
          {value && <button type="button" className="icon-text inline-flex min-h-11 items-center gap-1.5 border-0 bg-transparent px-2 text-sm text-app-muted hover:text-app-text focus-visible:outline-2 focus-visible:outline-app-brand-deep" onClick={onCopy} aria-live="polite">{copied ? <Check size={14} /> : <Copy size={14} />}{copyError ? "复制失败" : copied ? "已复制" : "复制"}</button>}
        </div>
      </div>
      {language === "json" ? (scrollable ? <div className="code-area json-scroll-area h-[520px] overflow-auto p-0 max-[800px]:h-[460px]">{jsonEditor}</div> : jsonEditor) : <Textarea className={autoGrow ? "code-area-auto" : ""} rows={autoGrow ? Math.max(2, value.split("\n").length) : undefined} value={value} onChange={(event) => onChange?.(event.target.value)} placeholder={placeholder} readOnly={readOnly} />}
    </section>
  )
}

export function ToolWorkspace({ children }: PropsWithChildren) {
  return <div className="tool-workspace grid grid-cols-2 gap-2 max-[800px]:grid-cols-1">{children}</div>
}

export function Status({ error, children }: PropsWithChildren<{ error?: boolean }>) {
  return <div className={`status ml-auto px-2.5 py-1.5 text-sm max-[540px]:mt-1 max-[540px]:ml-0 max-[540px]:w-full ${error ? "status-error bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300" : "bg-app-brand/10 text-app-brand-deep"}`} role="status" aria-live="polite">{children}</div>
}
