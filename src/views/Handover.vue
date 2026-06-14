<template>
  <div class="page-container">
    <div class="no-print action-bar">
      <div class="action-left">
        <el-radio-group v-model="handover.type" size="large">
          <el-radio-button label="checkin">收房</el-radio-button>
          <el-radio-button label="checkout">退房</el-radio-button>
        </el-radio-group>
      </div>
      <div class="action-right">
        <el-button @click="exportJSON">
          <el-icon><Download /></el-icon>
          导出数据
        </el-button>
        <el-button type="success" @click="handlePrint">
          <el-icon><Printer /></el-icon>
          打印
        </el-button>
        <el-button type="primary" @click="exportPDF">
          <el-icon><Document /></el-icon>
          导出PDF
        </el-button>
      </div>
    </div>

    <div ref="handoverContent" class="handover-document print-content">
      <div class="document-header">
        <h1 class="document-title">房屋交接验收单</h1>
        <p class="document-subtitle">{{ handover.type === 'checkin' ? '（入住交接）' : '（退租交接）' }}</p>
      </div>

      <div class="document-section">
        <h3 class="section-title">一、基本信息</h3>
        <el-descriptions :column="2" border class="info-table">
          <el-descriptions-item label="房间号">{{ roomInfo.roomNumber || '-' }}</el-descriptions-item>
          <el-descriptions-item label="楼栋">{{ roomInfo.building || '-' }}</el-descriptions-item>
          <el-descriptions-item label="承租人">{{ roomInfo.tenantName || '-' }}</el-descriptions-item>
          <el-descriptions-item label="联系电话">{{ roomInfo.tenantPhone || '-' }}</el-descriptions-item>
          <el-descriptions-item label="合同编号">{{ roomInfo.contractNo || '-' }}</el-descriptions-item>
          <el-descriptions-item label="交接日期">{{ handover.date || '-' }}</el-descriptions-item>
        </el-descriptions>
      </div>

      <div class="document-section">
        <h3 class="section-title">二、物品交接</h3>
        
        <h4 class="subsection-title">2.1 钥匙</h4>
        <el-table :data="roomInfo.keys" border size="small">
          <el-table-column prop="name" label="名称" />
          <el-table-column prop="count" label="数量" width="100" align="center" />
          <el-table-column prop="status" label="状态" width="120" align="center">
            <template #default="{ row }">{{ row.status === 'normal' ? '正常' : '异常' }}</template>
          </el-table-column>
        </el-table>

        <h4 class="subsection-title">2.2 门禁卡</h4>
        <el-table :data="roomInfo.accessCards" border size="small">
          <el-table-column prop="name" label="名称" />
          <el-table-column prop="count" label="数量" width="100" align="center" />
          <el-table-column prop="status" label="状态" width="120" align="center">
            <template #default="{ row }">{{ row.status === 'normal' ? '正常' : '异常' }}</template>
          </el-table-column>
        </el-table>

        <h4 class="subsection-title">2.3 家电设备</h4>
        <el-table :data="roomInfo.appliances" border size="small">
          <el-table-column prop="name" label="设备名称" width="120" />
          <el-table-column prop="brand" label="品牌" />
          <el-table-column prop="model" label="型号" />
          <el-table-column prop="serialNo" label="设备编号" />
          <el-table-column prop="status" label="状态" width="100" align="center">
            <template #default="{ row }">{{ row.status === 'normal' ? '正常' : '故障' }}</template>
          </el-table-column>
        </el-table>
      </div>

      <div class="document-section">
        <h3 class="section-title">三、验房情况</h3>
        
        <div v-for="(items, category) in inspectionItems" :key="category">
          <h4 class="subsection-title">{{ getCategoryName(category) }}</h4>
          <el-table :data="items" border size="small">
            <el-table-column prop="name" label="检查项目" width="150" />
            <el-table-column label="损坏" width="80" align="center">
              <template #default="{ row }">{{ row.damaged ? '是' : '否' }}</template>
            </el-table-column>
            <el-table-column label="缺失" width="80" align="center">
              <template #default="{ row }">{{ row.missing ? '是' : '否' }}</template>
            </el-table-column>
            <el-table-column label="清洁" width="80" align="center">
              <template #default="{ row }">{{ row.clean ? '是' : '否' }}</template>
            </el-table-column>
            <el-table-column label="可用" width="80" align="center">
              <template #default="{ row }">{{ row.usable ? '是' : '否' }}</template>
            </el-table-column>
            <el-table-column prop="remark" label="备注" />
          </el-table>
        </div>
      </div>

      <div class="document-section">
        <h3 class="section-title">四、费用结算</h3>
        <el-table :data="feeSummary" border size="small">
          <el-table-column prop="name" label="费用项目" />
          <el-table-column prop="amount" label="金额(元)" width="150" align="right">
            <template #default="{ row }">{{ row.amount.toFixed(2) }}</template>
          </el-table-column>
          <el-table-column prop="remark" label="备注" />
        </el-table>
        
        <div class="fee-total">
          <p><strong>扣款总计：</strong>{{ totalDeductions.toFixed(2) }} 元</p>
          <p><strong>押金总额：</strong>{{ fees.deposit.total.toFixed(2) }} 元</p>
          <p class="final-amount">
            <strong>{{ netRefund >= 0 ? '应退金额：' : '应补金额：' }}</strong>
            <span :class="netRefund >= 0 ? 'refund' : 'charge'">
              {{ Math.abs(netRefund).toFixed(2) }} 元
            </span>
          </p>
        </div>
      </div>

      <div class="document-section">
        <h3 class="section-title">五、备注说明</h3>
        <div class="remarks-box">
          {{ handover.remarks || '无' }}
        </div>
      </div>

      <div class="document-section">
        <h3 class="section-title">六、双方确认</h3>
        <div class="signature-section">
          <div class="signature-box">
            <p class="signature-label">物业经办人：</p>
            <div class="signature-canvas-wrapper" @click="openSignature('property')">
              <canvas 
                v-if="!handover.propertySignature" 
                class="signature-placeholder"
              >
              </canvas>
              <img 
                v-else 
                :src="handover.propertySignature" 
                class="signature-image"
                alt="物业签名"
              />
              <span v-if="!handover.propertySignature" class="signature-tip">点击签名</span>
            </div>
            <p class="signature-name">{{ handover.propertyStaff || '_______________' }}</p>
          </div>
          <div class="signature-box">
            <p class="signature-label">承租人：</p>
            <div class="signature-canvas-wrapper" @click="openSignature('tenant')">
              <canvas 
                v-if="!handover.tenantSignature" 
                class="signature-placeholder"
              >
              </canvas>
              <img 
                v-else 
                :src="handover.tenantSignature" 
                class="signature-image"
                alt="租户签名"
              />
              <span v-if="!handover.tenantSignature" class="signature-tip">点击签名</span>
            </div>
            <p class="signature-name">{{ roomInfo.tenantName || '_______________' }}</p>
          </div>
        </div>
        <div class="date-section">
          <p>交接日期：{{ handover.date }}</p>
        </div>
      </div>
    </div>

    <el-dialog 
      v-model="showSignatureDialog" 
      :title="signatureType === 'property' ? '物业签名' : '承租人签名'"
      width="500px"
      :close-on-click-modal="false"
    >
      <div class="signature-dialog-content">
        <canvas 
          ref="signatureCanvas"
          class="signature-canvas-element"
        ></canvas>
      </div>
      <div class="signature-dialog-actions">
        <el-button @click="clearSignature">清除</el-button>
        <el-button @click="showSignatureDialog = false">取消</el-button>
        <el-button type="primary" @click="saveSignature">确认签名</el-button>
      </div>
    </el-dialog>

    <el-dialog v-model="showRemarkDialog" title="编辑备注" width="500px" class="no-print">
      <el-input 
        v-model="remarkInput" 
        type="textarea" 
        :rows="6"
        placeholder="请输入备注说明..."
      />
      <template #footer>
        <el-button @click="showRemarkDialog = false">取消</el-button>
        <el-button type="primary" @click="saveRemark">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, nextTick, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useInspectionStore } from '@/stores/inspection'
import { ElMessage } from 'element-plus'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'
import SignaturePad from 'signature_pad'

const store = useInspectionStore()
const { roomInfo, inspectionItems, fees, handover } = storeToRefs(store)

const handoverContent = ref(null)
const signatureCanvas = ref(null)
let signaturePad = null

const showSignatureDialog = ref(false)
const showRemarkDialog = ref(false)
const signatureType = ref('tenant')
const remarkInput = ref('')

const categoryNames = {
  livingRoom: '客厅',
  bedroom: '卧室',
  kitchen: '厨房',
  bathroom: '卫生间'
}

function getCategoryName(category) {
  return categoryNames[category] || category
}

const totalDeductions = computed(() => {
  return fees.value.repair.total + fees.value.cleaning.total + 
         fees.value.compensation.total + fees.value.unsettled.total
})

const netRefund = computed(() => {
  return fees.value.deposit.total - totalDeductions.value
})

const feeSummary = computed(() => [
  { name: '维修费用', amount: fees.value.repair.total, remark: `${fees.value.repair.items.length} 项` },
  { name: '清洁费用', amount: fees.value.cleaning.total, remark: `${fees.value.cleaning.items.length} 项` },
  { name: '赔付费用', amount: fees.value.compensation.total, remark: `${fees.value.compensation.items.length} 项` },
  { name: '未结费用', amount: fees.value.unsettled.total, remark: `${fees.value.unsettled.items.length} 项` }
])

function openSignature(type) {
  signatureType.value = type
  showSignatureDialog.value = true
  nextTick(() => {
    initSignaturePad()
  })
}

function initSignaturePad() {
  if (signatureCanvas.value && !signaturePad) {
    const canvas = signatureCanvas.value
    const ratio = Math.max(window.devicePixelRatio || 1, 1)
    canvas.width = canvas.offsetWidth * ratio
    canvas.height = canvas.offsetHeight * ratio
    canvas.getContext('2d').scale(ratio, ratio)
    
    signaturePad = new SignaturePad(canvas, {
      backgroundColor: 'rgb(255, 255, 255)'
    })
    
    const existingSignature = signatureType.value === 'property' 
      ? handover.value.propertySignature 
      : handover.value.tenantSignature
    
    if (existingSignature) {
      signaturePad.fromDataURL(existingSignature)
    }
  }
}

function clearSignature() {
  if (signaturePad) {
    signaturePad.clear()
  }
}

function saveSignature() {
  if (signaturePad && !signaturePad.isEmpty()) {
    const dataUrl = signaturePad.toDataURL('image/png')
    if (signatureType.value === 'property') {
      handover.value.propertySignature = dataUrl
    } else {
      handover.value.tenantSignature = dataUrl
    }
    showSignatureDialog.value = false
    signaturePad = null
    ElMessage.success('签名保存成功')
  } else {
    ElMessage.warning('请先签名')
  }
}

function handlePrint() {
  if (window.electronAPI) {
    window.electronAPI.printWindow()
  } else {
    window.print()
  }
}

async function exportPDF() {
  if (!handoverContent.value) return
  
  try {
    ElMessage.info('正在生成PDF，请稍候...')
    
    const canvas = await html2canvas(handoverContent.value, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff'
    })
    
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('p', 'mm', 'a4')
    
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()
    const imgWidth = canvas.width
    const imgHeight = canvas.height
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
    const imgX = (pdfWidth - imgWidth * ratio) / 2
    const imgY = 10
    
    pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio)
    
    const pdfBlob = pdf.output('blob')
    const reader = new FileReader()
    reader.readAsDataURL(pdfBlob)
    
    reader.onloadend = function() {
      const base64data = reader.result
      if (window.electronAPI) {
        window.electronAPI.saveFile({
          defaultPath: `房屋交接单_${handover.value.date}.pdf`,
          content: base64data,
          type: 'pdf'
        }).then(result => {
          if (result.success) {
            ElMessage.success('PDF导出成功')
          }
        })
      } else {
        const link = document.createElement('a')
        link.download = `房屋交接单_${handover.value.date}.pdf`
        link.href = base64data
        link.click()
        ElMessage.success('PDF导出成功')
      }
    }
  } catch (e) {
    ElMessage.error('导出失败：' + e.message)
    console.error(e)
  }
}

async function exportJSON() {
  const data = {
    roomInfo: roomInfo.value,
    inspectionItems: inspectionItems.value,
    fees: fees.value,
    handover: handover.value
  }
  const jsonStr = JSON.stringify(data, null, 2)
  
  if (window.electronAPI) {
    await window.electronAPI.saveFile({
      defaultPath: `交接单数据_${handover.value.date}.json`,
      content: jsonStr,
      type: 'json'
    })
    ElMessage.success('数据导出成功')
  } else {
    const blob = new Blob([jsonStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `交接单数据_${handover.value.date}.json`
    link.click()
    URL.revokeObjectURL(url)
    ElMessage.success('数据导出成功')
  }
}

watch(showRemarkDialog, (val) => {
  if (val) {
    remarkInput.value = handover.value.remarks || ''
  }
})

function saveRemark() {
  handover.value.remarks = remarkInput.value
  showRemarkDialog.value = false
  ElMessage.success('备注保存成功')
}
</script>

<style scoped>
.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: #fff;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

.action-right {
  display: flex;
  gap: 10px;
}

.handover-document {
  background: #fff;
  padding: 40px 50px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  max-width: 900px;
  margin: 0 auto;
}

.document-header {
  text-align: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #303133;
}

.document-title {
  font-size: 28px;
  font-weight: 700;
  color: #303133;
  margin: 0;
}

.document-subtitle {
  font-size: 16px;
  color: #606266;
  margin-top: 8px;
}

.document-section {
  margin-bottom: 24px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 12px;
  padding-left: 10px;
  border-left: 4px solid #409eff;
}

.subsection-title {
  font-size: 14px;
  font-weight: 500;
  color: #606266;
  margin: 16px 0 8px 0;
}

.info-table {
  margin-bottom: 8px;
}

.fee-total {
  margin-top: 16px;
  padding: 16px;
  background: #f5f7fa;
  border-radius: 6px;
  text-align: right;
}

.fee-total p {
  margin-bottom: 8px;
  font-size: 14px;
}

.fee-total p:last-child {
  margin-bottom: 0;
}

.final-amount {
  font-size: 16px !important;
  margin-top: 10px !important;
  padding-top: 10px;
  border-top: 1px dashed #dcdfe6;
}

.final-amount .refund {
  color: #67c23a;
  font-size: 20px;
  font-weight: 700;
}

.final-amount .charge {
  color: #f56c6c;
  font-size: 20px;
  font-weight: 700;
}

.remarks-box {
  min-height: 60px;
  padding: 12px 16px;
  background: #f5f7fa;
  border-radius: 6px;
  border: 1px dashed #dcdfe6;
  color: #606266;
  cursor: pointer;
  transition: border-color 0.3s;
}

.remarks-box:hover {
  border-color: #409eff;
}

.signature-section {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
}

.signature-box {
  text-align: center;
  width: 200px;
}

.signature-label {
  font-size: 14px;
  color: #606266;
  margin-bottom: 8px;
}

.signature-canvas-wrapper {
  width: 200px;
  height: 100px;
  border: 1px dashed #dcdfe6;
  border-radius: 6px;
  position: relative;
  cursor: pointer;
  transition: border-color 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fafafa;
}

.signature-canvas-wrapper:hover {
  border-color: #409eff;
}

.signature-placeholder {
  display: none;
}

.signature-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.signature-tip {
  color: #c0c4cc;
  font-size: 13px;
}

.signature-name {
  margin-top: 10px;
  font-size: 14px;
  color: #303133;
}

.date-section {
  text-align: right;
  margin-top: 20px;
  padding-right: 40px;
  font-size: 14px;
  color: #606266;
}

.signature-dialog-content {
  padding: 20px 0;
}

.signature-canvas-element {
  width: 100%;
  height: 200px;
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  touch-action: none;
}

.signature-dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding-top: 16px;
  border-top: 1px solid #e4e7ed;
}

@media print {
  .no-print {
    display: none !important;
  }
  
  .page-container {
    padding: 0 !important;
    height: auto !important;
  }
  
  .handover-document {
    box-shadow: none !important;
    padding: 0 !important;
    max-width: 100% !important;
  }
}
</style>
