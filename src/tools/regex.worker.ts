interface RegexRequest {
  pattern: string
  text: string
  flags: string
}

self.onmessage = (event: MessageEvent<RegexRequest>) => {
  try {
    const { pattern, text, flags } = event.data
    const expression = new RegExp(pattern, flags.includes("g") ? flags : `${flags}g`)
    const output: string[] = []
    let count = 0
    let outputLength = 0
    let truncated = false
    for (const match of text.matchAll(expression)) {
      count++
      const block = [
        `#${count} 位置 ${match.index}`,
        `完整匹配: ${match[0]}`,
        ...match.slice(1).map((group, groupIndex) => `分组 ${groupIndex + 1}: ${group ?? ""}`),
      ].join("\n")
      output.push(block)
      outputLength += block.length
      if (count >= 500 || outputLength > 100_000) {
        truncated = true
        break
      }
    }
    self.postMessage({
      error: "",
      output: count ? `${output.join("\n\n")}${truncated ? "\n\n结果过多，仅显示前 500 项或 100 KB。" : ""}` : "没有匹配结果",
      count,
    })
  } catch (reason) {
    self.postMessage({ error: reason instanceof Error ? reason.message : "正则表达式无效", output: "", count: 0 })
  }
}
