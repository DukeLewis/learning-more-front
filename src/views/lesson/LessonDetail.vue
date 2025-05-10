<script>
import { Course } from '@/api/Course'
import steps from 'element-ui/packages/steps'
import html2pdf from 'html2pdf.js'

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
  created() {
    this.fetchCourseDetail()
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
          activities: response.activities,
          objectives: response.objectives
        }
        this.course?.activities?.forEach((activity) => {
          activity.steps = JSON.parse(activity.steps)
          activity.materialsNeeded = activity.materialsNeeded.split(',')
        })
      } catch (error) {
        this.$message.error('获取课程详情失败：' + error.message)
      }
    },
    downloadPdf() {
      const element = this.$refs.lessonDetail
      // 使用html2pdf生成PDF并下载
      html2pdf()
        .from(element)
        .save('课程详情.pdf')
    }
  }
}
</script>

<template>
  <div class="lesson-detail" ref="lessonDetail">
    <!-- 基本信息部分 -->
    <div class="section basic-info">
      <div class="header-section">
        <h1>{{ course.courseName }}</h1>
        <el-button
          type="primary"
          @click="downloadPdf"
          class="download-btn"
          icon="el-icon-download"
        >
          下载课程详情
        </el-button>
      </div>

      <!-- 主要信息 -->
      <div class="info-grid">
        <div class="info-item">
          <i class="el-icon-time"></i>
          <span class="label">课程类型：</span>
          <span class="value">{{ course.type }}</span>
        </div>
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
  padding: 30px;
  max-width: 1200px;
  margin: 0 auto;
  background: #f9fafc;
  min-height: 100vh;

  .section {
    margin-bottom: 40px;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
    }
  }

  // 基本信息样式
  .basic-info {
    background: #fff;
    border-radius: 12px;
    padding: 30px;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);

    .header-section {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;

      .download-btn {
        padding: 12px 20px;
        font-size: 14px;
        border-radius: 8px;
        transition: all 0.3s ease;
        box-shadow: 0 2px 6px rgba(64, 158, 255, 0.2);

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
        }

        i {
          margin-right: 6px;
        }
      }
    }

    h1 {
      margin: 0;
      font-size: 32px;
      font-weight: 600;
      color: #303133;
      border-left: 5px solid #409EFF;
      padding-left: 15px;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 25px;
      margin-bottom: 30px;
      padding: 25px;
      background: linear-gradient(to right, #f8f9fa, #f0f2f5);
      border-radius: 12px;
      box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.03);
    }

    .time-info {
      margin-bottom: 30px;

      .time-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
      }
    }

    .info-item {
      display: flex;
      align-items: center;
      color: #606266;
      padding: 12px;
      border-radius: 8px;
      transition: all 0.2s;

      &:hover {
        background: rgba(64, 158, 255, 0.1);
      }

      i {
        font-size: 22px;
        margin-right: 12px;
        color: #409EFF;
        background: rgba(64, 158, 255, 0.1);
        padding: 8px;
        border-radius: 50%;
      }

      .label {
        color: #909399;
        margin-right: 8px;
        font-weight: 500;
      }

      .value {
        font-weight: 600;
        color: #303133;
      }
    }

    .description-section {
      h3 {
        font-size: 20px;
        color: #303133;
        margin: 0 0 16px 0;
        display: flex;
        align-items: center;

        i {
          margin-right: 8px;
          color: #409EFF;
        }
      }

      .description {
        color: #606266;
        line-height: 1.8;
        padding: 20px;
        background: #f8f9fa;
        border-radius: 12px;
        font-size: 15px;
        box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.03);
        white-space: pre-line;
      }
    }
  }

  // 课程目标样式
  .objectives {
    h2 {
      margin-bottom: 25px;
      font-size: 26px;
      color: #303133;
      display: flex;
      align-items: center;

      i {
        margin-right: 10px;
        color: #409EFF;
      }
    }

    .objectives-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
    }

    .objective-card {
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 12px 20px rgba(0, 0, 0, 0.1);
      }

      .objective-header {
        margin-bottom: 15px;

        .el-tag {
          padding: 6px 12px;
          font-size: 14px;
        }
      }

      .objective-content {
        color: #606266;
        line-height: 1.8;
        font-size: 15px;
      }
    }
  }

  // 课程活动样式
  .activities {
    h2 {
      margin-bottom: 25px;
      font-size: 26px;
      color: #303133;
      display: flex;
      align-items: center;

      i {
        margin-right: 10px;
        color: #409EFF;
      }
    }

    .el-timeline-item {
      padding-bottom: 30px;

      .el-timeline-item__timestamp {
        font-size: 14px;
        color: #909399;
        font-weight: 600;
      }
    }

    .activity-card {
      transition: all 0.3s ease;

      &:hover {
        box-shadow: 0 12px 20px rgba(0, 0, 0, 0.1);
      }

      .activity-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        border-bottom: 1px solid #ebeef5;
        padding-bottom: 15px;

        h3 {
          margin: 0;
          color: #303133;
          font-size: 20px;
          display: flex;
          align-items: center;

          i {
            margin-right: 8px;
            color: #409EFF;
          }
        }
      }

      .activity-description {
        margin-bottom: 25px;
        color: #606266;
        line-height: 1.8;
        padding: 15px;
        background: #f8f9fa;
        border-radius: 8px;
        font-size: 15px;
      }

      .activity-steps {
        margin: 25px 0;

        h4 {
          margin: 0 0 20px 0;
          font-size: 18px;
          color: #303133;
          display: flex;
          align-items: center;

          i {
            margin-right: 8px;
            color: #409EFF;
          }
        }

        .step-title {
          font-weight: 600;
          color: #303133;
          font-size: 16px;
        }

        .step-duration {
          margin-left: 10px;
          color: #909399;
          font-size: 14px;
          background: rgba(144, 147, 153, 0.1);
          padding: 2px 8px;
          border-radius: 12px;
          display: inline-flex;
          align-items: center;

          i {
            margin-right: 4px;
          }
        }

        .step-content {
          background: #fff;
          border-radius: 8px;
          padding: 15px;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
          margin-top: 10px;
        }

        .step-description {
          color: #606266;
          line-height: 1.8;
          margin-bottom: 15px;
          font-size: 15px;
        }

        .step-tips {
          margin: 15px 0;

          .el-alert {
            border-radius: 8px;
            padding: 10px 16px;
          }
        }

        .step-key-points {
          margin-top: 15px;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 8px;
          box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.03);

          .key-points-title {
            font-weight: 600;
            color: #303133;
            margin-bottom: 10px;
            display: flex;
            align-items: center;

            i {
              margin-right: 6px;
              color: #E6A23C;
            }
          }

          ul {
            margin: 0;
            padding-left: 25px;

            li {
              color: #606266;
              line-height: 1.8;
              margin-bottom: 8px;
              padding-left: 5px;

              &:last-child {
                margin-bottom: 0;
              }
            }
          }
        }
      }

      .materials {
        margin-top: 25px;
        padding-top: 20px;
        border-top: 1px solid #ebeef5;

        h4 {
          margin: 0 0 15px 0;
          font-size: 18px;
          color: #303133;
          display: flex;
          align-items: center;

          i {
            margin-right: 8px;
            color: #409EFF;
          }
        }

        .materials-list {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .material-tag {
          margin-right: 0;
          margin-bottom: 0;
          padding: 6px 12px;
          border-radius: 12px;
          font-size: 13px;
          transition: all 0.2s;

          &:hover {
            transform: scale(1.05);
          }
        }
      }
    }
  }

  @media (max-width: 768px) {
    padding: 15px;

    .basic-info {
      padding: 20px;

      h1 {
        font-size: 24px;
      }

      .info-grid, .time-grid {
        grid-template-columns: 1fr;
      }
    }

    .objectives .objectives-grid {
      grid-template-columns: 1fr;
    }
  }
}
</style>
