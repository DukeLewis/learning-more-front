import request from '@/utils/request'
import { url } from '@/api/url'

export const Course = {
  listCourseOverviewPage(params) {
    return request({
      url: url.Course.listCourseOverviewPage,
      method: 'get',
      params: params
    })
  },
  getCourseDetail(params) {
    return request({
      url: url.Course.getCourseDetail,
      method: 'get',
      params: params
    })
  },
  deleteCourse(params) {
    return request({
      url: url.Course.deleteCourse,
      method: 'delete',
      params: params
    })
  }
}
