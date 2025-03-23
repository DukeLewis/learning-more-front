import request from '@/utils/request'
import { url } from '@/api/url'

export const WeeklyPlan = {
  listWeeklyPlanPage(params) {
    return request({
      url: url.WeeklyPlan.listWeeklyPlanPage,
      method: 'get',
      params
    })
  },
  createWeeklyPlan(data) {
    return request({
      url: url.WeeklyPlan.createWeeklyPlan,
      method: 'post',
      data
    })
  },
  deleteWeeklyPlan(params) {
    return request({})
  }
}
