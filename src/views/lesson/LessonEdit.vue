<template>
  <div class="lesson-edit">
    <div class="header">
      <h1>{{ isEdit ? '编辑课程' : '创建课程' }}</h1>
    </div>

    <el-steps :active="activeStep" finish-status="success" class="steps">
      <el-step title="基本信息"/>
      <el-step title="课程目标"/>
      <el-step title="课程活动"/>
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
        <el-input v-model="courseForm.courseName" placeholder="请输入课程名称"/>
      </el-form-item>

      <el-form-item label="适用年龄" prop="ageGroup">
        <el-input v-model="courseForm.ageGroup" placeholder="例如：7-12岁"/>
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
    </el-form>

    <!-- 课程目标表单 -->
    <div v-show="activeStep === 1" class="form-container">
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
                  @click="removeObjective(index)"
                  icon="el-icon-delete"
                />
              </div>
            </template>
            <el-form :model="objective" label-width="100px">
              <el-form-item label="目标类型">
                <el-select v-model="objective.objectiveType" placeholder="请选择目标类型">
                  <el-option label="知识目标" value="knowledge"/>
                  <el-option label="技能目标" value="skill"/>
                  <el-option label="态度目标" value="attitude"/>
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
      <el-button type="primary" plain @click="addObjective" icon="el-icon-plus">
        添加课程目标
      </el-button>
    </div>

    <!-- 课程活动表单 -->
    <div v-show="activeStep === 2" class="form-container">
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
                  @click="removeActivity(index)"
                  icon="el-icon-delete"
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
                          @click="removeStep(activity, stepIndex)"
                          icon="el-icon-delete"
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
                          @close="removeKeyPoint(step, pointIndex)"
                          class="key-point-tag"
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
                  @click="addStep(activity)"
                  icon="el-icon-plus"
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
                  @close="removeMaterial(activity, materialIndex)"
                  class="material-tag"
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
      <el-button type="primary" plain @click="addActivity" icon="el-icon-plus">
        添加课程活动
      </el-button>
    </div>

    <!-- 底部按钮 -->
    <div class="form-footer">
      <el-button v-if="activeStep > 0" @click="prevStep">上一步</el-button>
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
        @click="submitForm"
        :loading="submitting"
      >
        提交
      </el-button>
    </div>
  </div>
</template>

<script>
import { Course } from '@/api/Course'

export default {
  name: 'LessonEdit',
  data() {
    return {
      isEdit: false,
      activeStep: 0,
      submitting: false,
      courseForm: {
        courseName: '',
        ageGroup: '',
        totalSessions: 1,
        maxStudents: 30,
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
        ]
      }
    }
  },
  created() {
    const { id } = this.$route.params
    if (id) {
      this.isEdit = true
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
        const objectives = JSON.parse(courseData.objectives)
        const activities = JSON.parse(courseData.activities)
        activities.forEach((activity) => {
          activity.steps = JSON.parse(activity.steps)
          activity.materialsNeeded = activity.materialsNeeded.split('、')
        })
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

    h1 {
      margin: 0;
      color: #303133;
    }
  }

  .steps {
    margin-bottom: 30px;
  }

  .form-container {
    background: #fff;
    padding: 20px;
    border-radius: 4px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
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
