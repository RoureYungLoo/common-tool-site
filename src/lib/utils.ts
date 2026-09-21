export const copyText = async (text: string) => {
  await navigator.clipboard.writeText(text)
}

export const encodeBase64 = (value: string) => {
  const bytes = new TextEncoder().encode(value)
  let binary = ""
  bytes.forEach((byte) => (binary += String.fromCharCode(byte)))
  return btoa(binary)
}

export const decodeBase64 = (value: string) => {
  const binary = atob(value.trim())
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

export const base64UrlDecode = (value: string) => {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/")
  return decodeBase64(normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "="))
}
