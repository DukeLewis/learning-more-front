
export const url = {
  serverlessApiUrl: 'http://localhost:8090',
  User: {
    login: '/user/login',
    register: '/user/register'
  },
  Clazz: {
    listClassOverview: '/api/class/listClassOverview',
    getClassInfo: '/api/class/getClassInfo',
    deleteClass: '/api/class/deleteClass',
    updateClassInfo: '/api/class/updateClassInfo'
  },
  Student: {
    listStudentOverview: '/api/student/listStudentOverview',
    listStudentOverviewPage: '/api/student/listStudentOverviewPage',
    createStudent: '/api/student/createStudent',
    deleteStudent: '/api/student/deleteStudent',
    updateStudent: '/api/student/updateStudent'
  },
  Course: {
    listCourseOverviewPage: '/api/course/listCourseOverviewPage',
    getCourseDetail: '/api/course/getCourseDetail',
    deleteCourse: '/api/course/deleteCourse',
    generateCourseBaseInfo: '/api/course/generateCourseBaseInfo'
  },
  School: {
    listSchoolOverviewPage: '/api/school/listSchoolOverviewPage',
    createSchool: '/api/school/createSchool',
    deleteSchool: '/api/school/deleteSchool',
    updateSchool: '/api/school/updateSchool'
  }
}
