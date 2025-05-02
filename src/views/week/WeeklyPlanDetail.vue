<script>
import { WeeklyPlan } from '@/api/WeeklyPlan'

export default {
  name: 'WeeklyPlanDetail',
  data() {
    return {
      loading: false,
      weeklyPlan: {
        name: '',
        schoolName: '',
        className: '',
        author: '',
        updatedTime: '',
        items: [] // 周计划项列表
      },
      // 周一到周五的课程表布局
      timetable: {
        days: ['周一', '周二', '周三', '周四', '周五'],
        periods: Array(8).fill().map((_, i) => `第${i + 1}节`),
        grid: Array(5).fill().map(() => Array(8).fill(null))
      }
    }
  },
  created() {
    this.fetchWeeklyPlanDetail()
  },
  methods: {
    async fetchWeeklyPlanDetail() {
      try {
        this.loading = true
        const planId = this.$route.params.id
        const response = await WeeklyPlan.getWeeklyPlanDetail({ planId })
        this.weeklyPlan = response

        // 初始化课程表布局
        this.initializeTimetable()
      } catch (error) {
        this.$message.error('获取周计划详情失败：' + error.message)
      } finally {
        this.loading = false
      }
    },
    initializeTimetable() {
      // 清空课程表
      this.timetable.grid = Array(5).fill().map(() => Array(8).fill(null))

      // 将周计划项填充到课程表中
      this.weeklyPlan.items.forEach(item => {
        const dayIndex = item.dayOfWeek - 1 // 转换为0-4的索引
        const periodIndex = item.sortNum - 1 // 转换为0-7的索引

        if (dayIndex >= 0 && dayIndex < 5 && periodIndex >= 0 && periodIndex < 8) {
          this.timetable.grid[dayIndex][periodIndex] = item
        }
      })
    }
  }
}
</script>

<template>
  <div class="weekly-plan-detail" v-loading="loading">
    <!-- 基本信息 -->
    <div class="basic-info">
      <div class="header">
        <h1>{{ weeklyPlan.name }}</h1>
        <div class="info-row">
          <span class="info-item">
            <i class="el-icon-school"></i>
            所属学校：{{ weeklyPlan.schoolName }}
          </span>
          <span class="info-item">
            <i class="el-icon-class"></i>
            所属班级：{{ weeklyPlan.className }}
          </span>
          <span class="info-item">
            <i class="el-icon-user"></i>
            作者：{{ weeklyPlan.author }}
          </span>
          <span class="info-item">
            <i class="el-icon-time"></i>
            更新时间：{{ weeklyPlan.updatedTime }}
          </span>
        </div>
      </div>
    </div>

    <!-- 课程表 -->
    <div class="timetable-container">
      <div class="timetable">
        <!-- 表头 -->
        <div class="timetable-header">
          <div class="corner"></div>
          <div v-for="day in timetable.days" :key="day" class="day-header">
            {{ day }}
          </div>
        </div>

        <!-- 课程表主体 -->
        <div class="timetable-body">
          <div class="periods">
            <div v-for="period in timetable.periods" :key="period" class="period">
              {{ period }}
            </div>
          </div>

          <div class="grid">
            <div v-for="(day, dayIndex) in timetable.grid" :key="dayIndex" class="day-column">
              <div
                v-for="(item, periodIndex) in day"
                :key="periodIndex"
                class="grid-cell"
                :class="{ 'has-content': item }"
              >
                <div v-if="item" class="course-item" @click="$router.push({ name: 'LessonDetail', params: { id: item.courseId } })">
                  <div class="course-name">{{ item.courseName }}</div>
                  <div class="course-info">
                    <span class="teacher">课程时长：{{ item.duration }}</span>
<!--                    <span class="location">{{ item.location }}</span>-->
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.weekly-plan-detail {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;

  .basic-info {
    margin-bottom: 30px;
    background: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);

    .header {
      h1 {
        margin: 0 0 20px 0;
        font-size: 24px;
        color: #303133;
      }

      .info-row {
        display: flex;
        flex-wrap: wrap;
        gap: 20px;

        .info-item {
          display: flex;
          align-items: center;
          color: #606266;
          font-size: 14px;

          i {
            margin-right: 8px;
            font-size: 16px;
            color: #409EFF;
          }
        }
      }
    }
  }

  .timetable-container {
    background: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);

    .timetable {
      width: 100%;
      border: 1px solid #EBEEF5;
      border-radius: 4px;
      overflow: hidden;

      .timetable-header {
        display: flex;
        background: #F5F7FA;
        border-bottom: 1px solid #EBEEF5;

        .corner {
          width: 80px;
          height: 50px;
          border-right: 1px solid #EBEEF5;
        }

        .day-header {
          flex: 1;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          color: #303133;
          border-right: 1px solid #EBEEF5;

          &:last-child {
            border-right: none;
          }
        }
      }

      .timetable-body {
        display: flex;

        .periods {
          width: 80px;
          background: #F5F7FA;

          .period {
            height: 80px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 13px;
            color: #606266;
            border-bottom: 1px solid #EBEEF5;
            border-right: 1px solid #EBEEF5;

            &:last-child {
              border-bottom: none;
            }
          }
        }

        .grid {
          flex: 1;
          display: flex;

          .day-column {
            flex: 1;
            display: flex;
            flex-direction: column;

            .grid-cell {
              height: 80px;
              border-right: 1px solid #EBEEF5;
              border-bottom: 1px solid #EBEEF5;
              padding: 4px;

              &:last-child {
                border-bottom: none;
              }

              &.has-content {
                background: #F0F9FF;
                cursor: pointer;
                transition: all 0.3s;

                &:hover {
                  background: #E6F7FF;
                  transform: scale(1.02);
                  z-index: 1;
                  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
                }
              }

              .course-item {
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                padding: 4px;
                border-radius: 4px;
                background: #fff;
                box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);

                .course-name {
                  font-weight: 600;
                  color: #303133;
                  font-size: 14px;
                  margin-bottom: 4px;
                }

                .course-info {
                  display: flex;
                  flex-direction: column;
                  gap: 2px;
                  font-size: 12px;
                  color: #606266;

                  .teacher {
                    color: #409EFF;
                  }

                  .location {
                    color: #67C23A;
                  }
                }
              }
            }

            &:last-child {
              .grid-cell {
                border-right: none;
              }
            }
          }
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .weekly-plan-detail {
    padding: 10px;

    .basic-info {
      .info-row {
        flex-direction: column;
        gap: 10px;
      }
    }

    .timetable-container {
      overflow-x: auto;

      .timetable {
        min-width: 800px;
      }
    }
  }
}
</style>
