import { Component, type ErrorInfo, type ReactNode } from "react"
import { AlertTriangle, RotateCw } from "lucide-react"

interface Props {
  children: ReactNode
  resetKey?: string
  compact?: boolean
}

interface State {
  error: Error | null
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("界面渲染失败", error, info.componentStack)
  }

  componentDidUpdate(previous: Props) {
    if (this.state.error && previous.resetKey !== this.props.resetKey) this.setState({ error: null })
  }

  render() {
    if (!this.state.error) return this.props.children
    return <section className={`mx-auto grid place-items-center border border-dashed border-red-400/60 bg-red-50/70 px-5 text-center text-red-700 dark:bg-red-950/20 dark:text-red-300 ${this.props.compact ? "min-h-52" : "min-h-[60vh] max-w-3xl"}`} role="alert">
      <div>
        <AlertTriangle className="mx-auto mb-3" size={28} />
        <h2 className="m-0 text-lg font-bold">这个区域加载失败</h2>
        <p className="mt-2 mb-4 text-sm opacity-80">你的其他窗口不受影响，可以重新加载后继续。</p>
        <button type="button" className="inline-flex min-h-11 items-center gap-2 border border-current px-4 font-semibold" onClick={() => window.location.reload()}><RotateCw size={16} />重新加载</button>
      </div>
    </section>
  }
}
