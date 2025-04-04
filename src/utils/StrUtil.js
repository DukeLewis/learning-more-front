/**
 * 从字符串中解析属性并分配给目标对象
 * @param {Array<{sourceKey: string, targetProp: string}>} propMappings - 源键和目标属性的映射
 * @param {string} sourceString - 包含键值对的源字符串
 * @returns {Object} 包含目标属性和值的对象
 */
export function assignProperties(propMappings, sourceString) {
  // sourceString = sourceString.replace(/\\LINE\/\//g, '\n')
  const parseData = {}

  // 如果源字符串不存在或非字符串，返回空对象
  if (!sourceString || typeof sourceString !== 'string') {
    return parseData
  }

  // 分割字符串为行
  const lines = sourceString.split('\n')

  // 遍历每一行
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()

    // 跳过空行
    if (!line) continue

    // 查找第一个冒号或首次出现"："的位置
    const colonIndex = line.indexOf(':')

    if (colonIndex !== -1) {
      // 提取键和值
      const key = line.substring(0, colonIndex).trim().toLowerCase()
      let value = line.substring(colonIndex + 1).trim()

      // 检查这个键是否在我们的映射中
      const mapping = propMappings.find(map => map.sourceKey.toLowerCase() === key)

      if (mapping) {
        // 对于像日期这样的特殊处理
        if (key.includes('time') && !isNaN(Date.parse(value))) {
          value = new Date(value)
        }
        // 对于可能是数字的值进行转换
        else if (!isNaN(value) && value !== '') {
          value = Number(value)
        }

        // 分配值到目标属性
        parseData[mapping.targetProp] = value
      }
    }
  }

  return parseData
}
