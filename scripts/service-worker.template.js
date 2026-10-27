const CACHE_NAME = "__CACHE_NAME__"
const BASE_PATH = "__BASE_PATH__"
const PRECACHE_URLS = __PRECACHE_URLS__

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => Promise.all(PRECACHE_URLS.map(async (url) => {
        try {
          const response = await fetch(url, { cache: "reload" })
          if (response.ok) await cache.put(url, response)
        } catch {
          // A single unavailable route should not prevent the offline shell from installing.
        }
      }))),
  )
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((names) => Promise.all(names.filter((name) => name.startsWith("common-tool-site-") && name !== CACHE_NAME).map((name) => caches.delete(name))))
      .then(() => self.clients.claim()),
  )
})

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") self.skipWaiting()
})

self.addEventListener("fetch", (event) => {
  const { request } = event
  const url = new URL(request.url)
  if (request.method !== "GET" || url.origin !== self.location.origin || !url.pathname.startsWith(BASE_PATH)) return

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then(async (response) => {
          if (response.ok) {
            const cache = await caches.open(CACHE_NAME)
            await cache.put(request, response.clone())
          }
          return response
        })
        .catch(async () => {
          const exact = await caches.match(request)
          if (exact) return exact
          const routePath = url.pathname.endsWith("/") ? url.pathname : `${url.pathname}/`
          return (await caches.match(routePath)) || caches.match(BASE_PATH)
        }),
    )
    return
  }

  const cacheableAsset = ["script", "style", "image", "font"].includes(request.destination)
  if (!cacheableAsset) return
  event.respondWith(caches.match(request).then((cached) => cached || fetch(request).then(async (response) => {
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME)
      await cache.put(request, response.clone())
    }
    return response
  })))
})
