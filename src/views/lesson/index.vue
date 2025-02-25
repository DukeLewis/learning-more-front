<script>
import LessonList from './components/LessonList.vue'
import { Course } from '@/api/Course'

export default {
  name: 'Lesson',
  components: {
    LessonList
  },
  methods: {
    handleCreate() {
      this.$router.push({ name: 'LessonCreate' })
    },
    handleCardClick(lessonId) {
      console.log('Card clicked:', lessonId)
      this.$router.push(`/lesson/${lessonId}`)
    },
    handleDelete(lessonId) {
      this.$confirm('确认删除该课程?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        try {
          this.$loading({ text: '正在删除...' })
          await Course.deleteCourse({ courseId: lessonId })
          this.$message.success('删除成功')
          await this.$refs.lessonList.fetchLessons(true)
        } catch (error) {
          this.$message.error('删除失败：' + error.message)
        } finally {
          this.$loading().close()
        }
      }).catch(() => {
        // 用户取消删除
      })
    },
    handleEdit(lessonId) {
      console.log('Edit lesson:', lessonId)
      this.$router.push(`/lesson/edit/${lessonId}`)
    },
    handleView(lessonId) {
      console.log('View lesson:', lessonId)
      this.$router.push(`/lesson/${lessonId}`)
    }
  }
}
</script>

<template>
  <div class="lesson-container">
    <div class="header">
      <h1>课程列表</h1>
      <el-button
        type="primary"
        icon="el-icon-plus"
        @click="handleCreate"
      >
        创建课程
      </el-button>
    </div>
    <LessonList
      ref="lessonList"
      @card-click="handleCardClick"
      @delete="handleDelete"
      @edit="handleEdit"
      @view="handleView"
    />
  </div>
</template>

<style scoped lang="scss">
.lesson-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 20px;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    h1 {
      margin: 0;
      color: #333;
    }
  }
}
</style>
