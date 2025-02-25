<script>
import { Course } from '@/api/Course'
import steps from 'element-ui/packages/steps'

export default {
  name: 'LessonDetail',
  computed: {
    steps() {
      return steps
    }
  },
  data() {
    return {
      course: {
        courseName: '',
        duration: '',
        totalSessions: 0,
        ageGroup: '',
        maxStudents: 0,
        startTime: '',
        endTime: '',
        updateTime: '',
        courseDescription: '',
        objectives: [],
        activities: []
      }
    }
  },
  methods: {
    getObjectiveTypeTag(type) {
      const types = {
        knowledge: 'primary',
        skill: 'success',
        attitude: 'warning'
      }
      return types[type] || 'info'
    },
    getObjectiveTypeLabel(type) {
      const labels = {
        knowledge: '知识目标',
        skill: '技能目标',
        attitude: '态度目标'
      }
      return labels[type] || '其他目标'
    },
    async fetchCourseDetail() {
      try {
        const courseId = this.$route.params.id
        const response = await Course.getCourseDetail({ courseId })
        this.course = {
          ...response,
          activities: JSON.parse(response.activities),
          objectives: JSON.parse(response.objectives)
        }
        this.course?.activities?.forEach((activity) => {
          activity.steps = JSON.parse(activity.steps)
        })
      } catch (error) {
        this.$message.error('获取课程详情失败：' + error.message)
      }
    }
  },
  created() {
    this.fetchCourseDetail()
  }
}
</script>

<template>
  <div class="lesson-detail">
    <!-- 基本信息部分 -->
    <div class="section basic-info">
      <h1>{{ course.courseName }}</h1>

      <!-- 主要信息 -->
      <div class="info-grid">
        <div class="info-item">
          <i class="el-icon-time"></i>
          <span class="label">总时长：</span>
          <span class="value">{{ course.duration }}</span>
        </div>

        <div class="info-item">
          <i class="el-icon-notebook-2"></i>
          <span class="label">总节数：</span>
          <span class="value">{{ course.totalSessions }}节</span>
        </div>

        <div class="info-item">
          <i class="el-icon-user"></i>
          <span class="label">适用年龄：</span>
          <span class="value">{{ course.ageGroup }}</span>
        </div>

        <div class="info-item">
          <i class="el-icon-user-solid"></i>
          <span class="label">最多学生数：</span>
          <span class="value">{{ course.maxStudents }}人</span>
        </div>
      </div>

      <!-- 时间信息 -->
      <div class="time-info">
        <div class="info-item">
          <i class="el-icon-date"></i>
          <span class="label">开始时间：</span>
          <span class="value">{{ course.startTime }}</span>
        </div>

        <div class="info-item">
          <i class="el-icon-date"></i>
          <span class="label">结束时间：</span>
          <span class="value">{{ course.endTime }}</span>
        </div>

        <div class="info-item">
          <i class="el-icon-refresh"></i>
          <span class="label">更新时间：</span>
          <span class="value">{{ course.updateTime }}</span>
        </div>
      </div>

      <!-- 课程描述 -->
      <div class="description-section">
        <h3>课程描述</h3>
        <div class="description">
          {{ course.courseDescription }}
        </div>
      </div>
    </div>

    <!-- 课程目标部分 -->
    <div class="section objectives">
      <h2>课程目标</h2>
      <el-card
        v-for="(objective, index) in course.objectives"
        :key="index"
        class="objective-card"
      >
        <div class="objective-header">
          <el-tag :type="getObjectiveTypeTag(objective.type)">
            {{ getObjectiveTypeLabel(objective.type) }}
          </el-tag>
        </div>
        <div class="objective-content">
          {{ objective.description }}
        </div>
      </el-card>
    </div>

    <!-- 课程活动部分 -->
    <div class="section activities">
      <h2>课程活动</h2>
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in course.activities"
          :key="index"
          :timestamp="`预计时长：${activity.duration}`"
          placement="top"
        >
          <el-card class="activity-card">
            <div class="activity-header">
              <h3>{{ activity.name }}</h3>
              <el-tag size="medium" type="primary">{{ activity.type }}</el-tag>
            </div>

            <div class="activity-description">
              {{ activity.description }}
            </div>

            <!-- 活动步骤 -->
            <div class="activity-steps">
              <h4>活动步骤</h4>
              <el-steps
                :active="activity.steps.length"
                direction="vertical"
                :space="20"
              >
                <el-step
                  v-for="(step, stepIndex) in activity.steps"
                  :key="stepIndex"
                >
                  <template slot="title">
                    <span class="step-title">{{ step.title }}</span>
                    <span class="step-duration" v-if="step.duration">
                      ({{ step.duration }})
                    </span>
                  </template>
                  <template slot="description">
                    <div class="step-description">{{ step.description }}</div>
                    <!-- 步骤提示 -->
                    <div v-if="step.tips" class="step-tips">
                      <el-alert
                        title="教学提示"
                        type="info"
                        :closable="false"
                        show-icon
                      >
                        {{ step.tips }}
                      </el-alert>
                    </div>
                    <!-- 步骤要点 -->
                    <div v-if="step.keyPoints && step.keyPoints.length" class="step-key-points">
                      <div class="key-points-title">关键要点：</div>
                      <ul>
                        <li
                          v-for="(point, pointIndex) in step.keyPoints"
                          :key="pointIndex"
                        >
                          {{ point }}
                        </li>
                      </ul>
                    </div>
                  </template>
                </el-step>
              </el-steps>
            </div>

            <div
              v-if="activity.materials && activity.materials.length"
              class="materials"
            >
              <h4>所需材料：</h4>
              <el-tag
                v-for="(material, mIndex) in activity.materials"
                :key="mIndex"
                size="small"
                effect="plain"
                class="material-tag"
              >
                {{ material }}
              </el-tag>
            </div>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </div>
  </div>
</template>

<style scoped lang="scss">
.lesson-detail {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;

  .section {
    margin-bottom: 40px;
  }

  // 基本信息样式
  .basic-info {
    background: #fff;
    border-radius: 8px;
    padding: 24px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);

    h1 {
      margin: 0 0 24px 0;
      font-size: 28px;
      color: #303133;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 24px;
      padding: 20px;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .time-info {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 24px;
      padding: 20px;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .info-item {
      display: flex;
      align-items: center;
      color: #606266;

      i {
        font-size: 18px;
        margin-right: 8px;
        color: #409EFF;
      }

      .label {
        color: #909399;
        margin-right: 8px;
      }

      .value {
        font-weight: 500;
        color: #303133;
      }
    }

    .description-section {
      h3 {
        font-size: 18px;
        color: #303133;
        margin: 0 0 16px 0;
      }

      .description {
        color: #606266;
        line-height: 1.8;
        padding: 16px;
        background: #f8f9fa;
        border-radius: 8px;
        font-size: 14px;
      }
    }
  }

  // 课程目标样式
  .objectives {
    h2 {
      margin-bottom: 20px;
      font-size: 22px;
      color: #303133;
    }

    .objective-card {
      margin-bottom: 15px;

      .objective-header {
        margin-bottom: 10px;
      }

      .objective-content {
        color: #606266;
        line-height: 1.6;
      }
    }
  }

  // 课程活动样式
  .activities {
    h2 {
      margin-bottom: 20px;
      font-size: 22px;
      color: #303133;
    }

    .activity-card {
      .activity-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;

        h3 {
          margin: 0;
          color: #303133;
        }
      }

      .activity-description {
        margin-bottom: 20px;
        color: #606266;
        line-height: 1.6;
      }

      .activity-steps {
        margin: 20px 0;

        h4 {
          margin: 0 0 15px 0;
          font-size: 16px;
          color: #303133;
        }

        .step-title {
          font-weight: 500;
          color: #303133;
        }

        .step-duration {
          margin-left: 8px;
          color: #909399;
          font-size: 13px;
        }

        .step-description {
          color: #606266;
          line-height: 1.6;
          margin-bottom: 10px;
        }

        .step-tips {
          margin: 10px 0;

          .el-alert {
            padding: 8px 16px;
          }
        }

        .step-key-points {
          margin-top: 10px;
          padding: 10px;
          background: #f8f9fa;
          border-radius: 4px;

          .key-points-title {
            font-weight: 500;
            color: #303133;
            margin-bottom: 8px;
          }

          ul {
            margin: 0;
            padding-left: 20px;

            li {
              color: #606266;
              line-height: 1.6;
              margin-bottom: 4px;

              &:last-child {
                margin-bottom: 0;
              }
            }
          }
        }
      }

      .materials {
        margin-top: 20px;
        padding-top: 20px;
        border-top: 1px solid #ebeef5;

        h4 {
          margin: 0 0 10px 0;
          font-size: 14px;
          color: #909399;
        }

        .material-tag {
          margin-right: 8px;
          margin-bottom: 8px;
        }
      }
    }
  }
}
</style>
