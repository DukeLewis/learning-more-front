/**
 * 将字符串中的键值对赋值到一个新对象中
 * @param {Array} mappings - 属性映射数组，每个元素是一个对象，包含 sourceKey 和 targetProp
 * @param {String} str - 包含键值对的字符串
 * @returns {Object} - 包含解析后键值对的新对象
 */
export function assignProperties(mappings, str) {
  // 创建一个新的对象来存储解析后的数据
  const newObj = {}

  // 按行分割字符串
  const lines = str.split('\n')

  // 遍历每一行
  for (let line of lines) {
    // 去除首尾空白字符
    line = line.trim()

    // 跳过空行
    if (line === '') continue

    // 查找第一个冒号的位置
    const colonIndex = line.indexOf(':')

    if (colonIndex === -1) {
      // 如果没有冒号，跳过该行
      continue
    }

    // 提取键和值
    const key = line.substring(0, colonIndex).trim()
    const value = line.substring(colonIndex + 1).trim()

    // 遍历映射，寻找匹配的 sourceKey
    for (const mapping of mappings) {
      if (mapping.sourceKey === key) {
        // 找到匹配项，赋值到新对象的 targetProp
        newObj[mapping.targetProp] = value
        break // 假设每个键唯一，找到后跳出内层循环
      }
    }
  }

  return newObj
}
