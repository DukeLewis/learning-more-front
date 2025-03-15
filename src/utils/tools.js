export function objToUrlParams(obj) {
  if (!obj) {
    return ''
  }
  let params = ''
  for (const key in obj) {
    params += key + '=' + obj[key] + '&'
  }
  return '?' + params.substring(0, params.length - 1)
}
