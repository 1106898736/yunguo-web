<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input v-model="listQuery.name" clearable class="filter-item" style="width: 200px;" placeholder="请输入名称" />
      <el-input v-model="listQuery.content" clearable class="filter-item" style="width: 200px;" placeholder="请输入内容" />
      <el-select v-model="listQuery.type" class="filter-item" placeholder="请选择果类">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"/>
      </el-select>
      <el-button v-permission="['GET /admin/ad/list']" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
      <el-button v-permission="['POST /admin/ad/create']" class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
      <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">导出</el-button>
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>

      <el-table-column align="center" label="ID" prop="id" sortable />

      <el-table-column align="center" label="名称" prop="name" />

      <el-table-column align="center" label="内容" width="260" :show-overflow-tooltip="true" prop="content" />

      <el-table-column align="center" label="供货时间" prop="supplydate" />

      <el-table-column align="center" label="供货价格" prop="price" />

      <el-table-column align="center" label="供货数量" prop="quantity" />

      <el-table-column align="center" label="是否启用" prop="enabled">
        <template slot-scope="scope">
          <el-tag :type="scope.row.enabled ? 'success' : 'error' ">{{ scope.row.enabled ? '启用' : '不启用' }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-permission="['POST /admin/ad/update']" type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button v-permission="['POST /admin/ad/delete']" type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <!-- 添加或修改对话框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="dataForm" status-icon label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="水果名称" prop="name">
          <el-input v-model="dataForm.name" />
        </el-form-item>
        <el-form-item label="水果类别" prop="type">
          <el-select v-model="dataForm.type" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="供货时间" prop="supplydate">
          <el-date-picker size="medium" v-model="dataForm.supplydate" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" type="date" placeholder="选择供货时间"/>
        </el-form-item>
        <el-form-item label="供货价格" prop="price">
          <el-input
            size="medium"
            type="number"
            v-model="dataForm.price"
            typeof="number"
            placeholder="请填写供货量（千克）"
          >
            <template slot="append">元/千克</template>
          </el-input>
        </el-form-item>
        <el-form-item label="供货量" prop="quantity">
          <el-input
            size="medium"
            type="number"
            v-model="dataForm.quantity"
            typeof="number"
            placeholder="请填写供货量"
          >
            <template slot="append">千克</template>
          </el-input>
        </el-form-item>
        <el-form-item label="简介" prop="content">
          <el-input
            size="medium"
            type="textarea"
            maxlength="60"
            v-model="dataForm.content"
            :autosize="{ minRows: 2, maxRows: 3 }"
            placeholder="请输入描述信息(60字以内)"
          />
        </el-form-item>
        <el-form-item label="是否启用" prop="enabled">
          <el-select v-model="dataForm.enabled" placeholder="请选择">
            <el-option :value="true" label="启用" />
            <el-option :value="false" label="不启用" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus==='create'" type="primary" @click="createData">确定</el-button>
        <el-button v-else type="primary" @click="updateData">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #20a0ff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}
.avatar {
  width: 145px;
  height: 145px;
  display: block;
}
</style>

<script>
import { listAd, createAd, updateAd, deleteAd } from '@/api/supply'
import { uploadPath } from '@/api/storage'
import { getToken } from '@/utils/auth'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'Supply',
  components: { Pagination },
  data() {
    return {
      options: [{
        value: '桃类',
        label: '桃类'
      }, {
        value: '梨类',
        label: '梨类'
      }],
      uploadPath,
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        name: undefined,
        content: undefined,
        sort: 'add_time',
        order: 'desc',
        type: ''
      },
      dataForm: {
        id: undefined,
        name: undefined,
        content: undefined,
        quantity: undefined,
        supplydate: undefined,
        type: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      rules: {
        name: [
          { required: true, message: '水果名称不能为空', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '内容不能为空', trigger: 'blur' }
        ],
        type: [{ required: true, message: '请选择类型', trigger: 'blur' }],
        supplydate: [{ required: true, message: '请填写供货时间', trigger: 'blur' }],
        quantity: [{ required: true, message: '请填写供货量', trigger: 'blur' }],
        price: [{ required: true, message: '请填写供货价格', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  computed: {
    headers() {
      return {
        'X-Litemall-Admin-Token': getToken()
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      listAd(this.listQuery)
        .then(response => {
          this.list = response.data.data.list
          this.total = response.data.data.total
          this.listLoading = false
        })
        .catch(() => {
          this.list = []
          this.total = 0
          this.listLoading = false
        })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    resetForm() {
      this.dataForm = {
        id: undefined,
        name: undefined,
        content: undefined,
        quantity: undefined,
        supplydate: undefined,
        position: 1,
        enabled: true
      }
    },
    handleCreate() {
      this.resetForm()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    uploadUrl: function(response) {
      this.dataForm.url = response.data.url
    },
    checkFileSize: function(file) {
      if (file.size > 1048576) {
        this.$message.error(`${file.name}文件大于1024KB，请选择小于1024KB大小的图片`)
        return false
      }
      return true
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          createAd(this.dataForm)
            .then(response => {
              this.list.unshift(response.data.data)
              this.dialogFormVisible = false
              this.$notify.success({
                title: '成功',
                message: '创建成功'
              })
            })
            .catch(response => {
              this.$notify.error({
                title: '失败',
                message: response.data.errmsg
              })
            })
        }
      })
    },
    handleUpdate(row) {
      this.dataForm = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          updateAd(this.dataForm)
            .then(() => {
              for (const v of this.list) {
                if (v.id === this.dataForm.id) {
                  const index = this.list.indexOf(v)
                  this.list.splice(index, 1, this.dataForm)
                  break
                }
              }
              this.dialogFormVisible = false
              this.$notify.success({
                title: '成功',
                message: '更新成功'
              })
            })
            .catch(response => {
              this.$notify.error({
                title: '失败',
                message: response.data.errmsg
              })
            })
        }
      })
    },
    handleDelete(row) {
      deleteAd(row)
        .then(response => {
          this.$notify.success({
            title: '成功',
            message: '删除成功'
          })
          this.getList()
        })
        .catch(response => {
          this.$notify.error({
            title: '失败',
            message: response.data.errmsg
          })
        })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = [
          '广告ID',
          '广告标题',
          '广告内容',
          '广告图片',
          '广告位置',
          '活动链接',
          '是否启用'
        ]
        const filterVal = [
          'id',
          'name,',
          'content',
          'quantity',
          'supplydate',
          'enabled'
        ]
        excel.export_json_to_excel2(tHeader, this.list, filterVal, '供货信息')
        this.downloadLoading = false
      })
    }
  }
}
</script>
