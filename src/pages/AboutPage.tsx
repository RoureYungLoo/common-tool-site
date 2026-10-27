import { Code2, Heart, ShieldCheck, Sparkles } from "lucide-react"
import content from "../content.json"
import { usePageMeta } from "../hooks/usePageMeta"

export default function AboutPage() {
  const meta = content.pages.about
  usePageMeta(meta.title, meta.description, meta.path, meta.index)
  const cardClass = "min-h-[190px] border border-app-line bg-app-surface p-[26px] [&>svg]:text-app-brand-deep [&>h3]:mt-[22px] [&>h3]:mb-2 [&>p]:m-0 [&>p]:text-[13px] [&>p]:leading-[1.7] [&>p]:text-app-muted"
  return <div className="mx-auto w-[calc(100%-2rem)] max-w-[1440px] pt-[38px] pb-8 max-[540px]:pt-[26px]">
    <div className="mb-6 max-w-[670px]"><span className="text-[13px] font-extrabold tracking-[.16em] text-app-brand-deep">ABOUT</span><h1 className="my-1 text-[35px] tracking-[-.045em] max-[540px]:text-[32px]">小工具，也值得好好做。</h1><p className="m-0 text-[13px] leading-[1.6] text-app-muted">禄若阳的工具站是一组专注、轻量的浏览器工具，希望减少每一次复制、转换和校验时的摩擦。</p></div>
    <div className="grid grid-cols-2 gap-3.5 max-[540px]:grid-cols-1">
      <article className={cardClass}><Sparkles /><h3>简单</h3><p>无需学习复杂界面，打开就知道该怎么用。</p></article>
      <article className={cardClass}><ShieldCheck /><h3>私密</h3><p>数据在本机完成处理，不上传，不追踪。</p></article>
      <article className={cardClass}><Code2 /><h3>开放</h3><p>基于 React 与浏览器原生能力构建，易于扩展。</p></article>
      <article className={cardClass}><Heart /><h3>克制</h3><p>只添加真正有用的依赖与功能，保持轻快。</p></article>
    </div>
  </div>
}
