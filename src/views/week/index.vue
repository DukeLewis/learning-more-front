<script>
import { WeeklyPlan } from '@/api/WeeklyPlan'
import { Clazz } from '@/api/Clazz'
import { School } from '@/api/School'

export default {
  name: 'WeeklyPlan',
  data() {
    return {
      loading: false,
      planList: [],
      schoolList: [], // 添加学校列表
      classList: [],
      searchForm: {
        schoolId: '', // 添加学校筛选
        classId: '',
      },
      page: {
        current: 1,
        size: 10,
        total: 0
      }
    }
  },
  created() {
    this.fetchSchoolList() // 添加获取学校列表
    this.fetchPlanList()
  },
  methods: {
    // 获取学校列表
    async fetchSchoolList() {
      try {
        const { data } = await School.listSchoolOverview({
          pageNum: 1,
          pageSize: 100
        })
        this.schoolList = data
      } catch (error) {
        this.$message.error('获取学校列表失败：' + error.message)
      }
    },
    // 获取班级列表
    async fetchClassList() {
      try {
        if (!this.searchForm.schoolId) {
          this.classList = []
          return
        }
        const data = await Clazz.listClassOverview({
          schoolId: this.searchForm.schoolId
        })
        this.classList = data
      } catch (error) {
        this.$message.error('获取班级列表失败：' + error.message)
      }
    },
    // 获取周计划列表
    async fetchPlanList() {
      try {
        this.loading = true
        const { data, total } = await WeeklyPlan.listWeeklyPlanPage({
          schoolId: this.searchForm.schoolId,
          classId: this.searchForm.classId,
          pageNum: this.page.current,
          pageSize: this.page.size
        })
        this.planList = data
        this.page.total = total
      } catch (error) {
        this.$message.error('获取周计划列表失败：' + error.message)
      } finally {
        this.loading = false
      }
    },
    // 学校选择变化时触发
    handleSchoolChange() {
      this.searchForm.classId = '' // 清空班级选择
      this.fetchClassList() // 重新获取班级列表
      this.handleSearch()
    },
    handleSearch() {
      this.page.current = 1
      this.fetchPlanList()
    },
    resetSearch() {
      this.searchForm.schoolId = ''
      this.searchForm.classId = ''
      this.classList = []
      this.handleSearch()
    },
    handleSizeChange(val) {
      this.page.size = val
      this.fetchPlanList()
    },
    handleCurrentChange(val) {
      this.page.current = val
      this.fetchPlanList()
    },
    // 查看周计划详情
    handleView(row) {
      this.$router.push(`/weeklyPlan/${row.id}`)
    },
    // 编辑周计划
    handleEdit(row) {
      // TODO: 实现编辑逻辑
      console.log('编辑周计划:', row)
    },
    // 删除周计划
    handleDelete(row) {
      this.$confirm('确认删除该周计划吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        WeeklyPlan.deleteWeeklyPlan({ id: row.id })
          .then(() => {
            this.$message.success('删除成功')
            this.fetchPlanList()
          })
          .catch(error => {
            this.$message.error('删除失败：' + error.message)
          })
      }).catch(() => {})
    }
  }
}
</script>

<template>
  <div class="weekly-plan-container">
    <!-- 顶部标题 -->
    <div class="header">
      <h1>周计划列表</h1>
    </div>

    <!-- 搜索栏 -->
    <div class="search-bar">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="所属学校">
          <el-select
            v-model="searchForm.schoolId"
            placeholder="请选择学校"
            clearable
            @change="handleSchoolChange"
          >
            <el-option
              v-for="item in schoolList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="所属班级">
          <el-select
            v-model="searchForm.classId"
            placeholder="请选择班级"
            clearable
            :disabled="!searchForm.schoolId"
            @change="handleSearch"
          >
            <el-option
              v-for="item in classList"
              :key="item.id"
              :label="item.className"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 周计划列表 -->
    <el-table
      v-loading="loading"
      :data="planList"
      border
      style="width: 100%"
    >
      <el-table-column
        prop="name"
        label="周计划名称"
        min-width="200"
      />
      <el-table-column
        prop="schoolName"
        label="所属学校"
        min-width="150"
      />
      <el-table-column
        prop="className"
        label="所属班级"
        min-width="150"
      />
      <el-table-column
        prop="author"
        label="作者"
        min-width="120"
      />
      <el-table-column
        prop="updatedTime"
        label="最后更新时间"
        min-width="180"
      >
        <template slot-scope="scope">
          {{ scope.row.updatedTime }}
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="240"
        fixed="right"
        align="center"
      >
        <template slot-scope="scope">
          <div class="operation-buttons">
            <el-button
              type="text"
              class="view-btn"
              @click="handleView(scope.row)"
            >
              <i class="el-icon-view"></i>
              <span>查看</span>
            </el-button>
            <el-button
              type="text"
              class="edit-btn"
              @click="handleEdit(scope.row)"
            >
              <i class="el-icon-edit"></i>
              <span>编辑</span>
            </el-button>
            <el-button
              type="text"
              class="delete-btn"
              @click="handleDelete(scope.row)"
            >
              <i class="el-icon-delete"></i>
              <span>删除</span>
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination">
      <el-pagination
        :current-page="page.current"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="page.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.weekly-plan-container {
  padding: 20px;

  .header {
    margin-bottom: 20px;

    h1 {
      margin: 0;
      font-size: 24px;
      color: #303133;
    }
  }

  .search-bar {
    margin-bottom: 20px;
    padding: 20px;
    background: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  }

  .pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}

.operation-buttons {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;

  .el-button {
    padding: 6px 12px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    gap: 4px;
    transition: all 0.3s ease;

    i {
      font-size: 14px;
    }

    span {
      font-size: 13px;
    }

    &:hover {
      transform: translateY(-1px);
    }
  }

  .view-btn {
    color: #409EFF;
    background-color: rgba(64, 158, 255, 0.1);

    &:hover {
      background-color: rgba(64, 158, 255, 0.2);
    }
  }

  .edit-btn {
    color: #E6A23C;
    background-color: rgba(230, 162, 60, 0.1);

    &:hover {
      background-color: rgba(230, 162, 60, 0.2);
    }
  }

  .delete-btn {
    color: #F56C6C;
    background-color: rgba(245, 108, 108, 0.1);

    &:hover {
      background-color: rgba(245, 108, 108, 0.2);
    }
  }
}
</style>
