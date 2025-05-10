export const url = {
  serverlessApiUrl: 'http://localhost:8090',
  User: {
    login: '/api/user/login',
    register: '/api/user/register'
  },
  Clazz: {
    listClassOverview: '/api/class/listClassOverview',
    getClassInfo: '/api/class/getClassInfo',
    deleteClass: '/api/class/deleteClass',
    updateClassInfo: '/api/class/updateClassInfo',
    listClassOverviewPage: '/api/class/listClassOverviewPage'
  },
  Student: {
    listStudentOverview: '/api/student/listStudentOverview',
    listStudentOverviewPage: '/api/student/listStudentOverviewPage',
    createStudent: '/api/student/createStudent',
    deleteStudent: '/api/student/deleteStudent',
    updateStudent: '/api/student/updateStudent',
    getStudentInfo: '/api/student/getStudentInfo/',
    downloadTemplate: '/api/student/download-template',
    importData: '/api/student/import'
  },
  Course: {
    listCourseOverviewPage: '/api/course/listCourseOverviewPage',
    getCourseDetail: '/api/course/getCourseDetail',
    deleteCourse: '/api/course/deleteCourse',
    generateCourseBaseInfo: '/api/course/generateCourseBaseInfo',
    updateCourse: '/api/course/updateCourse',
    createCourse: '/api/course/createCourse',
    createCourseFirst: '/api/course/createCourseFirst',
    updateCourseFirst: '/api/course/updateCourseFirst',
    generateCourseObjectives: '/api/course/generateCourseObjectives',
    createOrUpdateCourseSecond: '/api/course/createOrUpdateCourseSecond',
    createOrUpdateCourseThird: '/api/course/createOrUpdateCourseThird',
    generateCourseActivities: '/api/course/generateCourseActivities'
  },
  School: {
    listSchoolOverviewPage: '/api/school/listSchoolOverviewPage',
    createSchool: '/api/school/createSchool',
    deleteSchool: '/api/school/deleteSchool',
    updateSchool: '/api/school/updateSchool'
  },
  WeeklyPlan: {
    listWeeklyPlanPage: '/api/weeklyPlan/listWeeklyPlanPage',
    createWeeklyPlan: '/api/weeklyPlan/createWeeklyPlan',
    deleteWeeklyPlan: '/api/weeklyPlan/deleteWeeklyPlan',
    updateWeeklyPlan: '/api/weeklyPlan/updateWeeklyPlan',
    getWeeklyPlanDetail: '/api/weeklyPlan/getWeeklyPlanDetail'
  }
}
