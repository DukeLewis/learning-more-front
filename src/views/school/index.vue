<script>
import { School } from '@/api/School'

export default {
  name: 'School',
  data() {
    return {
      loading: false,
      submitting: false,
      dialogVisible: false,
      isEdit: false,
      schoolList: [],
      searchForm: {
        name: ''
      },
      schoolForm: {
        name: '',
        position: '',
        quantity: 0
      },
      rules: {
        name: [
          { required: true, message: '请输入学校名称', trigger: 'blur' },
          { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
        ],
        position: [
          { required: true, message: '请输入学校地址', trigger: 'blur' },
          { min: 5, max: 200, message: '长度在 5 到 200 个字符', trigger: 'blur' }
        ],
        quantity: [
          { required: true, message: '请输入学生人数', trigger: 'blur' },
          { type: 'number', min: 0, message: '学生人数必须大于等于0', trigger: 'blur' }
        ]
      },
      page: {
        current: 1,
        size: 10,
        total: 0
      }
    }
  },
  computed: {
    dialogTitle() {
      return this.isEdit ? '编辑学校' : '添加学校'
    }
  },
  created() {
    this.fetchSchoolList()
  },
  methods: {
    async fetchSchoolList() {
      try {
        this.loading = true
        // 这里调用获取学校列表的 API
        const { data, total } = await School.listSchoolOverview({
          searchString: this.searchForm.name,
          pageNum: this.page.current,
          pageSize: this.page.size
        })
        this.schoolList = data
        this.page.total = total
      } catch (error) {
        this.$message.error('获取学校列表失败：' + error.message)
      } finally {
        this.loading = false
      }
    },
    handleCreate() {
      this.isEdit = false
      this.dialogVisible = true
    },
    handleEdit(row) {
      this.isEdit = true
      this.schoolForm = { ...row }
      this.dialogVisible = true
    },
    async handleDelete(row) {
      try {
        await this.$confirm('确认删除该学校信息吗？', '提示', {
          type: 'warning'
        })
        // 这里调用删除学校的 API
        await School.deleteSchool({ schoolId: row.id })
        this.$message.success('删除成功')
        await this.fetchSchoolList()
      } catch (error) {
        if (error !== 'cancel') {
          this.$message.error('删除失败：' + error.message)
        }
      }
    },
    async submitForm() {
      try {
        await this.$refs.schoolForm.validate()
        this.submitting = true
        if (this.isEdit) {
          // 调用编辑 API
          await School.updateSchool({ ...this.schoolForm })
        } else {
          // 调用创建 API
          await School.createSchool({ ...this.schoolForm })
        }
        this.$message.success(this.isEdit ? '编辑成功' : '创建成功')
        this.dialogVisible = false
        await this.fetchSchoolList()
      } catch (error) {
        if (error !== false) {
          this.$message.error((this.isEdit ? '编辑' : '创建') + '失败：' + error.message)
        }
      } finally {
        this.submitting = false
      }
    },
    resetForm() {
      this.$refs.schoolForm?.resetFields()
      this.schoolForm = {
        name: '',
        position: '',
        quantity: 0
      }
    },
    handleSearch() {
      this.page.current = 1
      this.fetchSchoolList()
    },
    resetSearch() {
      this.searchForm.name = ''
      this.handleSearch()
    },
    handleSizeChange(val) {
      this.page.size = val
      this.fetchSchoolList()
    },
    handleCurrentChange(val) {
      this.page.current = val
      this.fetchSchoolList()
    },
    handleView(row) {
      this.$alert(`
        <div class="school-detail">
          <div class="detail-item">
            <span class="label">学校名称：</span>
            <span class="value">${row.name}</span>
          </div>
          <div class="detail-item">
            <span class="label">学校地址：</span>
            <span class="value">${row.position}</span>
          </div>
          <div class="detail-item">
            <span class="label">学生人数：</span>
            <span class="value">${row.quantity}</span>
          </div>
        </div>
      `, '学校详情', {
        confirmButtonText: '确定',
        customClass: 'detail-dialog',
        dangerouslyUseHTMLString: true
      })
    }
  }
}
</script>

<template>
  <div class="school-container">
    <!-- 顶部操作栏 -->
    <div class="header">
      <h1>学校信息</h1>
      <el-button
        type="primary"
        icon="el-icon-plus"
        @click="handleCreate"
      >
        添加学校
      </el-button>
    </div>

    <!-- 搜索栏 -->
    <div class="search-bar">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="学校名称">
          <el-input
            v-model="searchForm.name"
            placeholder="请输入学校名称"
            clearable
            @clear="handleSearch"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 学校列表 -->
    <el-table
      v-loading="loading"
      :data="schoolList"
      border
      style="width: 100%"
    >
      <el-table-column
        prop="name"
        label="学校名称"
        min-width="200"
      />
      <el-table-column
        prop="position"
        label="学校地址"
        min-width="300"
      />
      <el-table-column
        prop="quantity"
        label="学生人数"
        width="120"
      />
      <el-table-column
        label="操作"
        width="240"
        fixed="right"
        align="center"
      >
        <template slot-scope="scope">
          <div class="operation-buttons">
            <el-button
              size="mini"
              type="primary"
              @click="handleView(scope.row)"
            >
              <i class="el-icon-view"></i>
              查看
            </el-button>
            <el-button
              size="mini"
              type="primary"
              @click="handleEdit(scope.row)"
            >
              <i class="el-icon-edit"></i>
              编辑
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row)"
            >
              <i class="el-icon-delete"></i>
              删除
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

    <!-- 编辑/创建对话框 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="500px"
      @close="resetForm"
    >
      <el-form
        ref="schoolForm"
        :model="schoolForm"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="学校名称" prop="name">
          <el-input v-model="schoolForm.name" placeholder="请输入学校名称"/>
        </el-form-item>
        <el-form-item label="学校地址" prop="position">
          <el-input v-model="schoolForm.position" placeholder="请输入学校地址"/>
        </el-form-item>
        <el-form-item label="学生人数" prop="quantity">
          <el-input-number
            v-model="schoolForm.quantity"
            :min="0"
            :precision="0"
            :step="1"
            style="width: 200px"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm" :loading="submitting">
          确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.school-container {
  padding: 20px;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
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
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 6px 12px;
    border-radius: 4px;
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
}

:deep(.detail-dialog) {
  .el-message-box__content {
    padding: 20px;
  }

  .school-detail {
    .detail-item {
      margin-bottom: 16px;
      display: flex;
      align-items: center;

      &:last-child {
        margin-bottom: 0;
      }

      .label {
        color: #606266;
        width: 80px;
        text-align: right;
        margin-right: 12px;
      }

      .value {
        color: #303133;
        font-weight: 500;
      }
    }
  }
}
</style>
