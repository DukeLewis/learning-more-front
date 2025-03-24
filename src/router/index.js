import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    name: 'Dashboard',
    meta: { title: '导航栏', icon: 'dashboard' },
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/views/home/index'),
        meta: { title: '首页', icon: 'dashboard' }
      },
      {
        path: '/student',
        name: 'Student',
        component: () => import('@/views/student/index'),
        meta: { title: '学生管理', icon: 'el-icon-user' }
      },
      {
        path: '/lesson',
        name: 'Lesson',
        component: () => import('@/views/lesson/index'),
        meta: { title: '课程管理', icon: 'el-icon-s-grid' }
      },
      {
        path: '/lesson/:id',
        name: 'LessonDetail',
        component: () => import('@/views/lesson/LessonDetail.vue')
      },
      {
        path: '/lesson/edit/:id',
        name: 'LessonEdit',
        component: () => import('@/views/lesson/LessonEdit.vue')
      },
      {
        path: '/lesson/create',
        name: 'LessonCreate',
        component: () => import('@/views/lesson/LessonEdit.vue')
      },
      {
        path: '/school',
        name: 'School',
        component: () => import('@/views/school/index'),
        meta: { title: '学校信息管理', icon: 'el-icon-s-grid' }
      },
      {
        path: '/weeklyPlan',
        name: 'WeeklyPlan',
        component: () => import('@/views/week/index'),
        meta: { title: '周计划信息管理', icon: 'el-icon-s-grid' }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
