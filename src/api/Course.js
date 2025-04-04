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
  },
  updateCourse(data) {
    return request({
      url: url.Course.updateCourse,
      method: 'put',
      data: data
    })
  },
  createCourse(data) {
    return request({
      url: url.Course.createCourse,
      method: 'post',
      data: data
    })
  },
  createCourseFirst(data) {
    return request({
      url: url.Course.createCourseFirst,
      method: 'post',
      data: data
    })
  },
  updateCourseFirst(data) {
    return request({
      url: url.Course.updateCourseFirst,
      method: 'put',
      data: data
    })
  }
}
