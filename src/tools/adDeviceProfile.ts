import type { CatalogDevice } from "./deviceCatalog"

const DIGITS = "0123456789"
const HEX = "0123456789abcdef"
const SERIAL_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
const TCF_CONSENT = "CPXxRfAPXxRfAAfKABENB-CgAAAAAAAAAAYgAAAAAAAA"
const GPP_STRING = `DBACNY~${TCF_CONSENT}~1YNN`

const carriers = [
  { name: "China Mobile", mccmnc: "460-00", iccidPrefix: "898600" },
  { name: "China Unicom", mccmnc: "460-01", iccidPrefix: "898601" },
  { name: "China Telecom", mccmnc: "460-03", iccidPrefix: "898603" },
  { name: "China Broadnet", mccmnc: "460-15", iccidPrefix: "898615" },
] as const

const locations = [
  { lat: 39.9042, lon: 116.4074, country: "CHN", region: "BJ", metro: "0", city: "Beijing", zip: "100000", utcoffset: 480 },
  { lat: 31.2304, lon: 121.4737, country: "CHN", region: "SH", metro: "0", city: "Shanghai", zip: "200000", utcoffset: 480 },
  { lat: 23.1291, lon: 113.2644, country: "CHN", region: "GD", metro: "0", city: "Guangzhou", zip: "510000", utcoffset: 480 },
  { lat: 22.5431, lon: 114.0579, country: "CHN", region: "GD", metro: "0", city: "Shenzhen", zip: "518000", utcoffset: 480 },
] as const

const appTemplates = [
  { name: "星云天气", packageName: "com.example.nebula.weather", domain: "weather.example", cat: ["IAB15"], keywords: ["天气", "生活", "工具"] },
  { name: "轻阅资讯", packageName: "com.example.breeze.news", domain: "news.example", cat: ["IAB12"], keywords: ["资讯", "阅读", "热点"] },
  { name: "拾光视频", packageName: "com.example.moment.video", domain: "video.example", cat: ["IAB1-5"], keywords: ["视频", "娱乐", "短片"] },
] as const

function randomBytes(length: number) {
  return crypto.getRandomValues(new Uint8Array(length))
}

function randomIndex(length: number) {
  return randomBytes(1)[0] % length
}

function randomInteger(min: number, max: number) {
  return min + randomIndex(max - min + 1)
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
  return `${body}${(10 - (sum % 10)) % 10}`
}

function createImeiPair() {
  const tac = randomFrom("123456789", 1) + randomDigits(7)
  const serial = randomDigits(6)
  const secondSerial = ((Number(serial) + 1) % 1_000_000).toString().padStart(6, "0")
  return [appendLuhnCheckDigit(tac + serial), appendLuhnCheckDigit(tac + secondSerial)] as const
}

function createMacAddress() {
  const bytes = randomBytes(6)
  bytes[0] = (bytes[0] | 0x02) & 0xfe
  return [...bytes].map((value) => value.toString(16).padStart(2, "0").toUpperCase()).join(":")
}

function systemVersion(device: CatalogDevice) {
  if (device.platform === "Android") return "16"
  return device.system.match(/\d+(?:\.\d+)*/)?.[0] ?? "1"
}

function screenFor(device: CatalogDevice) {
  if (/Fold|Magic V|Duo/i.test(device.name)) return { w: 1968, h: 2184, ppi: 400, pxratio: 2.5 }
  if (device.platform === "iOS") return { w: 1290, h: 2796, ppi: 460, pxratio: 3 }
  return { w: 1220, h: 2712, ppi: 450, pxratio: 3 }
}

function userAgentFor(device: CatalogDevice, osv: string) {
  if (device.platform === "iOS") {
    return `Mozilla/5.0 (iPhone; CPU iPhone OS ${osv.replace(/\./g, "_")} like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/${osv} Mobile/15E148 Safari/604.1`
  }
  if (device.platform === "HarmonyOS") {
    return `Mozilla/5.0 (Linux; HarmonyOS ${osv}; ${device.name}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile HuaweiBrowser/16.0 Safari/537.36`
  }
  return `Mozilla/5.0 (Linux; Android ${osv}; ${device.name}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36`
}

function structuredUserAgent(device: CatalogDevice, osv: string) {
  const isIos = device.platform === "iOS"
  const isHarmony = device.platform === "HarmonyOS"
  return {
    browsers: isIos
      ? [{ brand: "Mobile Safari", version: [osv] }, { brand: "WebKit", version: ["605", "1", "15"] }]
      : [{ brand: isHarmony ? "Huawei Browser" : "Chrome", version: isHarmony ? ["16", "0"] : ["140", "0", "0", "0"] }, { brand: "Chromium", version: ["140", "0", "0", "0"] }],
    platform: { brand: device.platform, version: osv.split(".") },
    mobile: 1,
    architecture: "arm",
    bitness: "64",
    model: device.name,
    source: 1,
    ext: { simulated: true },
  }
}

function createIdentifiers(device: CatalogDevice, carrier: typeof carriers[number]) {
  const [imei, imei2] = createImeiPair()
  const isIos = device.platform === "iOS"
  const isAndroid = device.platform === "Android"
  const oaid = device.supportsOaid ? crypto.randomUUID() : undefined
  const gaid = device.supportsGaid ? crypto.randomUUID() : undefined
  const idfa = isIos ? crypto.randomUUID().toUpperCase() : undefined
  const idfv = isIos ? crypto.randomUUID().toUpperCase() : undefined
  const androidId = isAndroid ? randomHex(16) : undefined
  const appSetId = isAndroid ? crypto.randomUUID() : undefined

  return {
    primary: oaid ?? gaid ?? idfa ?? crypto.randomUUID(),
    type: oaid ? "oaid" : gaid ? "gaid" : idfa ? "idfa" : "session",
    values: {
      imei,
      imei2,
      meid: randomHex(14).toUpperCase(),
      serialNumber: randomFrom(SERIAL_CHARS, 12),
      imsi: `${carrier.mccmnc.replace("-", "")}${randomDigits(10)}`,
      iccid: appendLuhnCheckDigit(`${carrier.iccidPrefix}${randomDigits(19 - carrier.iccidPrefix.length)}`),
      mac: createMacAddress(),
      wifiMac: createMacAddress(),
      bluetoothMac: createMacAddress(),
      wifiSsid: "TestLab_5G",
      wifiBssid: createMacAddress(),
      ...(oaid ? { oaid, vaid: crypto.randomUUID(), msaAaid: crypto.randomUUID(), udid: randomHex(40) } : {}),
      ...(androidId ? { androidId, appSetId, appSetIdScope: "developer" } : {}),
      ...(gaid ? { gaid } : {}),
      ...(idfa && idfv ? { idfa, idfv } : {}),
    },
  }
}

function createPrivacy(device: CatalogDevice) {
  if (device.platform === "iOS") {
    return {
      attStatus: "authorized",
      trackingAuthorized: true,
      limitAdTracking: false,
    }
  }
  return {
    adTrackingLimited: false,
    adPersonalizationEnabled: true,
    ...(device.supportsOaid ? { oaidLimited: false, oaidProvider: device.platform === "HarmonyOS" ? "HMS Core" : "MSA" } : {}),
  }
}

function createHardware(device: CatalogDevice) {
  const isIos = device.platform === "iOS"
  const ramGb = isIos ? 8 : randomInteger(12, 16)
  const storageGb = [256, 512, 1024][randomIndex(3)]
  const productToken = device.id.replace(/-/g, "_")
  return {
    brand: device.brand,
    manufacturer: device.manufacturer,
    deviceName: device.name,
    deviceCodename: productToken,
    productName: productToken,
    board: isIos ? "D94AP" : `${device.brandId}_board`,
    buildId: isIos ? `23A${randomDigits(3)}` : `BP2A.${randomDigits(6)}.${randomDigits(3)}`,
    buildFingerprint: `${device.manufacturer.toLowerCase()}/${productToken}/${productToken}:16/BP2A.${randomDigits(6)}.${randomDigits(3)}/user/release-keys`,
    bootloader: isIos ? "iBoot-11881.0.0" : `${device.brandId}-boot-${randomDigits(4)}`,
    baseband: `MOLY.${randomFrom("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 10)}`,
    securityPatch: "2026-09-01",
    cpuArchitecture: "arm64",
    cpuAbi: "arm64-v8a",
    cpuCores: 8,
    totalRam: ramGb * 1024 ** 3,
    availableRam: Math.floor(ramGb * 0.62 * 1024 ** 3),
    totalStorage: storageGb * 1024 ** 3,
    availableStorage: Math.floor(storageGb * 0.71 * 1024 ** 3),
    batteryLevel: randomInteger(35, 96),
    isCharging: randomIndex(2) === 1,
    timezone: "Asia/Shanghai",
    locale: "zh-CN",
    sensorList: ["accelerometer", "gyroscope", "magnetometer", "proximity", "ambient_light", "barometer"],
  }
}

function createRisk(device: CatalogDevice) {
  return {
    isEmulator: false,
    isRooted: false,
    isJailbroken: false,
    isDebuggerAttached: false,
    isDeveloperMode: false,
    isUsbDebugging: false,
    isBootloaderUnlocked: false,
    isVpn: false,
    isProxy: false,
    isTor: false,
    isMockLocation: false,
    isAppCloned: false,
    isTampered: false,
    integrityVerdict: "MEETS_DEVICE_INTEGRITY",
    deviceIntegrity: true,
    appIntegrity: "RECOGNIZED",
    installSource: device.platform === "iOS" ? "Apple App Store" : device.platform === "HarmonyOS" ? "HUAWEI AppGallery" : "Google Play",
  }
}

function createApp(device: CatalogDevice, requestId: string, sessionId: string) {
  const template = appTemplates[randomIndex(appTemplates.length)]
  const appleStoreId = randomFrom("123456789", 1) + randomDigits(9)
  const storeId = device.platform === "iOS" ? appleStoreId : template.packageName
  const storeurl = device.platform === "iOS"
    ? `https://apps.apple.com/app/id${appleStoreId}`
    : device.platform === "HarmonyOS"
      ? `https://appgallery.huawei.com/app/${randomFrom("C123456789", 10)}`
      : `https://play.google.com/store/apps/details?id=${template.packageName}`

  return {
    id: crypto.randomUUID(),
    name: template.name,
    bundle: storeId,
    storeid: storeId,
    domain: template.domain,
    storeurl,
    cattax: 1,
    cat: [...template.cat],
    sectioncat: ["IAB1"],
    pagecat: ["IAB1-5"],
    ver: `${randomInteger(2, 6)}.${randomInteger(0, 9)}.${randomInteger(0, 12)}`,
    privacypolicy: 1,
    paid: 0,
    publisher: {
      id: "pub-example-001",
      name: "示例媒体科技",
      cat: ["IAB1"],
      domain: "publisher.example",
      ext: { simulated: true },
    },
    content: {
      id: "home-feed",
      title: "首页信息流",
      context: 1,
      cat: ["IAB1-5"],
      langb: "zh-CN",
      livestream: 0,
      ext: { simulated: true },
    },
    kwarray: [...template.keywords],
    inventorypartnerdomain: "inventory.example",
    ext: {
      packageName: template.packageName,
      sdk: { name: "ExampleAdsSDK", version: "6.4.0" },
      omidpn: "ExampleAdsSDK",
      omidpv: "1.5.0",
      requestId,
      sessionId,
      simulated: true,
    },
  }
}

export function createAdDeviceProfile(device: CatalogDevice) {
  const carrier = carriers[randomIndex(carriers.length)]
  const location = locations[randomIndex(locations.length)]
  const osv = systemVersion(device)
  const screen = screenFor(device)
  const identifiers = createIdentifiers(device, carrier)
  const requestId = crypto.randomUUID()
  const sessionId = crypto.randomUUID()
  const connectiontype = [2, 6, 7][randomIndex(3)]

  return {
    device: {
      geo: {
        ...location,
        type: 1,
        accuracy: randomInteger(8, 40),
        lastfix: randomInteger(1, 15),
        ipservice: 3,
        ext: { simulated: true },
      },
      dnt: 0,
      lmt: 0,
      ua: userAgentFor(device, osv),
      sua: structuredUserAgent(device, osv),
      ip: `198.51.100.${randomInteger(1, 254)}`,
      ipv6: `2001:db8:${randomHex(4)}:${randomHex(4)}::${randomHex(4)}`,
      devicetype: 1,
      make: device.manufacturer,
      model: device.name,
      os: device.platform,
      osv,
      hwv: device.name,
      ...screen,
      js: 1,
      geofetch: 1,
      flashver: "0",
      langb: "zh-CN",
      carrier: carrier.name,
      mccmnc: carrier.mccmnc,
      connectiontype,
      ifa: identifiers.primary,
      ext: {
        ifa_type: identifiers.type,
        orientation: "portrait",
        roaming: false,
        apiLevel: device.apiLevel,
        system: device.system,
        identifiers: identifiers.values,
        hardware: createHardware(device),
        privacy: createPrivacy(device),
        risk: createRisk(device),
        simulated: true,
      },
    },
    app: createApp(device, requestId, sessionId),
    regs: {
      coppa: 0,
      gdpr: 1,
      gpp: GPP_STRING,
      gpp_sid: [2, 6],
      ext: { simulated: true },
    },
    user: {
      id: crypto.randomUUID(),
      consent: TCF_CONSENT,
      eids: [{
        source: "id.example",
        inserter: "publisher.example",
        matcher: "id.example",
        mm: 0,
        uids: [{ id: crypto.randomUUID(), atype: 3 }],
      }],
      ext: { simulated: true },
    },
    request: {
      requestId,
      sessionId,
      generatedAt: new Date().toISOString(),
      simulated: true,
    },
  }
}
