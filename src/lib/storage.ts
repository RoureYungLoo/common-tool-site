const FAVORITES_KEY = "foldrule-favorites"
const RECENTS_KEY = "foldrule-recents"
const USAGE_KEY = "foldrule-tool-usage"
const memoryStore = new Map<string, string[]>()
const memoryUsageStore: ToolUsage = {}

export interface ToolUsageEntry {
  count: number
  lastUsed: number
}

export type ToolUsage = Record<string, ToolUsageEntry>

const read = (key: string): string[] => {
  try {
    const stored = localStorage.getItem(key)
    if (stored === null) return [...(memoryStore.get(key) ?? [])]
    const parsed: unknown = JSON.parse(stored)
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : []
  } catch {
    return [...(memoryStore.get(key) ?? [])]
  }
}

const write = (key: string, value: string[]) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    memoryStore.set(key, [...value])
    return false
  }
}

export const getFavorites = () => read(FAVORITES_KEY)
export const getRecents = () => read(RECENTS_KEY)
export const getToolUsage = (): ToolUsage => {
  try {
    const stored = localStorage.getItem(USAGE_KEY)
    if (stored === null) return { ...memoryUsageStore }
    const parsed: unknown = JSON.parse(stored)
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {}
    return Object.fromEntries(Object.entries(parsed).filter((entry): entry is [string, ToolUsageEntry] => {
      const value: unknown = entry[1]
      return Boolean(value && typeof value === "object"
        && typeof (value as ToolUsageEntry).count === "number"
        && typeof (value as ToolUsageEntry).lastUsed === "number")
    }))
  } catch {
    return { ...memoryUsageStore }
  }
}

const recordUsage = (id: string) => {
  const usage = getToolUsage()
  usage[id] = { count: (usage[id]?.count ?? 0) + 1, lastUsed: Date.now() }
  try {
    localStorage.setItem(USAGE_KEY, JSON.stringify(usage))
  } catch {
    Object.assign(memoryUsageStore, usage)
  }
}

export const toggleFavorite = (id: string) => {
  const next = getFavorites().includes(id)
    ? getFavorites().filter((item) => item !== id)
    : [...getFavorites(), id]
  write(FAVORITES_KEY, next)
  window.dispatchEvent(new Event("tools-storage"))
  return next
}

export const addRecent = (id: string) => {
  const next = [id, ...getRecents().filter((item) => item !== id)].slice(0, 4)
  write(RECENTS_KEY, next)
  recordUsage(id)
  window.dispatchEvent(new Event("tools-storage"))
}
