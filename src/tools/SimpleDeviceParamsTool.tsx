import { RefreshCw } from "lucide-react"
import { useMemo, useState } from "react"
import { Button, EditorPanel, Status } from "../components/ui"
import { allDeviceModels, deviceBrands } from "./deviceCatalog"
import { createSimpleDeviceProfile } from "./simpleDeviceProfile"

function randomIndex(length: number) {
  return crypto.getRandomValues(new Uint32Array(1))[0] % length
}

function pickDevice(brandId: string, modelId: string) {
  const pool = brandId === "random" ? allDeviceModels : allDeviceModels.filter((device) => device.brandId === brandId)
  return modelId === "random" ? pool[randomIndex(pool.length)] : pool.find((device) => device.id === modelId) ?? pool[0]
}

function createResult(brandId: string, modelId: string) {
  const device = pickDevice(brandId, modelId)
  return { device, profile: createSimpleDeviceProfile(device) }
}

export default function SimpleDeviceParamsTool() {
  const [brandId, setBrandId] = useState("random")
  const [modelId, setModelId] = useState("random")
  const [result, setResult] = useState(() => createResult("random", "random"))
  const availableModels = useMemo(() => deviceBrands.find((brand) => brand.id === brandId)?.models ?? [], [brandId])
  const json = useMemo(() => JSON.stringify(result.profile, null, 2), [result])

  const generate = (nextBrandId = brandId, nextModelId = modelId) => {
    setResult(createResult(nextBrandId, nextModelId))
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

    <div className="device-json-panel"><EditorPanel label={`${result.device.brand} · ${result.device.name} · 简版 JSON`} value={json} readOnly autoGrow language="json" /></div>

    <div className="device-params-foot">
      <Status>{deviceBrands.length} 个品牌 · {allDeviceModels.length} 款机型</Status>
      <p>仅生成所选平台可用的模拟标识；CAID、PAID 与 PAID 1.4 仅在 iOS 结果中生成，所有 MD5 均对应同名原始值。</p>
    </div>
  </div>
}
