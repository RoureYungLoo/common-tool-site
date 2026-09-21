import { Code2, Heart, ShieldCheck, Sparkles } from "lucide-react"
import { usePageMeta } from "../hooks/usePageMeta"

export default function AboutPage() {
  usePageMeta("关于", "了解禄若阳的工具站：一个简单、私密、轻量的在线开发工具集合。", "/about")
  return <div className="page-container about-page">
    <div className="page-intro"><span className="section-kicker">ABOUT</span><h1>小工具，也值得好好做。</h1><p>禄若阳的工具站是一组专注、轻量的浏览器工具，希望减少每一次复制、转换和校验时的摩擦。</p></div>
    <div className="value-grid">
      <article><Sparkles /><h3>简单</h3><p>无需学习复杂界面，打开就知道该怎么用。</p></article>
      <article><ShieldCheck /><h3>私密</h3><p>数据在本机完成处理，不上传，不追踪。</p></article>
      <article><Code2 /><h3>开放</h3><p>基于 React 与浏览器原生能力构建，易于扩展。</p></article>
      <article><Heart /><h3>克制</h3><p>只添加真正有用的依赖与功能，保持轻快。</p></article>
    </div>
  </div>
}
