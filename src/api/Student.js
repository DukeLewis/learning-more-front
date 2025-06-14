import request from '@/utils/request'
import { url } from '@/api/url'

export const Student = {
  listStudentOverview(params) {
    return request({
      url: url.Student.listStudentOverview,
      method: 'get',
      params: params
    })
  },
  fetchList(params) {
    return request({
      url: url.Student.listStudentOverviewPage,
      method: 'get',
      params: params
    })
  },
  createStudent(data) {
    return request({
      url: url.Student.createStudent,
      method: 'post',
      data: data
    })
  },
  deleteStudent(params) {
    return request({
      url: url.Student.deleteStudent,
      method: 'delete',
      params: params
    })
  },
  updateStudent(data) {
    return request({
      url: url.Student.updateStudent,
      method: 'put',
      data: data
    })
  },
  getStudentDetailById(id) {
    return request({
      url: `${url.Student.getStudentInfo}${id}`,
      method: 'get'
    })
  },
  downloadTemplate() {
    return request({
      url: url.Student.downloadTemplate,
      method: 'get',
      responseType: 'blob'
    })
  },
  importStudents(data) {
    return request({
      url: url.Student.importData,
      method: 'post',
      data: data
    })
  }
}
