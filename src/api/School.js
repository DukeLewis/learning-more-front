import request from '@/utils/request'
import { url } from '@/api/url'

export const School = {
  listSchoolOverview(params) {
    return request({
      url: url.School.listSchoolOverviewPage,
      method: 'get',
      params: params
    })
  },
  createSchool(data) {
    return request({
      url: url.School.createSchool,
      method: 'post',
      data: data
    })
  },
  deleteSchool(params) {
    return request({
      url: url.School.deleteSchool,
      method: 'delete',
      params: params
    })
  },
  updateSchool(data) {
    return request({
      url: url.School.updateSchool,
      method: 'put',
      data: data
    })
  }
}
