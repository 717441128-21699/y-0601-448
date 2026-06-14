<template>
  <div class="page-container">
    <div class="card-section">
      <div class="section-title">押金信息</div>
      <el-form :inline="true" :model="fees.deposit" class="deposit-form">
        <el-form-item label="押金总额">
          <el-input-number v-model="fees.deposit.total" :min="0" :precision="2" :step="100" style="width: 200px;" />
          <span style="margin-left: 5px;">元</span>
        </el-form-item>
      </el-form>
    </div>

    <el-tabs v-model="activeTab" type="card">
      <el-tab-pane label="维修费用" name="repair">
        <div class="card-section">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <span class="tab-total">合计：<strong>{{ fees.repair.total.toFixed(2) }}</strong> 元</span>
            <el-button type="primary" size="small" @click="openAddDialog('repair')">
              <el-icon><Plus /></el-icon>
              添加费用
            </el-button>
          </div>
          <el-table :data="fees.repair.items" border stripe>
            <el-table-column prop="name" label="项目名称" />
            <el-table-column prop="description" label="说明" />
            <el-table-column prop="amount" label="金额(元)" width="120" align="right">
              <template #default="{ row }">{{ row.amount.toFixed(2) }}</template>
            </el-table-column>
            <el-table-column label="操作" width="150">
              <template #default="{ row }">
                <el-button type="primary" link size="small" @click="editItem('repair', row)">编辑</el-button>
                <el-button type="danger" link size="small" @click="deleteItem('repair', row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>

      <el-tab-pane label="清洁费用" name="cleaning">
        <div class="card-section">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <span class="tab-total">合计：<strong>{{ fees.cleaning.total.toFixed(2) }}</strong> 元</span>
            <el-button type="primary" size="small" @click="openAddDialog('cleaning')">
              <el-icon><Plus /></el-icon>
              添加费用
            </el-button>
          </div>
          <el-table :data="fees.cleaning.items" border stripe>
            <el-table-column prop="name" label="项目名称" />
            <el-table-column prop="description" label="说明" />
            <el-table-column prop="amount" label="金额(元)" width="120" align="right">
              <template #default="{ row }">{{ row.amount.toFixed(2) }}</template>
            </el-table-column>
            <el-table-column label="操作" width="150">
              <template #default="{ row }">
                <el-button type="primary" link size="small" @click="editItem('cleaning', row)">编辑</el-button>
                <el-button type="danger" link size="small" @click="deleteItem('cleaning', row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>

      <el-tab-pane label="赔付费用" name="compensation">
        <div class="card-section">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <span class="tab-total">合计：<strong>{{ fees.compensation.total.toFixed(2) }}</strong> 元</span>
            <el-button type="primary" size="small" @click="openAddDialog('compensation')">
              <el-icon><Plus /></el-icon>
              添加费用
            </el-button>
          </div>
          <el-table :data="fees.compensation.items" border stripe>
            <el-table-column prop="name" label="项目名称" />
            <el-table-column prop="description" label="说明" />
            <el-table-column prop="amount" label="金额(元)" width="120" align="right">
              <template #default="{ row }">{{ row.amount.toFixed(2) }}</template>
            </el-table-column>
            <el-table-column label="操作" width="150">
              <template #default="{ row }">
                <el-button type="primary" link size="small" @click="editItem('compensation', row)">编辑</el-button>
                <el-button type="danger" link size="small" @click="deleteItem('compensation', row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>

      <el-tab-pane label="未结费用" name="unsettled">
        <div class="card-section">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <span class="tab-total">合计：<strong>{{ fees.unsettled.total.toFixed(2) }}</strong> 元</span>
            <el-button type="primary" size="small" @click="openAddDialog('unsettled')">
              <el-icon><Plus /></el-icon>
              添加费用
            </el-button>
          </div>
          <el-table :data="fees.unsettled.items" border stripe>
            <el-table-column prop="name" label="项目名称" />
            <el-table-column prop="description" label="说明" />
            <el-table-column prop="amount" label="金额(元)" width="120" align="right">
              <template #default="{ row }">{{ row.amount.toFixed(2) }}</template>
            </el-table-column>
            <el-table-column label="操作" width="150">
              <template #default="{ row }">
                <el-button type="primary" link size="small" @click="editItem('unsettled', row)">编辑</el-button>
                <el-button type="danger" link size="small" @click="deleteItem('unsettled', row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
    </el-tabs>

    <div class="card-section summary-card">
      <div class="section-title">费用汇总</div>
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="summary-item">
            <div class="summary-label">维修费用</div>
            <div class="summary-value repair">{{ fees.repair.total.toFixed(2) }} 元</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="summary-item">
            <div class="summary-label">清洁费用</div>
            <div class="summary-value cleaning">{{ fees.cleaning.total.toFixed(2) }} 元</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="summary-item">
            <div class="summary-label">赔付费用</div>
            <div class="summary-value compensation">{{ fees.compensation.total.toFixed(2) }} 元</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="summary-item">
            <div class="summary-label">未结费用</div>
            <div class="summary-value unsettled">{{ fees.unsettled.total.toFixed(2) }} 元</div>
          </div>
        </el-col>
      </el-row>
      <el-divider />
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="summary-item highlight">
            <div class="summary-label">扣款总计</div>
            <div class="summary-value total-deduct">{{ totalDeductions.toFixed(2) }} 元</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="summary-item highlight">
            <div class="summary-label">押金总额</div>
            <div class="summary-value deposit">{{ fees.deposit.total.toFixed(2) }} 元</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="summary-item highlight final">
            <div class="summary-label">应退/补金额</div>
            <div class="summary-value" :class="netRefund >= 0 ? 'refund' : 'charge'">
              {{ netRefund >= 0 ? '退' : '补' }} {{ Math.abs(netRefund).toFixed(2) }} 元
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <el-dialog v-model="showDialog" :title="dialogTitle" width="450px">
      <el-form :model="formData" label-width="80px">
        <el-form-item label="项目名称">
          <el-input v-model="formData.name" placeholder="请输入项目名称" />
        </el-form-item>
        <el-form-item label="金额">
          <el-input-number v-model="formData.amount" :min="0" :precision="2" :step="10" style="width: 100%;" />
          <span style="margin-left: 5px;">元</span>
        </el-form-item>
        <el-form-item label="说明">
          <el-input v-model="formData.description" type="textarea" :rows="3" placeholder="请输入费用说明" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showDialog = false">取消</el-button>
        <el-button type="primary" @click="saveItem">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useInspectionStore } from '@/stores/inspection'
import { ElMessage, ElMessageBox } from 'element-plus'

const store = useInspectionStore()
const { fees } = storeToRefs(store)

const activeTab = ref('repair')
const showDialog = ref(false)
const editingCategory = ref('')
const editingId = ref(null)
const dialogTitle = computed(() => editingId.value ? '编辑费用' : '添加费用')

const formData = reactive({
  name: '',
  amount: 0,
  description: ''
})

const totalDeductions = computed(() => {
  return fees.value.repair.total + fees.value.cleaning.total + 
         fees.value.compensation.total + fees.value.unsettled.total
})

const netRefund = computed(() => {
  return fees.value.deposit.total - totalDeductions.value
})

function openAddDialog(category) {
  editingCategory.value = category
  editingId.value = null
  formData.name = ''
  formData.amount = 0
  formData.description = ''
  showDialog.value = true
}

function editItem(category, row) {
  editingCategory.value = category
  editingId.value = row.id
  formData.name = row.name
  formData.amount = row.amount
  formData.description = row.description || ''
  showDialog.value = true
}

function saveItem() {
  if (!formData.name.trim()) {
    ElMessage.warning('请输入项目名称')
    return
  }
  if (formData.amount < 0) {
    ElMessage.warning('金额不能为负数')
    return
  }
  
  if (editingId.value) {
    store.updateFeeItem(editingCategory.value, editingId.value, { ...formData })
    ElMessage.success('修改成功')
  } else {
    store.addFeeItem(editingCategory.value, { ...formData })
    ElMessage.success('添加成功')
  }
  showDialog.value = false
}

function deleteItem(category, id) {
  ElMessageBox.confirm('确定删除此费用项吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    store.removeFeeItem(category, id)
    ElMessage.success('删除成功')
  }).catch(() => {})
}
</script>

<style scoped>
.deposit-form {
  margin: 0;
}

.tab-total {
  font-size: 14px;
  color: #606266;
}

.tab-total strong {
  font-size: 18px;
  color: #409eff;
}

.summary-card {
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
}

.summary-item {
  text-align: center;
  padding: 16px;
  background: #fff;
  border-radius: 8px;
}

.summary-label {
  font-size: 14px;
  color: #606266;
  margin-bottom: 8px;
}

.summary-value {
  font-size: 20px;
  font-weight: 600;
}

.summary-value.repair {
  color: #f56c6c;
}

.summary-value.cleaning {
  color: #e6a23c;
}

.summary-value.compensation {
  color: #909399;
}

.summary-value.unsettled {
  color: #67c23a;
}

.summary-item.highlight {
  padding: 20px;
}

.summary-item.highlight .summary-label {
  font-size: 15px;
  font-weight: 500;
  color: #303133;
}

.summary-item.highlight .summary-value {
  font-size: 24px;
}

.summary-value.total-deduct {
  color: #f56c6c;
}

.summary-value.deposit {
  color: #409eff;
}

.summary-value.refund {
  color: #67c23a;
}

.summary-value.charge {
  color: #f56c6c;
}

.summary-item.final {
  background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
  border: 2px solid #67c23a;
}
</style>
