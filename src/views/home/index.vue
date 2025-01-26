<template>
  <div>
    <el-container style="height: 100%;">
      <el-header style="height: 50%;">
        <el-image
          style="width: 100%;height: 200px"
          src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
          fit="fill"
        ></el-image>
      </el-header>
      <el-main style="height: 50%;">
        <div style="display: flex;gap: 12px;flex-wrap: wrap;width: 100%">
          <!--   班级列表   -->
          <el-card
            class="box-card"
            v-for="classOverviewInfo in classOverviewInfos"
            :key="classOverviewInfo.id"
            style="width: calc((100% - 36px) / 4);"
          >
            <div style="display: flex;flex-direction: column;gap: 12px">
              <div style="display: flex;justify-content: space-between;align-items: center;height: 40%">
                <div>{{ classOverviewInfo.className }}</div>
                <div>
                  <el-popover
                    placement="right"
                    width="100"
                    trigger="click"
                  >
                    <div class="cursor-pointer" @click="clickUpdatedClassInfoDialog(classOverviewInfo.id)">修改班级</div>
                    <div class="cursor-pointer" @click="deleteClassInfo(classOverviewInfo.id)">删除班级</div>
                    <div>
                      <div @click="clickClassInfoDialog(classOverviewInfo.id)" class="cursor-pointer">查看班级信息</div>
                    </div>
                    <el-button slot="reference" class="el-icon-more-outline settings-button"></el-button>
                  </el-popover>
                </div>
              </div>
              <div style="height: 40%">班级人数：{{ classOverviewInfo.studentCount }}</div>
              <div style="height: 20%">班级创建时间：{{ classOverviewInfo.createTime }}</div>
            </div>
            <!-- 班级信息修改窗口 -->
            <el-dialog
              :title="updatedClassInfo.className + '的班级信息'"
              :visible.sync="classInfoUpdateDialogVisible"
              width="30%"
              :append-to-body="true"
              :close-on-click-modal="false"
              :show-close="false"
              @open="openUpdatedClassInfoDialog"
              :before-close="closeUpdatedClassInfoDialog"
            >
              <el-form label-position="left" label-width="80px" :model="updatedClassInfo">
                <el-form-item label="班级名称">
                  <el-input v-model="updatedClassInfo.className"></el-input>
                </el-form-item>
                <el-form-item label="管理教师">
                  <el-input v-model="updatedClassInfo.teacherName"></el-input>
                </el-form-item>
                <el-form-item label="学生人数">
                  <el-input v-model="updatedClassInfo.studentCount"></el-input>
                </el-form-item>
                <el-form-item label="所属学校">
                  <el-input v-model="updatedClassInfo.school"></el-input>
                </el-form-item>
                <el-form-item label="所属年级">
                  <el-input v-model="updatedClassInfo.grade"></el-input>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="classInfoUpdateDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="verifyClassInfoUpdated">确 定</el-button>
              </div>
            </el-dialog>
            <!-- 班级信息详情弹窗 -->
            <el-dialog
              :title="classInfo.className + '的班级信息'"
              :visible.sync="classInfoDialogVisible"
              :append-to-body="true"
              :close-on-click-modal="false"
              @open="openClassInfoDialog"
              :show-close="false"
              :before-close="closeClassInfoDialog"
            >
              <div style="display: flex;flex-direction: column;gap: 12px">
                <div style="display: flex;justify-content: space-between">
                  <h3>{{ classInfo.className }}</h3>
                  <h3>{{ classInfo.teacherName }}</h3>
                </div>
                <div style="display: flex;justify-content: space-between">
                  <div>学生人数：{{ classInfo.studentCount }}</div>
                  <div>所属学校：{{ classInfo.school }}</div>
                  <div>所属年级：{{ classInfo.grade }}</div>
                </div>
                <div style="display: flex;flex-direction: column;gap: 8px">
                  <div>
                    学生列表:
                  </div>
                  <div>
                    <el-table
                      :data="studentOverviewInfos"
                      height="250"
                      border
                      style="width: 100%"
                    >
                      <el-table-column
                        prop="name"
                        label="姓名"
                        width="180"
                      >
                      </el-table-column>
                      <el-table-column
                        prop="gender"
                        label="性别"
                        width="180"
                      >
                      </el-table-column>
                      <el-table-column
                        prop="age"
                        label="年龄"
                      >
                      </el-table-column>
                    </el-table>
                  </div>
                </div>
                <div style="display: flex;gap: 36px">
                  <div>创建时间：{{ classInfo.createTime }}</div>
                  <div>信息更新时间：{{ classInfo.updateTime }}</div>
                </div>
              </div>
              <div slot="footer" class="dialog-footer">
                <el-button @click="classInfoDialogVisible = false">退出</el-button>
                <!--                <el-button type="primary" @click="classInfoDialogVisible = false">确 定</el-button>-->
              </div>
            </el-dialog>
          </el-card>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { Clazz } from '@/api/Clazz'
import { Student } from '@/api/Student'

export default {
  name: 'Home',
  data() {
    return {
      // 班级信息概览列表
      classOverviewInfos: [],
      // 班级信息详情弹窗是否可见
      classInfoDialogVisible: false,
      // 班级详细信息
      classInfo: {},
      // 学生概览信息列表
      studentOverviewInfos: [],
      // 班级信息修改窗口是否可见
      classInfoUpdateDialogVisible: false,
      // 更新的班级信息
      updatedClassInfo: {}
    }
  },
  computed: {
    // 是否需要更新班级信息
    needUpdatedClassInfo() {
      return JSON.stringify(this.classInfo) !== JSON.stringify(this.updatedClassInfo)
    }
  },
  created() {
    this.getClassOverViewInfos()
  },
  methods: {
    // 更新班级信息的回调
    verifyClassInfoUpdated() {
      if (this.needUpdatedClassInfo) {
        Clazz.updateClassInfo(this.updatedClassInfo).then(res => {
          if (res.success) {
            this.$message({
              type: 'success',
              message: '更新成功'
            })
          }
        }).catch(err => {
          this.$message({
            type: 'error',
            message: err
          })
        })
      }
      this.classInfoUpdateDialogVisible = false
    },
    // 关闭班级信息详情弹窗前的回调
    closeClassInfoDialog() {
      this.classInfo = {}
    },
    // 关闭班级信息修改窗口前的回调
    closeUpdatedClassInfoDialog() {
      this.updatedClassInfo = {}
      this.classInfo = {}
    },
    // 打开班级信息详情弹窗前的回调
    openUpdatedClassInfoDialog() {
    },
    // 打开班级信息详情弹窗前的回调
    openClassInfoDialog() {
    },
    // 获取班级信息概览列表
    getClassOverViewInfos() {
      Clazz.listClassOverview().then(res => {
        this.classOverviewInfos = res
      })
    },
    // 打开班级信息修改窗口的回调
    clickUpdatedClassInfoDialog(id) {
      this.classInfoUpdateDialogVisible = true
      Clazz.getClassInfo({ id }).then(res => {
        this.updatedClassInfo = JSON.parse(JSON.stringify(res))
        this.classInfo = res
      })
    },
    // 打开班级信息详情窗口的回调
    clickClassInfoDialog(id) {
      this.classInfoDialogVisible = true
      Clazz.getClassInfo({ id }).then(res => {
        this.classInfo = res
        console.log(res)
      })
      Student.listStudentOverview({ classId: id }).then(res => {
        this.studentOverviewInfos = res
        console.log(res)
      })
    },
    // 删除班级信息
    deleteClassInfo(id) {
      this.$alert('确定删除该班级吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        Clazz.deleteClassInfo({ id }).then(res => {
          if (res.success) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getClassOverViewInfos()
          } else {
            this.$message({
              type: 'error',
              message: '删除失败!'
            })
          }
        })
      })
    }
  }
}
</script>

<style scoped lang="scss">
.settings-button {
  width: 24px;
  height: 24px;
  display: flex !important;
  align-items: center;
  justify-content: center;
}

.cursor-pointer {
  cursor: pointer;
}
</style>
