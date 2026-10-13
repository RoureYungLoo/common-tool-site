import { md5 } from "@noble/hashes/legacy.js"
import { bytesToHex, utf8ToBytes } from "@noble/hashes/utils.js"
import type { CatalogDevice } from "./deviceCatalog"

const DIGITS = "0123456789"
const HEX = "0123456789abcdef"

const locations = [
  { lon: 116.4074, lat: 39.9042 },
  { lon: 121.4737, lat: 31.2304 },
  { lon: 113.2644, lat: 23.1291 },
  { lon: 114.0579, lat: 22.5431 },
] as const

const apps = [
  { name: "星云天气", bundle: "com.example.nebula.weather" },
  { name: "轻阅资讯", bundle: "com.example.breeze.news" },
  { name: "拾光视频", bundle: "com.example.moment.video" },
] as const

function randomBytes(length: number) {
  return crypto.getRandomValues(new Uint8Array(length))
}

function randomInteger(min: number, max: number) {
  const value = crypto.getRandomValues(new Uint32Array(1))[0]
  return min + value % (max - min + 1)
}

function randomIndex(length: number) {
  return randomInteger(0, length - 1)
}

function randomFrom(characters: string, length: number) {
  return Array.from(randomBytes(length), (value) => characters[value % characters.length]).join("")
}

function randomDigits(length: number) {
  return randomFrom(DIGITS, length)
}

function randomHex(length: number) {
  return randomFrom(HEX, length)
}

function appendLuhnCheckDigit(body: string) {
  const sum = [...body].reverse().reduce((total, character, index) => {
    let digit = Number(character)
    if (index % 2 === 0) {
      digit *= 2
      if (digit > 9) digit -= 9
    }
    return total + digit
  }, 0)
  return `${body}${(10 - sum % 10) % 10}`
}

function createImei() {
  return appendLuhnCheckDigit(`${randomFrom("123456789", 1)}${randomDigits(13)}`)
}

function createMac() {
  const bytes = randomBytes(6)
  bytes[0] = (bytes[0] | 0x02) & 0xfe
  return [...bytes].map((value) => value.toString(16).padStart(2, "0").toUpperCase()).join(":")
}

function withMd5<Key extends string>(key: Key, value: string) {
  return { [key]: value, [`${key}_md5`]: bytesToHex(md5(utf8ToBytes(value))) } as Record<Key | `${Key}_md5`, string>
}

function createGeo() {
  const base = locations[randomIndex(locations.length)]
  return {
    lon: Number((base.lon + randomInteger(-15000, 15000) / 1_000_000).toFixed(6)),
    lat: Number((base.lat + randomInteger(-15000, 15000) / 1_000_000).toFixed(6)),
  }
}

function createApp() {
  const app = apps[randomIndex(apps.length)]
  return {
    ...app,
    version: `${randomInteger(1, 8)}.${randomInteger(0, 9)}.${randomInteger(0, 20)}`,
  }
}

function createUserAgent(device: CatalogDevice) {
  const version = device.platform === "Android" ? "16" : device.system.match(/\d+(?:\.\d+)*/)?.[0] ?? "1"
  if (device.platform === "iOS") {
    return `Mozilla/5.0 (iPhone; CPU iPhone OS ${version.replace(/\./g, "_")} like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/${version} Mobile/15E148 Safari/604.1`
  }
  if (device.platform === "HarmonyOS") {
    return `Mozilla/5.0 (Linux; HarmonyOS ${version}; ${device.name}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile HuaweiBrowser/16.0 Safari/537.36`
  }
  return `Mozilla/5.0 (Linux; Android ${version}; ${device.name} Build/BP2A.260905.003; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/140.0.0.0 Mobile Safari/537.36`
}

export function createSimpleDeviceProfile(device: CatalogDevice) {
  const isIos = device.platform === "iOS"
  const isAndroid = device.platform === "Android"
  const hasMobileHardwareIds = !isIos
  const imei = hasMobileHardwareIds ? createImei() : undefined
  const android = isAndroid ? randomHex(16) : undefined
  const oaid = device.supportsOaid ? crypto.randomUUID() : undefined
  const mac = hasMobileHardwareIds ? createMac() : undefined
  const idfa = isIos ? crypto.randomUUID().toUpperCase() : undefined

  return {
    ua: createUserAgent(device),
    ...(imei ? withMd5("imei", imei) : {}),
    ...(android ? withMd5("android", android) : {}),
    ...(oaid ? withMd5("oaid", oaid) : {}),
    ...(mac ? withMd5("mac", mac) : {}),
    ...(idfa ? withMd5("idfa", idfa) : {}),
    ...(isIos ? {
      caid_list: [
        { id: randomHex(32), version: "20230330" },
        { id: randomHex(32), version: "20220111" },
      ],
    } : {}),
    ...(device.supportsGaid ? { gaid: crypto.randomUUID() } : {}),
    ...(isIos ? { paid: randomHex(64), paid_1_4: randomHex(96) } : {}),
    geo: createGeo(),
    app: createApp(),
  }
}
