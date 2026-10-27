import { RefreshCw, WifiOff, X } from "lucide-react"
import { useEffect, useState } from "react"

export default function PwaStatus() {
  const [waiting, setWaiting] = useState<ServiceWorker | null>(null)
  const [offline, setOffline] = useState(() => !navigator.onLine)
  const [registrationError, setRegistrationError] = useState(false)

  useEffect(() => {
    const online = () => setOffline(false)
    const offlineHandler = () => setOffline(true)
    window.addEventListener("online", online)
    window.addEventListener("offline", offlineHandler)
    if (!("serviceWorker" in navigator) || !import.meta.env.PROD) return () => {
      window.removeEventListener("online", online)
      window.removeEventListener("offline", offlineHandler)
    }

    let refreshing = false
    const controllerChange = () => {
      if (refreshing) return
      refreshing = true
      window.location.reload()
    }
    navigator.serviceWorker.addEventListener("controllerchange", controllerChange)
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`, { scope: import.meta.env.BASE_URL })
      .then((registration) => {
        if (registration.waiting) setWaiting(registration.waiting)
        registration.addEventListener("updatefound", () => {
          const worker = registration.installing
          worker?.addEventListener("statechange", () => {
            if (worker.state === "installed" && navigator.serviceWorker.controller) setWaiting(worker)
          })
        })
      })
      .catch(() => setRegistrationError(true))

    return () => {
      window.removeEventListener("online", online)
      window.removeEventListener("offline", offlineHandler)
      navigator.serviceWorker.removeEventListener("controllerchange", controllerChange)
    }
  }, [])

  if (!offline && !waiting && !registrationError) return null
  return <div className="fixed right-4 bottom-4 z-[120] flex max-w-[calc(100vw-2rem)] items-center gap-3 border border-app-line bg-app-surface px-4 py-3 text-sm text-app-text shadow-2xl" role="status" aria-live="polite">
    {offline ? <><WifiOff size={18} /><span>当前处于离线模式，已缓存的工具仍可使用。</span></> : registrationError ? <><WifiOff size={18} /><span>离线功能暂时不可用。</span><button type="button" aria-label="关闭提示" onClick={() => setRegistrationError(false)}><X size={16} /></button></> : <><RefreshCw size={18} /><span>新版本已经准备好。</span><button type="button" className="border border-app-brand-deep px-3 py-1.5 font-semibold text-app-brand-deep" onClick={() => waiting?.postMessage({ type: "SKIP_WAITING" })}>立即更新</button></>}
  </div>
}
