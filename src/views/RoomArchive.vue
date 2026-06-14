<template>
  <div class="page-container">
    <div class="card-section">
      <div class="section-title">基本信息</div>
      <el-form :model="roomInfo" label-width="100px">
        <div class="form-row">
          <el-form-item label="房间号" class="form-item">
            <el-input v-model="roomInfo.roomNumber" placeholder="请输入房间号" />
          </el-form-item>
          <el-form-item label="楼栋" class="form-item">
            <el-input v-model="roomInfo.building" placeholder="请输入楼栋" />
          </el-form-item>
        </div>
        <div class="form-row">
          <el-form-item label="承租人" class="form-item">
            <el-input v-model="roomInfo.tenantName" placeholder="请输入承租人姓名" />
          </el-form-item>
          <el-form-item label="联系电话" class="form-item">
            <el-input v-model="roomInfo.tenantPhone" placeholder="请输入联系电话" />
          </el-form-item>
        </div>
        <div class="form-row">
          <el-form-item label="入住日期" class="form-item">
            <el-date-picker
              v-model="roomInfo.moveInDate"
              type="date"
              placeholder="选择入住日期"
              style="width: 100%"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
          <el-form-item label="合同编号" class="form-item">
            <el-input v-model="roomInfo.contractNo" placeholder="请输入合同编号" />
          </el-form-item>
        </div>
      </el-form>
    </div>

    <div class="card-section">
      <div class="section-title" style="display: flex; justify-content: space-between; align-items: center;">
        <span>钥匙管理</span>
        <el-button type="primary" size="small" @click="showKeyDialog = true">
          <el-icon><Plus /></el-icon>
          添加
        </el-button>
      </div>
      <el-table :data="roomInfo.keys" border stripe>
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="count" label="数量" width="100" />
        <el-table-column prop="status" label="状态" width="120">
          <template #default="{ row }">
            <el-tag :type="row.status === 'normal' ? 'success' : 'danger'">
              {{ row.status === 'normal' ? '正常' : '异常' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="editKey(row)">编辑</el-button>
            <el-button type="danger" link size="small" @click="removeKey(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="card-section">
      <div class="section-title" style="display: flex; justify-content: space-between; align-items: center;">
        <span>门禁卡管理</span>
        <el-button type="primary" size="small" @click="showCardDialog = true">
          <el-icon><Plus /></el-icon>
          添加
        </el-button>
      </div>
      <el-table :data="roomInfo.accessCards" border stripe>
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="count" label="数量" width="100" />
        <el-table-column prop="status" label="状态" width="120">
          <template #default="{ row }">
            <el-tag :type="row.status === 'normal' ? 'success' : 'danger'">
              {{ row.status === 'normal' ? '正常' : '异常' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="editCard(row)">编辑</el-button>
            <el-button type="danger" link size="small" @click="removeCard(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="card-section">
      <div class="section-title" style="display: flex; justify-content: space-between; align-items: center;">
        <span>家电设备</span>
        <el-button type="primary" size="small" @click="showApplianceDialog = true">
          <el-icon><Plus /></el-icon>
          添加
        </el-button>
      </div>
      <el-table :data="roomInfo.appliances" border stripe>
        <el-table-column prop="name" label="设备名称" width="120" />
        <el-table-column prop="brand" label="品牌" />
        <el-table-column prop="model" label="型号" />
        <el-table-column prop="serialNo" label="设备编号" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'normal' ? 'success' : 'danger'">
              {{ row.status === 'normal' ? '正常' : '故障' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="editAppliance(row)">编辑</el-button>
            <el-button type="danger" link size="small" @click="removeAppliance(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="card-section">
      <div class="section-title">上次交接记录</div>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="交接日期">
          {{ roomInfo.lastHandover.date || '暂无记录' }}
        </el-descriptions-item>
        <el-descriptions-item label="交接类型">
          <el-tag v-if="roomInfo.lastHandover.type" :type="roomInfo.lastHandover.type === 'checkin' ? 'success' : 'warning'">
            {{ roomInfo.lastHandover.type === 'checkin' ? '收房' : '退房' }}
          </el-tag>
          <span v-else>暂无记录</span>
        </el-descriptions-item>
        <el-descriptions-item label="经办人">
          {{ roomInfo.lastHandover.operator || '暂无记录' }}
        </el-descriptions-item>
        <el-descriptions-item label="备注">
          {{ roomInfo.lastHandover.remark || '暂无记录' }}
        </el-descriptions-item>
      </el-descriptions>
    </div>

    <el-dialog v-model="showKeyDialog" :title="editingKey ? '编辑钥匙' : '添加钥匙'" width="400px">
      <el-form :model="keyForm" label-width="80px">
        <el-form-item label="名称">
          <el-input v-model="keyForm.name" placeholder="请输入钥匙名称" />
        </el-form-item>
        <el-form-item label="数量">
          <el-input-number v-model="keyForm.count" :min="0" style="width: 100%" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="keyForm.status" style="width: 100%">
            <el-option label="正常" value="normal" />
            <el-option label="异常" value="abnormal" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showKeyDialog = false">取消</el-button>
        <el-button type="primary" @click="saveKey">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="showCardDialog" :title="editingCard ? '编辑门禁卡' : '添加门禁卡'" width="400px">
      <el-form :model="cardForm" label-width="80px">
        <el-form-item label="名称">
          <el-input v-model="cardForm.name" placeholder="请输入门禁卡名称" />
        </el-form-item>
        <el-form-item label="数量">
          <el-input-number v-model="cardForm.count" :min="0" style="width: 100%" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="cardForm.status" style="width: 100%">
            <el-option label="正常" value="normal" />
            <el-option label="异常" value="abnormal" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showCardDialog = false">取消</el-button>
        <el-button type="primary" @click="saveCard">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="showApplianceDialog" :title="editingAppliance ? '编辑家电' : '添加家电'" width="500px">
      <el-form :model="applianceForm" label-width="80px">
        <el-form-item label="设备名称">
          <el-input v-model="applianceForm.name" placeholder="请输入设备名称" />
        </el-form-item>
        <el-form-item label="品牌">
          <el-input v-model="applianceForm.brand" placeholder="请输入品牌" />
        </el-form-item>
        <el-form-item label="型号">
          <el-input v-model="applianceForm.model" placeholder="请输入型号" />
        </el-form-item>
        <el-form-item label="设备编号">
          <el-input v-model="applianceForm.serialNo" placeholder="请输入设备编号" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="applianceForm.status" style="width: 100%">
            <el-option label="正常" value="normal" />
            <el-option label="故障" value="broken" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showApplianceDialog = false">取消</el-button>
        <el-button type="primary" @click="saveAppliance">确定</el-button>
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
const { roomInfo } = storeToRefs(store)

const showKeyDialog = ref(false)
const showCardDialog = ref(false)
const showApplianceDialog = ref(false)

const editingKey = ref(null)
const editingCard = ref(null)
const editingAppliance = ref(null)

const keyForm = reactive({ name: '', count: 1, status: 'normal' })
const cardForm = reactive({ name: '', count: 1, status: 'normal' })
const applianceForm = reactive({ name: '', brand: '', model: '', serialNo: '', status: 'normal' })

function editKey(row) {
  editingKey.value = row.id
  Object.assign(keyForm, { name: row.name, count: row.count, status: row.status })
  showKeyDialog.value = true
}

function saveKey() {
  if (!keyForm.name.trim()) {
    ElMessage.warning('请输入钥匙名称')
    return
  }
  if (editingKey.value) {
    const key = roomInfo.value.keys.find(k => k.id === editingKey.value)
    if (key) {
      Object.assign(key, keyForm)
    }
  } else {
    store.addKey({ ...keyForm })
  }
  showKeyDialog.value = false
  resetKeyForm()
}

function removeKey(id) {
  ElMessageBox.confirm('确定删除此钥匙记录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    store.removeKey(id)
    ElMessage.success('删除成功')
  }).catch(() => {})
}

function resetKeyForm() {
  editingKey.value = null
  Object.assign(keyForm, { name: '', count: 1, status: 'normal' })
}

function editCard(row) {
  editingCard.value = row.id
  Object.assign(cardForm, { name: row.name, count: row.count, status: row.status })
  showCardDialog.value = true
}

function saveCard() {
  if (!cardForm.name.trim()) {
    ElMessage.warning('请输入门禁卡名称')
    return
  }
  if (editingCard.value) {
    const card = roomInfo.value.accessCards.find(c => c.id === editingCard.value)
    if (card) {
      Object.assign(card, cardForm)
    }
  } else {
    store.addAccessCard({ ...cardForm })
  }
  showCardDialog.value = false
  resetCardForm()
}

function removeCard(id) {
  ElMessageBox.confirm('确定删除此门禁卡记录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    store.removeAccessCard(id)
    ElMessage.success('删除成功')
  }).catch(() => {})
}

function resetCardForm() {
  editingCard.value = null
  Object.assign(cardForm, { name: '', count: 1, status: 'normal' })
}

function editAppliance(row) {
  editingAppliance.value = row.id
  Object.assign(applianceForm, { name: row.name, brand: row.brand, model: row.model, serialNo: row.serialNo, status: row.status })
  showApplianceDialog.value = true
}

function saveAppliance() {
  if (!applianceForm.name.trim()) {
    ElMessage.warning('请输入设备名称')
    return
  }
  if (editingAppliance.value) {
    const appliance = roomInfo.value.appliances.find(a => a.id === editingAppliance.value)
    if (appliance) {
      Object.assign(appliance, applianceForm)
    }
  } else {
    store.addAppliance({ ...applianceForm })
  }
  showApplianceDialog.value = false
  resetApplianceForm()
}

function removeAppliance(id) {
  ElMessageBox.confirm('确定删除此家电设备吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    store.removeAppliance(id)
    ElMessage.success('删除成功')
  }).catch(() => {})
}

function resetApplianceForm() {
  editingAppliance.value = null
  Object.assign(applianceForm, { name: '', brand: '', model: '', serialNo: '', status: 'normal' })
}
</script>
