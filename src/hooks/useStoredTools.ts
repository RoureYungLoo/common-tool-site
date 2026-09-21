import { useEffect, useState } from "react"
import { getFavorites, getRecents } from "../lib/storage"

export function useStoredTools() {
  const [, refresh] = useState(0)
  useEffect(() => {
    const update = () => refresh((value) => value + 1)
    window.addEventListener("tools-storage", update)
    return () => window.removeEventListener("tools-storage", update)
  }, [])
  return { favorites: getFavorites(), recents: getRecents() }
}
