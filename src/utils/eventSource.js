import { fetchEventSource } from '\@microsoft/fetch-event-source'
import { getToken } from '@/utils/auth'
import { url } from '@/api/url'
import { objToUrlParams } from '@/utils/tools'

export const createEventSource = (path, params, _onmessage, method, body) => {
  // 默认为 GET 请求
  method = method || 'GET'
  // body 序列化
  if (body) {
    body = JSON.stringify(body)
  }
  let retryCount = 0 // 重试次数
  const maxRetryCount = 3 // 最大重试次数
  const controller = new AbortController() // 创建 AbortController 实例
  // 错误类型，用于判断是否需要重试
  class RetrievableError extends Error {
  }

  class FatalError extends Error {
  }

  return new Promise((resolve, reject) => {
    // 返回参数信息
    let resultParams = null
    // 发起请求
    fetchEventSource(url.serverlessApiUrl + path + objToUrlParams(params), {
      method: method,
      headers: {
        'Content-Type': 'application/json', // 数据格式
        'Accept': 'text/event-stream',
        // 'X-LG-Platform': 'web', // 平台
        // 'X-UID': store.state.user.uid, // 用户 ID
        'X-Token': getToken() // token
      },
      body: body,
      openWhenHidden: true, // 允许后台运行
      signal: controller.signal,
      onopen(response) {
        // 返回数据类型
        const contentType = response && response.headers ? response.headers.get('content-type') : null
        // 是否为 text/event-stream 类型
        const contentTypeError = !contentType || (contentType.toLowerCase() !== 'text/event-stream' && contentType.toLowerCase() !== 'text/event-stream;charset=utf-8')
        if (response.ok && !contentTypeError) {
          // 没有错误
          return
        } else if (response.status >= 400 && response.status < 500 && response.status !== 429) {
          // 服务器错误，不需要重试
          throw new FatalError()
        } else {
          // 其他错误，需要重试
          throw new RetrievableError()
        }
      },
      onmessage(message) {
        if (message.event === 'ERROR') {
          throw new FatalError(message.data)
        }
        // 参数类型
        if (message.event === 'PARAM') {
          resultParams = JSON.parse(message.data)
          return
        }
        if (message.event === 'CLOSE') {
          console.log('收到关闭指令，关闭 SSE 连接')
          controller.abort() // 终止 SSE 连接
          resolve(resultParams)
          return
        }
        if (message && message.data) {
          // message.data = message.data.substring(0, message.data.length).replace(/\\n/g, '\n')
          // message.data = message.data.substring(0, message.data.length).replace(/\\LINE\/\//g, '\n')
          _onmessage(message)
        }
      },
      onclose() {
        // 连接关闭
        console.log('event source closed.')
        resolve(resultParams)
      },
      onerror(error) {
        // 所有错误都再重试 3 次
        console.log('event source error: ', error)
        // 增加重试次数
        retryCount++
        if (retryCount > maxRetryCount) {
          // 超过最大重试次数，不再重试
          reject(error)
          throw error
        }
        // 重试，默认间隔 1 秒
      }
    })
  })
}
