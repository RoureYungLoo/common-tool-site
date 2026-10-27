import { Copy, ExternalLink, Mail, MessageSquareText, Phone } from "lucide-react"
import { useMemo, useState } from "react"
import { Button, Status } from "../components/ui"
import { copyText } from "../lib/utils"

type ContactAction = "sms" | "tel" | "mailto"

const actionConfig = {
  sms: {
    title: "短信内容",
    recipientLabel: "手机号码",
    recipientPlaceholder: "+86 138 0013 8000",
    messageLabel: "短信内容",
    messagePlaceholder: "输入要发送的短信内容…",
    actionLabel: "唤起短信应用",
    Icon: MessageSquareText,
  },
  tel: {
    title: "拨号信息",
    recipientLabel: "电话号码",
    recipientPlaceholder: "+86 138 0013 8000",
    messageLabel: "",
    messagePlaceholder: "",
    actionLabel: "拨打电话",
    Icon: Phone,
  },
  mailto: {
    title: "邮件内容",
    recipientLabel: "收件人",
    recipientPlaceholder: "name@example.com",
    messageLabel: "正文",
    messagePlaceholder: "输入邮件正文…",
    actionLabel: "唤起邮件应用",
    Icon: Mail,
  },
} as const

const cleanPhoneNumber = (value: string) => {
  const compact = value.trim().replace(/[\s()-]/g, "")
  return compact.replace(/(?!^)\+/g, "").replace(/[^\d+]/g, "")
}

const encodeQuery = (params: URLSearchParams) => params.toString().replace(/\+/g, "%20")

export default function ContactActionForm({ action }: { action: ContactAction }) {
  const config = actionConfig[action]
  const Icon = config.Icon
  const [recipient, setRecipient] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [status, setStatus] = useState("")
  const [error, setError] = useState("")

  const normalizedRecipient = action === "mailto" ? recipient.trim() : cleanPhoneNumber(recipient)
  const validationError = useMemo(() => {
    if (!normalizedRecipient) return action === "mailto" ? "请输入收件人邮箱" : "请输入电话号码"
    if (action === "mailto" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedRecipient)) return "请输入有效的邮箱地址"
    if (action !== "mailto" && normalizedRecipient.replace(/\D/g, "").length < 3) return "请输入有效的电话号码"
    return ""
  }, [action, normalizedRecipient])

  const link = useMemo(() => {
    if (!normalizedRecipient) return ""
    if (action === "tel") return `tel:${normalizedRecipient}`
    if (action === "sms") {
      if (!message) return `sms:${normalizedRecipient}`
      const appleMobile = /iPad|iPhone|iPod/.test(navigator.userAgent)
      return `sms:${normalizedRecipient}${appleMobile ? "&" : "?"}body=${encodeURIComponent(message)}`
    }
    const params = new URLSearchParams()
    if (subject) params.set("subject", subject)
    if (message) params.set("body", message)
    const query = encodeQuery(params)
    return `mailto:${normalizedRecipient}${query ? `?${query}` : ""}`
  }, [action, message, normalizedRecipient, subject])

  const update = (setter: (value: string) => void, value: string) => {
    setter(value)
    setStatus("")
    setError("")
  }

  const openApp = () => {
    if (validationError) {
      setError(validationError)
      setStatus("")
      return
    }
    setError("")
    setStatus("正在请求系统打开对应应用…")
    window.location.href = link
  }

  const copyLink = async () => {
    if (validationError) {
      setError(validationError)
      setStatus("")
      return
    }
    try {
      await copyText(link)
      setError("")
      setStatus("链接已复制")
    } catch (copyError) {
      setStatus("")
      setError(copyError instanceof Error ? copyError.message : "复制失败")
    }
  }

  return <>
    <div className="grid grid-cols-[minmax(0,1.1fr)_minmax(280px,.9fr)] gap-2 max-[800px]:grid-cols-1">
      <section className="border border-app-line bg-app-bg p-3">
        <div className="mb-3 flex items-center gap-2 text-sm font-bold"><Icon size={18} className="text-app-brand-deep" />{config.title}</div>
        <label className="block-field">
          <span>{config.recipientLabel}</span>
          <input
            className="text-input"
            type={action === "mailto" ? "email" : "tel"}
            inputMode={action === "mailto" ? "email" : "tel"}
            autoComplete={action === "mailto" ? "email" : "tel"}
            value={recipient}
            onChange={(event) => update(setRecipient, event.target.value)}
            placeholder={config.recipientPlaceholder}
          />
        </label>
        {action === "mailto" && <label className="block-field">
          <span>主题</span>
          <input className="text-input" value={subject} onChange={(event) => update(setSubject, event.target.value)} placeholder="输入邮件主题…" />
        </label>}
        {action !== "tel" && <label className="block-field mb-0">
          <span>{config.messageLabel}</span>
          <textarea className="block min-h-[132px] w-full resize-y border border-app-line bg-app-bg p-3 text-sm leading-6 text-app-text outline-none focus:border-app-brand-deep focus:outline-2 focus:outline-app-brand-deep/20" value={message} onChange={(event) => update(setMessage, event.target.value)} placeholder={config.messagePlaceholder} />
        </label>}
      </section>
      <section className="flex min-w-0 flex-col border border-app-line bg-app-bg p-3">
        <div className="mb-3 text-sm font-bold">操作预览</div>
        <div className="mb-3 min-h-[76px] border border-app-line bg-app-surface p-3">
          <span className="mb-2 block text-xs font-bold text-app-muted">系统链接</span>
          <code className="block break-all font-mono text-xs leading-5 text-app-text">{link || "填写信息后生成链接"}</code>
        </div>
        <p className="mt-0 mb-4 text-xs leading-5 text-app-muted">工具只会请求系统打开对应应用；是否发送短信或邮件、是否拨号，仍由你在系统界面中确认。</p>
        <div className="mt-auto flex flex-wrap gap-2">
          <Button onClick={openApp}><ExternalLink size={15} />{config.actionLabel}</Button>
          <Button className="button-secondary" onClick={copyLink}><Copy size={15} />复制链接</Button>
        </div>
      </section>
    </div>
    <div className="tool-controls">{error ? <Status error>{error}</Status> : status ? <Status>{status}</Status> : null}</div>
  </>
}
