import request from '@/utils/request'
import { url } from '@/api/url'

export const School = {
  listSchoolOverview(params) {
    return request({
      url: url.School.listSchoolOverviewPage,
      method: 'get',
      params: params
    })
  }
}
