import { Code2, Command, Moon, Search, Sun } from "lucide-react"
import { useEffect, useState } from "react"
import { Link, NavLink, Outlet } from "react-router-dom"
import SearchDialog from "./SearchDialog"
import PwaStatus from "./PwaStatus"

const quotes = [
  ["千里之行，始于足下。", "老子"],
  ["知之为知之，不知为不知，是知也。", "孔子"],
  ["纸上得来终觉浅，绝知此事要躬行。", "陆游"],
  ["路漫漫其修远兮，吾将上下而求索。", "屈原"],
  ["天行健，君子以自强不息。", "《周易》"],
]

export default function Layout() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [dark, setDark] = useState(() => document.documentElement.classList.contains("dark"))
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark)
    document.documentElement.style.colorScheme = dark ? "dark" : "light"
    document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')?.setAttribute("content", dark ? "#121713" : "#2563eb")
    try { localStorage.setItem("foldrule-theme", dark ? "dark" : "light") } catch { /* Private mode can deny storage. */ }
  }, [dark])
  useEffect(() => {
    const shortcut = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLocaleLowerCase() === "k") { event.preventDefault(); setSearchOpen(true) }
    }
    window.addEventListener("keydown", shortcut)
    return () => window.removeEventListener("keydown", shortcut)
  }, [])
  const navClass = ({ isActive }: { isActive: boolean }) => `border-b-2 px-0 pt-5 pb-[18px] transition-colors hover:text-app-text ${isActive ? "border-app-brand-deep text-app-text" : "border-transparent"}`
  return <div className="flex min-h-screen flex-col">
    <header className="sticky top-0 z-30 h-[60px] border-b border-app-line/80 bg-app-bg/90 backdrop-blur-lg max-[540px]:h-14">
      <div className="mx-auto flex h-full w-[calc(100%-2rem)] max-w-[1600px] items-center gap-11 max-[540px]:gap-2.5">
        <Link to="/" className="flex items-center gap-2.5"><span className="brand-mark"><span /><span /><span /></span><strong className="text-[19px] tracking-[.05em] max-[540px]:text-base">禄若阳的工具站</strong></Link>
        <nav className="flex gap-6 text-[13px] text-app-muted max-[800px]:hidden"><NavLink className={navClass} to="/">首页</NavLink><NavLink className={navClass} to="/favorites">收藏</NavLink><NavLink className={navClass} to="/about">关于</NavLink></nav>
        <div className="quote-ticker" aria-label="名人名言">
          <div className="quote-track">
            {[0, 1].map((copy) => <div className="quote-sequence" aria-hidden={copy === 1} key={copy}>{quotes.map(([quote, author]) => <span key={`${copy}-${author}`}><q>{quote}</q><em>— {author}</em></span>)}</div>)}
          </div>
        </div>
        <div className="ml-0 flex items-center gap-2 max-[1100px]:ml-auto">
          <button type="button" className="flex h-[34px] w-[200px] cursor-text items-center gap-2 border border-app-line bg-app-surface px-2 pl-3 text-app-muted transition-colors hover:border-app-brand-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-brand-deep max-[800px]:w-10 max-[800px]:justify-center max-[800px]:p-0 max-[540px]:h-11 max-[540px]:w-11" onClick={() => setSearchOpen(true)}><Search size={16} /><span className="text-[13px] max-[800px]:hidden">搜索工具</span><kbd className="ml-auto max-[800px]:hidden">Ctrl K</kbd></button>
          <button type="button" className="grid h-[34px] w-[34px] place-items-center border border-app-line bg-app-surface transition-colors hover:border-app-brand-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-brand-deep max-[540px]:h-11 max-[540px]:w-11" onClick={() => setDark(!dark)} aria-label="切换主题">{dark ? <Sun size={18} /> : <Moon size={18} />}</button>
          <a className="grid h-[34px] w-[34px] place-items-center border border-app-line bg-app-surface transition-colors hover:border-app-brand-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-brand-deep max-[540px]:hidden" href="https://github.com/roureyungloo/common-tool-site" target="_blank" rel="noreferrer" aria-label="查看 GitHub 仓库"><Code2 size={18} /></a>
        </div>
      </div>
    </header>
    <main className="flex-1"><Outlet context={{ openSearch: () => setSearchOpen(true) }} /></main>
    <footer className="mx-auto mt-6 flex min-h-[62px] w-[calc(100%-2rem)] max-w-[1600px] items-center justify-between border-t border-app-line py-[18px] text-sm text-app-muted"><Link to="/" className="flex items-center gap-2 font-bold text-app-text"><Command size={15} />禄若阳的工具站</Link><span className="max-[540px]:hidden">© {new Date().getFullYear()} 禄若阳</span></footer>
    <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    <PwaStatus />
  </div>
}
