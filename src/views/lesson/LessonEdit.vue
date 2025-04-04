<template>
  <div class="lesson-edit">
    <!-- 顶部操作栏 -->
    <div class="header">
      <div class="title">
        <h1>{{ isEdit ? '编辑课程' : '创建课程' }}</h1>
        <template v-if="hasBasicInfo">
          <el-tooltip content="重新生成整个课程的目标和活动" placement="right">
            <el-button
              type="success"
              icon="el-icon-magic-stick"
              :loading="regenerating"
              class="regenerate-btn"
              @click="handleRegenerateAll"
            >
              AI 重新生成
            </el-button>
          </el-tooltip>
        </template>
        <template v-else>
          <el-tooltip content="基于年龄和人数生成课程基本信息" placement="right">
            <el-button
              type="success"
              icon="el-icon-magic-stick"
              :loading="generatingBasicInfo"
              class="regenerate-btn"
              :disabled="!canGenerateBasicInfo"
              @click="handleGenerateBasicInfo"
            >
              AI 生成基本信息
            </el-button>
          </el-tooltip>
        </template>
      </div>
    </div>

    <el-steps :active="activeStep" finish-status="success" class="steps">
      <el-step title="基本信息" />
      <el-step title="课程目标" />
      <el-step title="课程活动" />
    </el-steps>

    <!-- 基本信息表单 -->
    <el-form
      v-show="activeStep === 0"
      ref="basicForm"
      :model="courseForm"
      :rules="basicRules"
      label-width="100px"
      class="form-container"
    >
      <el-form-item label="课程名称" prop="courseName">
        <el-input v-model="courseForm.courseName" placeholder="请输入课程名称" />
      </el-form-item>

      <el-form-item label="适用年龄" prop="ageGroup">
        <el-input v-model="courseForm.ageGroup" placeholder="例如：7-12岁" />
      </el-form-item>

      <el-form-item label="总节数" prop="totalSessions">
        <el-input-number
          v-model="courseForm.totalSessions"
          :min="1"
          :precision="0"
          :step="1"
        />
      </el-form-item>

      <el-form-item label="最多学生数" prop="maxStudents">
        <el-input-number
          v-model="courseForm.maxStudents"
          :min="1"
          :precision="0"
          :step="1"
        />
      </el-form-item>

      <el-form-item label="课程时间" prop="coursePeriod">
        <el-date-picker
          v-model="courseForm.coursePeriod"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
        />
      </el-form-item>

      <el-form-item label="课程描述" prop="description">
        <el-input
          v-model="courseForm.courseDescription"
          type="textarea"
          :rows="4"
          placeholder="请输入课程描述（不少于10个字符）"
        />
      </el-form-item>

      <el-form-item label="课程时长" prop="duration">
        <el-input-number
          v-model="courseForm.duration"
          :min="1"
          :max="360"
          :step="5"
          style="width: 200px"
        >
          <template slot="append">分钟</template>
        </el-input-number>
        <span class="form-tip">每节课的时长（1-360分钟）</span>
      </el-form-item>

      <el-form-item label="课程类型" prop="type">
        <el-select
          v-model="courseForm.type"
          placeholder="请选择课程类型"
          style="width: 200px"
        >
          <el-option
            v-for="item in courseTypes"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
    </el-form>

    <!-- 课程目标部分 -->
    <div v-show="activeStep === 1" class="form-container">
      <div class="section-header">
        <div class="left">
          <h3>课程目标</h3>
          <el-tooltip content="基于课程信息自动生成教学目标" placement="right">
            <el-button
              type="success"
              icon="el-icon-magic-stick"
              :loading="generatingObjectives"
              size="small"
              @click="handleGenerateObjectives"
            >
              AI 生成目标
            </el-button>
          </el-tooltip>
        </div>
        <el-button type="primary" plain icon="el-icon-plus" size="small" @click="addObjective">
          手动添加目标
        </el-button>
      </div>
      <div class="objectives-list">
        <div
          v-for="(objective, index) in courseForm.objectives"
          :key="index"
          class="objective-item"
        >
          <el-card>
            <template #header>
              <div class="objective-header">
                <span>目标 {{ index + 1 }}</span>
                <el-button
                  type="text"
                  icon="el-icon-delete"
                  @click="removeObjective(index)"
                />
              </div>
            </template>
            <el-form :model="objective" label-width="100px">
              <el-form-item label="目标类型">
                <el-select v-model="objective.objectiveType" placeholder="请选择目标类型">
                  <el-option label="知识目标" value="knowledge" />
                  <el-option label="技能目标" value="skill" />
                  <el-option label="态度目标" value="attitude" />
                </el-select>
              </el-form-item>
              <el-form-item label="目标描述">
                <el-input
                  v-model="objective.description"
                  type="textarea"
                  :rows="2"
                  placeholder="请输入目标描述"
                />
              </el-form-item>
            </el-form>
          </el-card>
        </div>
      </div>
    </div>

    <!-- 课程活动部分 -->
    <div v-show="activeStep === 2" class="form-container">
      <div class="section-header">
        <div class="left">
          <h3>课程活动</h3>
          <el-tooltip content="基于课程目标自动生成教学活动" placement="right">
            <el-button
              type="success"
              icon="el-icon-magic-stick"
              :loading="generatingActivities"
              size="small"
              @click="handleGenerateActivities"
            >
              AI 生成活动
            </el-button>
          </el-tooltip>
        </div>
        <el-button type="primary" plain icon="el-icon-plus" size="small" @click="addActivity">
          手动添加活动
        </el-button>
      </div>
      <div class="activities-list">
        <div
          v-for="(activity, index) in courseForm.activities"
          :key="index"
          class="activity-item"
        >
          <el-card>
            <template #header>
              <div class="activity-header">
                <span>活动 {{ index + 1 }}</span>
                <el-button
                  type="text"
                  icon="el-icon-delete"
                  @click="removeActivity(index)"
                />
              </div>
            </template>
            <el-form :model="activity" :rules="{}" label-width="100px">
              <el-form-item label="活动名称">
                <el-input
                  v-model="activity.activityName"
                  placeholder="请输入活动名称"
                />
              </el-form-item>

              <el-form-item label="活动时长">
                <el-input
                  v-model="activity.duration"
                  placeholder="例如：30分钟"
                />
              </el-form-item>

              <el-form-item label="活动描述">
                <el-input
                  v-model="activity.description"
                  type="textarea"
                  :rows="2"
                  placeholder="请输入活动描述"
                />
              </el-form-item>

              <!-- 活动步骤 -->
              <div class="steps-list">
                <h4>活动步骤</h4>
                <div
                  v-for="(step, stepIndex) in activity.steps"
                  :key="stepIndex"
                  class="step-item"
                >
                  <el-card shadow="hover">
                    <template #header>
                      <div class="step-header">
                        <span>步骤 {{ stepIndex + 1 }}</span>
                        <el-button
                          type="text"
                          icon="el-icon-delete"
                          @click="removeStep(activity, stepIndex)"
                        />
                      </div>
                    </template>
                    <el-form :model="step" label-width="100px">
                      <el-form-item label="步骤标题">
                        <el-input
                          v-model="step.title"
                          placeholder="请输入步骤标题"
                        />
                      </el-form-item>
                      <el-form-item label="预计时长">
                        <el-input
                          v-model="step.duration"
                          placeholder="例如：5分钟"
                        />
                      </el-form-item>
                      <el-form-item label="步骤描述">
                        <el-input
                          v-model="step.description"
                          type="textarea"
                          :rows="2"
                          placeholder="请输入步骤描述"
                        />
                      </el-form-item>
                      <el-form-item label="教学提示">
                        <el-input
                          v-model="step.tips"
                          type="textarea"
                          :rows="2"
                          placeholder="请输入教学提示"
                        />
                      </el-form-item>
                      <!-- 关键要点 -->
                      <el-form-item label="关键要点">
                        <el-tag
                          v-for="(point, pointIndex) in step.keyPoints"
                          :key="pointIndex"
                          closable
                          class="key-point-tag"
                          @close="removeKeyPoint(step, pointIndex)"
                        >
                          {{ point }}
                        </el-tag>
                        <el-input
                          v-if="step.inputVisible"
                          v-model="step.inputValue"
                          class="key-point-input"
                          size="small"
                          @keyup.enter.native="addKeyPoint(step)"
                          @blur="addKeyPoint(step)"
                        />
                        <el-button
                          v-else
                          size="small"
                          @click="showInput(step)"
                        >
                          + 添加要点
                        </el-button>
                      </el-form-item>
                    </el-form>
                  </el-card>
                </div>
                <el-button
                  type="text"
                  icon="el-icon-plus"
                  @click="addStep(activity)"
                >
                  添加步骤
                </el-button>
              </div>

              <!-- 所需材料 -->
              <el-form-item label="所需材料">
                <el-tag
                  v-for="(material, materialIndex) in activity.materialsNeeded"
                  :key="materialIndex"
                  closable
                  class="material-tag"
                  @close="removeMaterial(activity, materialIndex)"
                >
                  {{ material }}
                </el-tag>
                <el-input
                  v-if="activity.inputVisible"
                  v-model="activity.inputValue"
                  class="material-input"
                  size="small"
                  @keyup.enter.native="addMaterial(activity)"
                  @blur="addMaterial(activity)"
                />
                <el-button
                  v-else
                  size="small"
                  @click="showMaterialInput(activity)"
                >
                  + 添加材料
                </el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </div>
      </div>
    </div>

    <!-- 底部按钮 -->
    <div class="form-footer">
      <el-button v-if="activeStep > 0" @click="prevStep">上一步</el-button>
      <el-button v-if="this.$route.params.id" @click="prevStep">保存</el-button>
      <el-button
        v-if="activeStep < 2"
        type="primary"
        @click="nextStep"
      >
        下一步
      </el-button>
      <el-button
        v-else
        type="primary"
        :loading="submitting"
        @click="submitForm"
      >
        提交
      </el-button>
    </div>
  </div>
</template>

<script>
import { Course } from '@/api/Course'
import { createEventSource } from '@/utils/eventSource'
import { url } from '@/api/url'
import { assignProperties } from '@/utils/StrUtil'

export default {
  name: 'LessonEdit',
  data() {
    return {
      isEdit: false,
      activeStep: 0,
      submitting: false,
      regenerating: false,
      generatingObjectives: false,
      generatingActivities: false,
      generatingBasicInfo: false,
      generateBasicInfoData: '',
      courseTypes: [
        { label: '语言类', value: 'LANGUAGE' },
        { label: '艺术类', value: 'ART' },
        { label: '体育类', value: 'SPORTS' },
        { label: '科技类', value: 'TECH' },
        { label: '音乐类', value: 'MUSIC' }
      ],
      courseForm: {
        courseName: '',
        ageGroup: '',
        totalSessions: 1,
        maxStudents: 30,
        duration: 30,
        type: '',
        coursePeriod: [],
        courseDescription: '',
        objectives: [],
        activities: []
      },
      basicRules: {
        courseName: [
          { required: true, message: '请输入课程名称', trigger: 'blur' }
        ],
        ageGroup: [
          { required: true, message: '请输入适用年龄', trigger: 'blur' }
        ],
        totalSessions: [
          { required: true, message: '请输入总节数', trigger: 'blur' },
          { type: 'number', min: 1, message: '总节数必须大于0', trigger: 'blur' }
        ],
        maxStudents: [
          { required: true, message: '请输入最多学生数', trigger: 'blur' },
          { type: 'number', min: 1, message: '最多学生数必须大于0', trigger: 'blur' }
        ],
        coursePeriod: [
          { required: true, message: '请选择课程时间', trigger: 'change' },
          { type: 'array', message: '请选择完整的时间范围', trigger: 'change' }
        ],
        description: [
          { required: false, message: '请输入课程描述', trigger: 'blur' },
          { min: 10, message: '课程描述不能少于10个字符', trigger: 'blur' }
        ],
        duration: [
          { required: true, message: '请输入课程时长', trigger: 'blur' },
          { type: 'number', min: 1, max: 360, message: '课程时长必须在1-360分钟之间', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择课程类型', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    hasBasicInfo() {
      return this.courseForm.courseName &&
        this.courseForm.courseDescription &&
        this.courseForm.totalSessions > 0
    },
    canGenerateBasicInfo() {
      return this.courseForm.ageGroup &&
        this.courseForm.maxStudents > 0 &&
        this.courseForm.type
    }
  },
  created() {
    const { id } = this.$route.params
    if (id) {
      if (this.$route.name === 'LessonEdit') {
        this.isEdit = true
      }
      this.fetchCourseDetail(id)
    }
  },
  methods: {
    async fetchCourseDetail(id) {
      try {
        const response = await Course.getCourseDetail({ courseId: id })
        const { startTime, endTime, ...courseData } = response
        console.log(response)
        console.log(courseData)
        // const objectives = JSON.parse(courseData.objectives)
        // const activities = JSON.parse(courseData.activities)
        const objectives = courseData.objectives
        const activities = courseData.activities
        activities.forEach((activity) => {
          activity.steps = JSON.parse(activity.steps)
          activity.materialsNeeded = activity.materialsNeeded.split('、')
        })
        this.activeStep = courseData.activeStep
        this.courseForm = {
          ...courseData,
          activities,
          objectives,
          coursePeriod: [startTime, endTime]
        }
      } catch (error) {
        this.$message.error('获取课程详情失败：' + error.message)
      }
    },
    async nextStep() {
      if (this.activeStep === 0) {
        try {
          await this.$refs.basicForm.validate()
          this.activeStep++
        } catch (error) {
          console.error('表单验证失败:', error)
          return false
        }
      } else {
        // 第二步和第三步的简单验证
        if (this.activeStep === 1 && this.courseForm.objectives.length === 0) {
          this.$message.warning('请至少添加一个课程目标')
          return false
        }
        if (this.activeStep === 2 && this.courseForm.activities.length === 0) {
          this.$message.warning('请至少添加一个课程活动')
          return false
        }
        this.activeStep++
      }
    },
    prevStep() {
      this.activeStep--
    },
    addObjective() {
      this.courseForm.objectives.push({
        type: '',
        description: ''
      })
    },
    removeObjective(index) {
      this.courseForm.objectives.splice(index, 1)
    },
    addActivity() {
      this.courseForm.activities.push({
        name: '',
        duration: '',
        description: '',
        materials: [],
        steps: [],
        inputVisible: false,
        inputValue: ''
      })
    },
    removeActivity(index) {
      this.courseForm.activities.splice(index, 1)
    },
    addStep(activity) {
      if (!activity.steps) {
        activity.steps = []
      }
      activity.steps.push({
        title: '',
        duration: '',
        description: '',
        tips: '',
        keyPoints: [],
        inputVisible: false,
        inputValue: ''
      })
    },
    removeStep(activity, stepIndex) {
      activity.steps.splice(stepIndex, 1)
    },
    showInput(step) {
      step.inputVisible = true
      this.$nextTick(() => {
        // this.$refs[`pointInput${step.id}`]?.[0]?.focus()
      })
    },
    addKeyPoint(step) {
      if (step.inputValue) {
        if (!step.keyPoints) {
          step.keyPoints = []
        }
        step.keyPoints.push(step.inputValue)
        step.inputValue = ''
      }
      step.inputVisible = false
    },
    removeKeyPoint(step, index) {
      step.keyPoints.splice(index, 1)
    },
    showMaterialInput(activity) {
      activity.inputVisible = true
      this.$nextTick(() => {
        // this.$refs[`materialInput${activity.id}`]?.[0]?.focus()
      })
    },
    addMaterial(activity) {
      if (activity.inputValue) {
        if (!activity.materials) {
          activity.materials = []
        }
        activity.materials.push(activity.inputValue)
        activity.inputValue = ''
      }
      activity.inputVisible = false
    },
    removeMaterial(activity, index) {
      activity.materials.splice(index, 1)
    },
    async submitForm() {
      try {
        this.submitting = true
        const formData = {
          ...this.courseForm,
          startTime: this.courseForm.coursePeriod[0],
          endTime: this.courseForm.coursePeriod[1]
        }
        delete formData.coursePeriod

        if (this.isEdit) {
          await Course.updateCourse(this.$route.params.id, formData)
          this.$message.success('课程更新成功')
        } else {
          await Course.createCourse(formData)
          this.$message.success('课程创建成功')
        }

        this.$router.push('/lesson')
      } catch (error) {
        this.$message.error(error.message || '提交失败')
      } finally {
        this.submitting = false
      }
    },
    async handleRegenerateAll() {
      // try {
      //   this.regenerating = true
      //   const response = await Course.regenerateAll(this.$route.params.id)
      //   this.courseForm = response
      //   this.$message.success('课程重新生成成功')
      // } catch (error) {
      //   this.$message.error('重新生成课程失败：' + error.message)
      // } finally {
      //   this.regenerating = false
      // }
    },
    async handleGenerateObjectives() {
      try {
        this.generatingObjectives = true
        const response = await Course.generateObjectives(this.$route.params.id)
        this.courseForm.objectives = response
        this.$message.success('课程目标生成成功')
      } catch (error) {
        this.$message.error('生成课程目标失败：' + error.message)
      } finally {
        this.generatingObjectives = false
      }
    },
    async handleGenerateActivities() {
      // try {
      //   this.generatingActivities = true
      //   const response = await Course.generateActivities(this.$route.params.id)
      //   this.courseForm.activities = response
      //   this.$message.success('课程活动生成成功')
      // } catch (error) {
      //   this.$message.error('生成课程活动失败：' + error.message)
      // } finally {
      //   this.generatingActivities = false
      // }
    },
    handleGenerateBasicInfo() {
      if (!this.courseForm.ageGroup || !this.courseForm.maxStudents || !this.courseForm.type) {
        this.$message.warning('请先填写适用年龄、最多学生数和课程类型')
        return
      }

      try {
        this.generatingBasicInfo = true
        const data = {
          ageGroup: this.courseForm.ageGroup,
          maxStudents: this.courseForm.maxStudents,
          type: this.courseForm.type
        }
        const messageCallBack = (message) => {
          // 更新数据
          this.generateBasicInfoData += message.data
          console.log('处理前：{}', this.generateBasicInfoData)
          this.generateBasicInfoData = this.generateBasicInfoData.replace(/\\\\LINE\/\//g, '\n')
          console.log('处理后：{}', this.generateBasicInfoData)
          // 解析数据
          const parseData = assignProperties([
            { sourceKey: 'name', targetProp: 'courseName' },
            { sourceKey: 'totalsession', targetProp: 'totalSessions' },
            { sourceKey: 'description', targetProp: 'courseDescription' },
            { sourceKey: 'starttime', targetProp: 'startTime' },
            { sourceKey: 'endtime', targetProp: 'endTime' },
            { sourceKey: 'duration', targetProp: 'duration' }
          ], this.generateBasicInfoData)
          // 转换日期格式并设置到表单的 coursePeriod 中
          if (parseData.startTime && parseData.endTime) {
            // 日期格式化函数，确保日期格式为 yyyy-MM-dd
            const formatDate = (dateStr) => {
              // 如果已经是 Date 对象，转换为字符串
              if (dateStr instanceof Date) {
                const year = dateStr.getFullYear()
                const month = String(dateStr.getMonth() + 1).padStart(2, '0')
                const day = String(dateStr.getDate()).padStart(2, '0')
                return `${year}-${month}-${day}`
              }

              // 如果是字符串但格式不正确，尝试转换
              if (typeof dateStr === 'string' && !dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
                const date = new Date(dateStr)
                return formatDate(date)
              }

              // 如果已经是正确格式的字符串，直接返回
              return dateStr
            }

            // 设置到表单数据中
            this.courseForm.coursePeriod = [
              formatDate(parseData.startTime),
              formatDate(parseData.endTime)
            ]
          }
          this.courseForm = {
            ...this.courseForm,
            ...parseData
          }
        }
        createEventSource(url.Course.generateCourseBaseInfo, data, messageCallBack)
          .then(res => {
            // 生成结束
            this.$message.success('基本信息已生成')
            // 保存课程基本信息
            console.log('yes')
            const startTime = this.courseForm?.coursePeriod[0]
            const endTime = this.courseForm?.coursePeriod[1]
            if (this.$route.name === 'LessonCreate') {
              Course.createCourseFirst({
                ...this.courseForm,
                startTime,
                endTime
              }).then((res) => {
                this.generatingBasicInfo = false
                this.$router.push({ name: 'LessonCreateWithId', params: { id: res.data }})
              })
            } else if (this.$route.name === 'LessonCreateWithId') {
              Course.updateCourseFirst({
                ...this.courseForm,
                startTime,
                endTime
              }).then(() => {
                this.generatingBasicInfo = false
              })
            }
          })
          .catch(err => {
            // 生成出错
            this.generatingBasicInfo = false
            console.log(err)
          })
      } catch (error) {
        this.$message.error('生成失败：' + error.message)
      }
    }
  }
}
</script>

<style scoped lang="scss">
.lesson-edit {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;

  .header {
    margin-bottom: 30px;

    .title {
      display: flex;
      align-items: center;
      gap: 16px;

      h1 {
        margin: 0;
        color: #303133;
      }

      .regenerate-btn {
        margin-left: 16px;
      }
    }
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 16px;
    border-bottom: 1px solid #EBEEF5;

    .left {
      display: flex;
      align-items: center;
      gap: 16px;

      h3 {
        margin: 0;
        color: #303133;
        font-size: 18px;
      }
    }
  }

  .form-container {
    background: #fff;
    padding: 20px;
    border-radius: 4px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
    margin-bottom: 20px;

    .form-tip {
      margin-left: 10px;
      color: #909399;
      font-size: 13px;
    }

    .el-input-number {
      width: 200px;
    }
  }

  .objectives-list,
  .activities-list {
    margin-bottom: 20px;

    .objective-item,
    .activity-item {
      margin-bottom: 20px;
    }
  }

  .steps-list {
    margin: 20px 0;
    padding: 20px;
    background: #f8f9fa;
    border-radius: 4px;

    h4 {
      margin: 0 0 20px 0;
      color: #303133;
    }

    .step-item {
      margin-bottom: 20px;
    }
  }

  .key-point-tag,
  .material-tag {
    margin-right: 8px;
    margin-bottom: 8px;
  }

  .key-point-input,
  .material-input {
    width: 100px;
    margin-right: 8px;
    vertical-align: bottom;
  }

  .form-footer {
    margin-top: 30px;
    text-align: center;
  }

  .objective-header,
  .activity-header,
  .step-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
