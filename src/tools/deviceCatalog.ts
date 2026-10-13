export type DevicePlatform = "Android" | "iOS" | "HarmonyOS"

export interface DeviceModel {
  id: string
  name: string
  manufacturer: string
  platform: DevicePlatform
  system: string
  apiLevel: string
  supportsOaid: boolean
  supportsGaid: boolean
}

export interface DeviceBrand {
  id: string
  name: string
  models: DeviceModel[]
}

const android = (id: string, name: string, manufacturer: string, system: string, supportsOaid = true, supportsGaid = true): DeviceModel => ({
  id, name, manufacturer, platform: "Android", system, apiLevel: "36", supportsOaid, supportsGaid,
})

const ios = (id: string, name: string): DeviceModel => ({
  id, name, manufacturer: "Apple", platform: "iOS", system: "iOS 27", apiLevel: "—", supportsOaid: false, supportsGaid: false,
})

const harmony = (id: string, name: string, system: string): DeviceModel => ({
  id, name, manufacturer: "HUAWEI", platform: "HarmonyOS", system, apiLevel: "—", supportsOaid: true, supportsGaid: false,
})

export const deviceBrands: DeviceBrand[] = [
  {
    id: "apple", name: "Apple", models: [
      ios("iphone-18-pro-max", "iPhone 18 Pro Max"),
      ios("iphone-18-pro", "iPhone 18 Pro"),
      ios("iphone-duo", "iPhone Duo"),
      ios("iphone-17-pro-max", "iPhone 17 Pro Max"),
      ios("iphone-16-pro-max", "iPhone 16 Pro Max"),
    ],
  },
  {
    id: "huawei", name: "华为", models: [
      harmony("huawei-pura-90-pro-max", "HUAWEI Pura 90 Pro Max", "HarmonyOS 6.1"),
      harmony("huawei-pura-90", "HUAWEI Pura 90", "HarmonyOS 6.1"),
      harmony("huawei-mate-80-pro-max", "HUAWEI Mate 80 Pro Max", "HarmonyOS 6"),
      harmony("huawei-mate-80", "HUAWEI Mate 80", "HarmonyOS 6"),
      harmony("huawei-pura-80-ultra", "HUAWEI Pura 80 Ultra", "HarmonyOS 5.1"),
    ],
  },
  {
    id: "xiaomi", name: "小米 / REDMI", models: [
      android("xiaomi-17", "Xiaomi 17", "Xiaomi", "Xiaomi HyperOS 3"),
      android("xiaomi-15-ultra", "Xiaomi 15 Ultra", "Xiaomi", "Xiaomi HyperOS 3"),
      android("redmi-k90-pro-max", "REDMI K90 Pro Max", "Xiaomi", "Xiaomi HyperOS 3"),
      android("redmi-k90", "REDMI K90", "Xiaomi", "Xiaomi HyperOS 3"),
      android("redmi-k80-pro", "REDMI K80 Pro", "Xiaomi", "Xiaomi HyperOS 2"),
    ],
  },
  {
    id: "oppo", name: "OPPO", models: [
      android("oppo-find-x9-pro", "OPPO Find X9 Pro", "OPPO", "ColorOS 16"),
      android("oppo-find-x9", "OPPO Find X9", "OPPO", "ColorOS 16"),
      android("oppo-reno15-pro", "OPPO Reno15 Pro", "OPPO", "ColorOS 16"),
      android("oppo-reno15", "OPPO Reno15", "OPPO", "ColorOS 16"),
    ],
  },
  {
    id: "vivo", name: "vivo", models: [
      android("vivo-x300-ultra", "vivo X300 Ultra", "vivo", "OriginOS 6"),
      android("vivo-x300-pro", "vivo X300 Pro", "vivo", "OriginOS 6"),
      android("vivo-x300", "vivo X300", "vivo", "OriginOS 6"),
      android("vivo-s50-pro-mini", "vivo S50 Pro mini", "vivo", "OriginOS 6"),
      android("vivo-s50", "vivo S50", "vivo", "OriginOS 6"),
    ],
  },
  {
    id: "honor", name: "荣耀", models: [
      android("honor-magic8-pro", "荣耀 Magic8 Pro", "HONOR", "MagicOS 10"),
      android("honor-magic8", "荣耀 Magic8", "HONOR", "MagicOS 10"),
      android("honor-magic-v5", "荣耀 Magic V5", "HONOR", "MagicOS 9"),
      android("honor-500-pro", "荣耀 500 Pro", "HONOR", "MagicOS 10"),
    ],
  },
  {
    id: "samsung", name: "三星", models: [
      android("samsung-s26-ultra", "Samsung Galaxy S26 Ultra", "Samsung", "One UI 8.5"),
      android("samsung-s26-plus", "Samsung Galaxy S26+", "Samsung", "One UI 8.5"),
      android("samsung-z-fold7", "Samsung Galaxy Z Fold7", "Samsung", "One UI 8"),
      android("samsung-s25-ultra", "Samsung Galaxy S25 Ultra", "Samsung", "One UI 8"),
    ],
  },
  {
    id: "google", name: "Google", models: [
      android("google-pixel-10-pro-xl", "Google Pixel 10 Pro XL", "Google", "Android 16", false),
      android("google-pixel-10-pro", "Google Pixel 10 Pro", "Google", "Android 16", false),
      android("google-pixel-10", "Google Pixel 10", "Google", "Android 16", false),
      android("google-pixel-9a", "Google Pixel 9a", "Google", "Android 16", false),
    ],
  },
]

export const allDeviceModels = deviceBrands.flatMap((brand) => brand.models.map((model) => ({ ...model, brand: brand.name, brandId: brand.id })))

export type CatalogDevice = (typeof allDeviceModels)[number]
