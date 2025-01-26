import request from '@/utils/request'
import { url } from '@/api/url'

export const Clazz = {
  listClassOverview() {
    return request({
      url: url.Clazz.listClassOverview,
      method: 'get'
    })
  },
  getClassInfo(params) {
    return request({
      url: url.Clazz.getClassInfo,
      method: 'get',
      params: params
    })
  },
  deleteClassInfo(params) {
    return request({
      url: url.Clazz.deleteClass,
      method: 'delete',
      params: params
    })
  },
  updateClassInfo(data) {
    return request({
      url: url.Clazz.updateClassInfo,
      method: 'put',
      data: data
    })
  }
}
