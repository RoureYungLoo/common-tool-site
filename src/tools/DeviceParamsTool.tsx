import { RefreshCw } from "lucide-react"
import { useMemo, useState } from "react"
import { Button, EditorPanel, Status } from "../components/ui"
import { createAdDeviceProfile } from "./adDeviceProfile"
import { allDeviceModels, deviceBrands } from "./deviceCatalog"

function randomIndex(length: number) {
  return crypto.getRandomValues(new Uint8Array(1))[0] % length
}

function pickDevice(brandId: string, modelId: string) {
  const pool = brandId === "random" ? allDeviceModels : allDeviceModels.filter((device) => device.brandId === brandId)
  return modelId === "random" ? pool[randomIndex(pool.length)] : pool.find((device) => device.id === modelId) ?? pool[0]
}

export default function DeviceParamsTool() {
  const [brandId, setBrandId] = useState("random")
  const [modelId, setModelId] = useState("random")
  const [profile, setProfile] = useState(() => createAdDeviceProfile(pickDevice("random", "random")))
  const availableModels = useMemo(() => deviceBrands.find((brand) => brand.id === brandId)?.models ?? [], [brandId])
  const json = useMemo(() => JSON.stringify(profile, (_key, value) => value === null || value === undefined ? undefined : value, 2), [profile])

  const generate = (nextBrandId = brandId, nextModelId = modelId) => {
    setProfile(createAdDeviceProfile(pickDevice(nextBrandId, nextModelId)))
  }

  const changeBrand = (nextBrandId: string) => {
    const nextModelId = nextBrandId === "random" ? "random" : deviceBrands.find((brand) => brand.id === nextBrandId)?.models[0].id ?? "random"
    setBrandId(nextBrandId)
    setModelId(nextModelId)
    generate(nextBrandId, nextModelId)
  }

  const changeModel = (nextModelId: string) => {
    setModelId(nextModelId)
    generate(brandId, nextModelId)
  }

  return <div className="device-params-layout">
    <div className="device-profile-controls">
      <label><span>品牌</span><select className="select-input" value={brandId} onChange={(event) => changeBrand(event.target.value)}>
        <option value="random">随机品牌</option>
        {deviceBrands.map((brand) => <option key={brand.id} value={brand.id}>{brand.name}</option>)}
      </select></label>
      <label><span>机型</span><select className="select-input" value={modelId} onChange={(event) => changeModel(event.target.value)} disabled={brandId === "random"}>
        <option value="random">随机机型</option>
        {availableModels.map((model) => <option key={model.id} value={model.id}>{model.name}</option>)}
      </select></label>
      <div className="device-params-actions">
        <Button onClick={() => generate()}><RefreshCw size={15} />重新生成</Button>
      </div>
    </div>

    <div className="device-json-panel"><EditorPanel label={`${profile.device.ext.hardware.brand} · ${profile.device.model} · JSON`} value={json} readOnly autoGrow language="json" /></div>

    <div className="device-params-foot">
      <Status>{deviceBrands.length} 个品牌 · {allDeviceModels.length} 款机型 · 广告设备全量参数</Status>
      <p>设备、App、隐私与风控信息均为模拟测试数据；已排除 OpenRTB 废弃的设备标识哈希字段，请勿用于真实设备识别或身份冒用。</p>
    </div>
  </div>
}
