<template>
  <div class="app-container">
    <el-card>
      <div class="filter-container">
        <el-form :inline="true" :model="listQuery" class="filter-form">
          <el-form-item label="姓名">
            <el-input
              v-model="listQuery.name"
              placeholder="请输入学生姓名"
              clearable
            />
          </el-form-item>
          <el-form-item label="班级">
            <el-input
              v-model="listQuery.className"
              placeholder="请输入班级名称"
              clearable
            />
          </el-form-item>
          <el-form-item label="性别">
            <el-select
              v-model="listQuery.gender"
              placeholder="请选择性别"
              clearable
            >
              <el-option label="男" value="男"/>
              <el-option label="女" value="女"/>
            </el-select>
          </el-form-item>
          <el-form-item label="年龄">
            <el-input-number
              v-model="listQuery.age"
              placeholder="请输入年龄"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleFilter">筛选</el-button>
            <el-button @click="resetFilters">重置</el-button>
          </el-form-item>
        </el-form>
        <div class="action-buttons">
          <el-button type="primary" @click="handleCreate">添加学生</el-button>
          <el-button type="success" @click="handleImport">导入数据</el-button>
        </div>
      </div>

      <el-table
        v-loading="listLoading"
        :data="list"
        border
        fit
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column label="ID" prop="id" align="center" width="80"/>
        <el-table-column label="姓名" prop="name" align="center"/>
        <el-table-column label="年龄" prop="age" align="center"/>
        <el-table-column label="性别" prop="gender" align="center"/>
        <el-table-column label="班级" prop="className" align="center"/>
        <el-table-column label="操作" align="center" width="230">
          <template slot-scope="{row}">
            <el-button type="info" size="mini" @click="handlePreview(row)">
              查看
            </el-button>
            <el-button type="primary" size="mini" @click="handleUpdate(row)">
              编辑
            </el-button>
            <el-button type="danger" size="mini" @click="handleDelete(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="getList"
      />
    </el-card>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="姓名" prop="name">
          <el-input v-model="temp.name"/>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input v-model="temp.age" type="number"/>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-select v-model="temp.gender" placeholder="请选择">
            <el-option label="男" value="男"/>
            <el-option label="女" value="女"/>
          </el-select>
        </el-form-item>
        <el-form-item label="班级" prop="className">
          <el-input v-model="temp.className"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确认
        </el-button>
      </div>
    </el-dialog>

    <!-- 修改查看详情对话框 -->
    <el-dialog
      title="学生详情"
      :visible.sync="previewVisible"
      width="800px"
      class="student-detail-dialog"
    >
      <div class="detail-content">
        <div class="basic-info">
          <el-card class="student-card">
            <div slot="header">
              <span>学生基本信息</span>
            </div>
            <el-row :gutter="20">
              <el-col :span="12"><strong>姓名：</strong> {{ studentDetail.name }}</el-col>
              <el-col :span="12"><strong>年龄：</strong> {{ studentDetail.age }}</el-col>
              <el-col :span="12"><strong>性别：</strong> {{ studentDetail.gender }}</el-col>
              <el-col :span="12"><strong>班级：</strong> {{ studentDetail.className }}</el-col>
            </el-row>
          </el-card>
        </div>

        <!-- 添加成绩图表 -->
        <div class="score-chart">
          <div id="scoreChart" style="width: 100%; height: 300px;"></div>
        </div>
        <!-- 成绩表格 -->
        <div class="subject-scores">
          <h3>学科成绩详情</h3>
          <el-table
            :data="studentDetail.subjects"
            border
            style="width: 100%"
          >
            <el-table-column
              prop="courseName"
              label="学科名称"
              align="center"
            />
            <el-table-column
              prop="score"
              label="成绩"
              align="center"
            />
          </el-table>
        </div>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="previewVisible = false">关闭</el-button>
      </div>
    </el-dialog>

    <!-- 导入数据对话框 -->
    <el-dialog
      title="导入学生数据"
      :visible.sync="importDialogVisible"
      width="500px"
      class="import-dialog"
    >
      <div class="import-content">
        <div class="template-section">
          <h4>下载导入模板</h4>
          <p>请先下载模板文件，按照模板格式填写数据后再导入</p>
          <el-button
            type="primary"
            @click="downloadTemplate"
            icon="el-icon-download"
          >
            下载模板
          </el-button>
        </div>
        <div class="upload-section">
          <h4>上传数据文件</h4>
          <p>请选择填写好的Excel文件进行上传</p>
          <el-upload
            class="upload-demo"
            drag
            action="#"
            :http-request="handleUpload"
            :before-upload="beforeUpload"
            :show-file-list="true"
            accept=".xlsx,.xls"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">只能上传xlsx/xls文件</div>
          </el-upload>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="importDialogVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { Student } from '@/api/Student'
import Pagination from '@/components/Pagination'
// 引入 ECharts
import * as echarts from 'echarts'

export default {
  name: 'Student',
  components: { Pagination },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        name: '',
        className: '',
        gender: '',
        age: ''
      },
      temp: {
        id: undefined,
        name: '',
        age: '',
        gender: '',
        className: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      rules: {
        name: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        age: [{ required: true, message: '年龄不能为空', trigger: 'blur' }],
        gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
        className: [{ required: true, message: '班级不能为空', trigger: 'blur' }]
      },
      previewVisible: false,
      studentDetail: {
        id: undefined,
        name: '',
        age: '',
        gender: '',
        className: '',
        subjects: []
      },
      chart: null, // 保存图表实例
      importDialogVisible: false
    }
  },
  created() {
    this.getList(true)
  },
  // 组件销毁时清理图表实例
  beforeDestroy() {
    if (this.chart) {
      this.chart.dispose()
      this.chart = null
    }
  },
  methods: {
    getList(init = false) {
      this.listLoading = true
      const { page, limit } = this.listQuery
      Student.fetchList(init ? {
        page,
        limit
      } : this.listQuery).then(response => {
        this.list = response.data
        this.total = response.total
        this.listLoading = false
      })
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          Student.createStudent(this.temp).then(() => {
            this.getList()
            this.dialogFormVisible = false
            this.$message.success('创建成功')
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    async handlePreview(row) {
      try {
        this.previewVisible = true
        const data = await Student.getStudentDetailById(row.id)
        this.studentDetail = data
        // 等待 DOM 更新后初始化图表
        this.$nextTick(() => {
          this.initChart()
        })
      } catch (error) {
        this.$message.error('获取学生详情失败：' + error.message)
      }
    },
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          Student.updateStudent(tempData).then(() => {
            this.getList()
            this.dialogFormVisible = false
            this.$message.success('更新成功')
          })
        }
      })
    },
    handleDelete(row) {
      this.$confirm('确认删除该学生信息吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        Student.deleteStudent({ studentId: row.id }).then(() => {
          this.getList()
          this.$message.success('删除成功')
        })
      })
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        name: '',
        age: '',
        gender: '',
        class: ''
      }
    },
    // 初始化成绩图表
    initChart() {
      // 销毁之前的图表实例
      if (this.chart) {
        this.chart.dispose()
      }

      const chartDom = document.getElementById('scoreChart')
      this.chart = echarts.init(chartDom)

      const option = {
        title: {
          text: '学科成绩分布',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: this.studentDetail.subjects.map(item => item.courseName),
          axisLabel: {
            interval: 0,
            rotate: 30
          }
        },
        yAxis: {
          type: 'value',
          name: '分数',
          min: 0,
          max: 100
        },
        series: [
          {
            name: '成绩',
            type: 'bar',
            data: this.studentDetail.subjects.map(item => item.score),
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#83bff6' },
                { offset: 0.5, color: '#188df0' },
                { offset: 1, color: '#188df0' }
              ])
            },
            label: {
              show: true,
              position: 'top',
              formatter: '{c} 分'
            }
          }
        ]
      }

      this.chart.setOption(option)
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    resetFilters() {
      this.listQuery = {
        page: 1,
        limit: 20,
        name: '',
        className: '',
        gender: '',
        age: ''
      }
      this.getList(true)
    },
    handleImport() {
      this.importDialogVisible = true
    },
    async downloadTemplate() {
      try {
        const response = await Student.downloadTemplate()
        // 创建下载链接
        const url = window.URL.createObjectURL(new Blob([response]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', '学生信息导入模板.xlsx')
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
      } catch (error) {
        this.$message.error('下载模板失败：' + error.message)
      }
    },
    beforeUpload(file) {
      const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.type === 'application/vnd.ms-excel'
      if (!isExcel) {
        this.$message.error('只能上传Excel文件！')
        return false
      }
      return true
    },
    async handleUpload(file) {
      try {
        const formData = new FormData()
        formData.append('file', file.file)
        await Student.importStudents(formData)
        this.$message.success('导入成功')
        this.importDialogVisible = false
        this.getList(true)
      } catch (error) {
        this.$message.error('导入失败：' + error.message)
      }
    }
  }
}
</script>

<style scoped lang="scss">
.filter-container {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;

  .filter-form {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    align-items: center;
    padding: 20px;
    background: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

    .el-input-number {
      width: 120px;
    }
  }
}

.student-detail-dialog {
  .detail-content {
    .basic-info {
      margin-bottom: 20px;
    }

    .score-chart {
      margin: 20px 0;
      background: #fff;
      padding: 20px;
      border-radius: 4px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
    }

    .subject-scores {
      h3 {
        margin: 0 0 15px;
        font-size: 16px;
        color: #303133;
      }
    }
  }
}

.action-buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.import-dialog {
  .import-content {
    .template-section {
      margin-bottom: 20px;
    }

    .upload-section {
      margin-bottom: 20px;
    }
  }
}
</style>
