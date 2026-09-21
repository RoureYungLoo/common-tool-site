const FAVORITES_KEY = "foldrule-favorites"
const RECENTS_KEY = "foldrule-recents"

const read = (key: string): string[] => {
  try {
    return JSON.parse(localStorage.getItem(key) ?? "[]")
  } catch {
    return []
  }
}

export const getFavorites = () => read(FAVORITES_KEY)
export const getRecents = () => read(RECENTS_KEY)

export const toggleFavorite = (id: string) => {
  const next = getFavorites().includes(id)
    ? getFavorites().filter((item) => item !== id)
    : [...getFavorites(), id]
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(next))
  window.dispatchEvent(new Event("tools-storage"))
  return next
}

export const addRecent = (id: string) => {
  const next = [id, ...getRecents().filter((item) => item !== id)].slice(0, 4)
  localStorage.setItem(RECENTS_KEY, JSON.stringify(next))
  window.dispatchEvent(new Event("tools-storage"))
}
