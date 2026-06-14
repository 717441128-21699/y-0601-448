<template>
  <div class="page-container">
    <div class="card-section">
      <div class="section-title" style="display: flex; justify-content: space-between; align-items: center;">
        <span>验房清单</span>
        <div class="action-buttons">
          <el-radio-group v-model="activeTab" style="margin-right: 20px;">
            <el-radio-button label="livingRoom">客厅</el-radio-button>
            <el-radio-button label="bedroom">卧室</el-radio-button>
            <el-radio-button label="kitchen">厨房</el-radio-button>
            <el-radio-button label="bathroom">卫生间</el-radio-button>
          </el-radio-group>
          <el-button type="primary" size="small" @click="showAddDialog = true">
            <el-icon><Plus /></el-icon>
            添加检查项
          </el-button>
        </div>
      </div>
    </div>

    <div class="card-section">
      <el-table :data="currentItems" border stripe>
        <el-table-column prop="name" label="检查项目" width="150" fixed="left" />
        <el-table-column label="损坏" width="80" align="center">
          <template #default="{ row }">
            <el-checkbox v-model="row.damaged" @change="handleItemChange(row)" />
          </template>
        </el-table-column>
        <el-table-column label="缺失" width="80" align="center">
          <template #default="{ row }">
            <el-checkbox v-model="row.missing" @change="handleItemChange(row)" />
          </template>
        </el-table-column>
        <el-table-column label="清洁" width="80" align="center">
          <template #default="{ row }">
            <el-checkbox v-model="row.clean" @change="handleItemChange(row)" />
          </template>
        </el-table-column>
        <el-table-column label="可用" width="80" align="center">
          <template #default="{ row }">
            <el-checkbox v-model="row.usable" @change="handleItemChange(row)" />
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注说明">
          <template #default="{ row }">
            <el-input 
              v-model="row.remark" 
              placeholder="添加备注..."
              @blur="handleItemChange(row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getItemStatus(row).type" size="small">
              {{ getItemStatus(row).text }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" fixed="right">
          <template #default="{ row }">
            <el-button type="danger" link size="small" @click="removeItem(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="card-section">
      <div class="section-title">验房统计</div>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-statistic title="总检查项" :value="totalCount" />
        </el-col>
        <el-col :span="6">
          <el-statistic title="损坏项" :value="damagedCount">
            <template #suffix>
              <span style="color: #f56c6c; font-size: 16px;">项</span>
            </template>
          </el-statistic>
        </el-col>
        <el-col :span="6">
          <el-statistic title="缺失项" :value="missingCount">
            <template #suffix>
              <span style="color: #e6a23c; font-size: 16px;">项</span>
            </template>
          </el-statistic>
        </el-col>
        <el-col :span="6">
          <el-statistic title="正常项" :value="normalCount">
            <template #suffix>
              <span style="color: #67c23a; font-size: 16px;">项</span>
            </template>
          </el-statistic>
        </el-col>
      </el-row>
    </div>

    <div class="card-section">
      <div class="section-title">问题汇总</div>
      <div v-if="problemItems.length === 0" class="empty-state">
        <el-icon :size="48" color="#c0c4cc"><CircleCheck /></el-icon>
        <p style="margin-top: 10px;">所有检查项均正常</p>
      </div>
      <div v-else class="problem-list">
        <div v-for="item in problemItems" :key="item.id" class="problem-item">
          <div class="problem-header">
            <span class="problem-name">{{ item.name }}</span>
            <el-tag size="small" type="info">{{ getCategoryName(item.category) }}</el-tag>
          </div>
          <div class="problem-tags">
            <el-tag v-if="item.damaged" type="danger" size="small" style="margin-right: 5px;">损坏</el-tag>
            <el-tag v-if="item.missing" type="warning" size="small" style="margin-right: 5px;">缺失</el-tag>
            <el-tag v-if="!item.clean" type="info" size="small" style="margin-right: 5px;">不清洁</el-tag>
            <el-tag v-if="!item.usable === false" type="warning" size="small">不可用</el-tag>
          </div>
          <div v-if="item.remark" class="problem-remark">
            备注：{{ item.remark }}
          </div>
        </div>
      </div>
    </div>

    <el-dialog v-model="showAddDialog" title="添加检查项" width="400px">
      <el-form :model="newItemForm" label-width="80px">
        <el-form-item label="项目名称">
          <el-input v-model="newItemForm.name" placeholder="请输入检查项目名称" />
        </el-form-item>
        <el-form-item label="所属区域">
          <el-select v-model="newItemForm.category" style="width: 100%">
            <el-option label="客厅" value="livingRoom" />
            <el-option label="卧室" value="bedroom" />
            <el-option label="厨房" value="kitchen" />
            <el-option label="卫生间" value="bathroom" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddDialog = false">取消</el-button>
        <el-button type="primary" @click="addNewItem">确定</el-button>
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
const { inspectionItems } = storeToRefs(store)

const activeTab = ref('livingRoom')
const showAddDialog = ref(false)

const newItemForm = reactive({
  name: '',
  category: 'livingRoom'
})

const categoryNames = {
  livingRoom: '客厅',
  bedroom: '卧室',
  kitchen: '厨房',
  bathroom: '卫生间'
}

const currentItems = computed(() => {
  return inspectionItems.value[activeTab.value] || []
})

const allItems = computed(() => {
  const items = []
  for (const category in inspectionItems.value) {
    inspectionItems.value[category].forEach(item => {
      items.push({ ...item, category })
    })
  }
  return items
})

const totalCount = computed(() => allItems.value.length)

const damagedCount = computed(() => allItems.value.filter(i => i.damaged).length)

const missingCount = computed(() => allItems.value.filter(i => i.missing).length)

const normalCount = computed(() => allItems.value.filter(i => !i.damaged && !i.missing && i.clean && i.usable).length)

const problemItems = computed(() => {
  return allItems.value.filter(i => i.damaged || i.missing || !i.clean || i.usable === false)
})

function getCategoryName(category) {
  return categoryNames[category] || category
}

function getItemStatus(item) {
  if (item.damaged) return { type: 'danger', text: '损坏' }
  if (item.missing) return { type: 'warning', text: '缺失' }
  if (!item.clean) return { type: 'info', text: '不清洁' }
  if (item.usable === false) return { type: 'warning', text: '不可用' }
  return { type: 'success', text: '正常' }
}

function handleItemChange(row) {
  store.updateInspectionItem(activeTab.value, row.id, { ...row })
}

function addNewItem() {
  if (!newItemForm.name.trim()) {
    ElMessage.warning('请输入检查项目名称')
    return
  }
  store.addInspectionItem(newItemForm.category, {
    name: newItemForm.name,
    damaged: false,
    missing: false,
    clean: true,
    usable: true,
    remark: ''
  })
  ElMessage.success('添加成功')
  showAddDialog.value = false
  newItemForm.name = ''
}

function removeItem(id) {
  ElMessageBox.confirm('确定删除此检查项吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    store.removeInspectionItem(activeTab.value, id)
    ElMessage.success('删除成功')
  }).catch(() => {})
}
</script>

<style scoped>
.action-buttons {
  display: flex;
  align-items: center;
}

.problem-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.problem-item {
  padding: 12px 16px;
  background: #fef0f0;
  border-radius: 6px;
  border-left: 4px solid #f56c6c;
}

.problem-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.problem-name {
  font-weight: 600;
  color: #303133;
}

.problem-tags {
  margin-bottom: 6px;
}

.problem-remark {
  font-size: 13px;
  color: #606266;
  padding-top: 6px;
  border-top: 1px dashed #fbc4c4;
}
</style>
