<script>
import { Course } from '@/api/Course'

export default {
  name: 'LessonList',
  data() {
    return {
      lessons: [],
      page: 1,
      pageSize: 8,
      loading: false,
      hasMore: true,
      scrollTimeout: null,
      scrollContainer: null,
      filterQuery: {
        name: '',
        type: '',
        duration: '',
        page: 1,
        pageSize: 8
      },
      total: 0
    }
  },
  methods: {
    handleFilter() {
      this.filterQuery.page = 1
      this.fetchLessons(true)
    },
    resetFilter() {
      this.filterQuery = {
        name: '',
        type: '',
        duration: '',
        page: 1,
        pageSize: 8
      }
      this.fetchLessons(true)
    },
    handleSizeChange(val) {
      this.filterQuery.pageSize = val
      this.fetchLessons(true)
    },
    handleCurrentChange(val) {
      this.filterQuery.page = val
      this.fetchLessons(true)
    },
    fetchLessons(needRefresh = false) {
      if (this.loading) {
        return
      }
      this.loading = true
      Course.listCourseOverviewPage(this.filterQuery)
        .then(res => {
          this.lessons = res.data
          this.total = res.total
        }).finally(() => {
          this.loading = false
        })
    },
    // handleScroll() {
    //   if (this.scrollTimeout) return
    //
    //   this.scrollTimeout = setTimeout(() => {
    //     if (!this.scrollContainer) return
    //
    //     const scrollHeight = this.scrollContainer.scrollHeight
    //     const scrollTop = this.scrollContainer.scrollTop
    //     const clientHeight = this.scrollContainer.clientHeight
    //     const threshold = 100
    //
    //     console.log('Scroll position:', {
    //       scrollHeight,
    //       scrollTop,
    //       clientHeight,
    //       difference: scrollHeight - scrollTop - clientHeight,
    //       hasMore: this.hasMore,
    //       loading: this.loading
    //     })
    //
    //     if (scrollHeight - scrollTop - clientHeight < threshold) {
    //       console.log('Triggering fetch')
    //       this.fetchLessons()
    //     }
    //     this.scrollTimeout = null
    //   }, 100)
    // },
    initScrollListener() {
      // this.$nextTick(() => {
      //   this.scrollContainer = this.$refs.listContainer
      //   if (this.scrollContainer) {
      //     console.log('Adding scroll listener to container')
      //     this.scrollContainer.addEventListener('scroll', this.handleScroll)
      //     this.handleScroll()
      //   } else {
      //     console.error('Scroll container not found')
      //   }
      // })
    }
    // removeScrollListener() {
    //   if (this.scrollContainer) {
    //     this.scrollContainer.removeEventListener('scroll', this.handleScroll)
    //     this.scrollContainer = null
    //   }
    //   if (this.scrollTimeout) {
    //     clearTimeout(this.scrollTimeout)
    //   }
    // }
  },
  mounted() {
    this.fetchLessons()
    this.initScrollListener()
  },
  beforeDestroy() {
    this.removeScrollListener()
  }
}
</script>

<template>
  <div ref="listContainer" class="lesson-list-container">
    <div class="filter-container">
      <el-form :inline="true" :model="filterQuery" class="filter-form">
        <el-form-item label="课程名称">
          <el-input
            v-model="filterQuery.name"
            placeholder="请输入课程名称"
            clearable
          />
        </el-form-item>
        <el-form-item label="课程类型">
          <el-input
            v-model="filterQuery.type"
            placeholder="请输入课程类型"
            clearable
          />
        </el-form-item>
        <el-form-item label="单节时长">
          <el-input
            v-model="filterQuery.duration"
            placeholder="请输入单节时长"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleFilter">筛选</el-button>
          <el-button @click="resetFilter">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="lesson-list">
      <div class="lesson-grid">
        <el-card
          v-for="lesson in lessons"
          :key="lesson.id"
          class="lesson-card"
          :body-style="{ padding: '0px' }"
          @click.native="$emit('card-click', lesson.id)"
        >
          <div class="lesson-info">
            <div class="card-header">
              <h2>{{ lesson.courseName }}</h2>
              <el-dropdown trigger="click" class="operation-dropdown">
                <el-button type="text" class="operation-btn" @click.stop>
                  <i class="el-icon-more"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="$emit('view', lesson.id)">查看详情</el-dropdown-item>
                  <el-dropdown-item @click.native="$emit('edit', lesson.id)">编辑课程</el-dropdown-item>
                  <el-dropdown-item @click.native="$emit('delete', lesson.id)">删除课程</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
            <p class="duration">课程时长：{{ lesson.duration }}</p>
            <p class="description">{{ lesson.courseDescription }}</p>
            <p v-if="lesson.updateTime" class="update-time">更新时间：{{ lesson.updateTime }}</p>
          </div>
        </el-card>
      </div>

      <div class="pagination-container">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="filterQuery.page"
          :page-sizes="[8, 16, 24, 32]"
          :page-size="filterQuery.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>

      <div v-if="loading" class="loading">
        <div class="loading-spinner"></div>
        <span>加载中...</span>
      </div>

      <div v-if="!hasMore && lessons.length > 0" class="no-more">
        没有更多课程了
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.lesson-list-container {
  flex: 1;
  height: 100%;
  overflow-y: auto;
  position: relative;
  border-radius: 4px;
  background: #f5f7fa;
}

.lesson-list {
  padding: 20px;
  min-height: 101%;
}

.lesson-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.lesson-card {
  height: 200px;
  position: relative;
  border: 1px solid #eee;
  border-radius: 8px;
  background: #fff;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  }
}

.lesson-info {
  padding: 16px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.card-header {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;

  h2 {
    margin: 0;
    padding-right: 30px;
  }
}

.operation-dropdown {
  position: absolute;
  top: 0;
  right: 0;
}

.operation-btn {
  padding: 0;
  font-size: 20px;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;

  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid #f3f3f3;
    border-top: 3px solid #3498db;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 10px;
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.no-more {
  text-align: center;
  padding: 20px;
  color: #999;
}

.filter-container {
  margin-bottom: 20px;
  padding: 20px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

  .filter-form {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    align-items: center;
  }
}

.pagination-container {
  margin-top: 20px;
  padding: 20px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: flex-end;
}
</style>
