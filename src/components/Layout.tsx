import { Code2, Command, Moon, Search, Sun } from "lucide-react"
import { useEffect, useState } from "react"
import { Link, NavLink, Outlet } from "react-router-dom"
import SearchDialog from "./SearchDialog"

const quotes = [
  ["千里之行，始于足下。", "老子"],
  ["知之为知之，不知为不知，是知也。", "孔子"],
  ["纸上得来终觉浅，绝知此事要躬行。", "陆游"],
  ["路漫漫其修远兮，吾将上下而求索。", "屈原"],
  ["天行健，君子以自强不息。", "《周易》"],
]

export default function Layout() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [dark, setDark] = useState(() => localStorage.getItem("foldrule-theme") === "dark")
  useEffect(() => { document.documentElement.classList.toggle("dark", dark); localStorage.setItem("foldrule-theme", dark ? "dark" : "light") }, [dark])
  useEffect(() => {
    const shortcut = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLocaleLowerCase() === "k") { event.preventDefault(); setSearchOpen(true) }
    }
    window.addEventListener("keydown", shortcut)
    return () => window.removeEventListener("keydown", shortcut)
  }, [])
  return <div className="site-shell">
    <header className="site-header">
      <div className="header-inner">
        <Link to="/" className="brand"><span className="brand-mark"><span /><span /><span /></span><strong>禄若阳的工具站</strong></Link>
        <nav><NavLink to="/">首页</NavLink><NavLink to="/favorites">收藏</NavLink><NavLink to="/about">关于</NavLink></nav>
        <div className="quote-ticker" aria-label="名人名言">
          <div className="quote-track">
            {[0, 1].map((copy) => <div className="quote-sequence" aria-hidden={copy === 1} key={copy}>{quotes.map(([quote, author]) => <span key={`${copy}-${author}`}><q>{quote}</q><em>— {author}</em></span>)}</div>)}
          </div>
        </div>
        <div className="header-actions">
          <button className="header-search" onClick={() => setSearchOpen(true)}><Search size={16} /><span>搜索工具</span><kbd>Ctrl K</kbd></button>
          <button className="round-button" onClick={() => setDark(!dark)} aria-label="切换主题">{dark ? <Sun size={18} /> : <Moon size={18} />}</button>
          <a className="round-button" href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub"><Code2 size={18} /></a>
        </div>
      </div>
    </header>
    <main><Outlet context={{ openSearch: () => setSearchOpen(true) }} /></main>
    <footer><Link to="/" className="footer-brand"><Command size={15} />禄若阳的工具站</Link><span>所有计算均在你的浏览器中完成</span><span>© 2026 禄若阳</span></footer>
    <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
  </div>
}
