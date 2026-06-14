<template>
  <div class="page-container">
    <div class="card-section">
      <div class="section-title" style="display: flex; justify-content: space-between; align-items: center;">
        <span>照片取证</span>
        <div class="action-buttons">
          <el-button type="primary" @click="handleUploadPhotos">
            <el-icon><Upload /></el-icon>
            批量导入照片
          </el-button>
          <el-button @click="showCompareDialog = true" :disabled="photos.length < 2">
            <el-icon><Sort /></el-icon>
            照片对比
          </el-button>
        </div>
      </div>
    </div>

    <div class="card-section">
      <div class="filter-bar">
        <span class="filter-label">位置筛选：</span>
        <el-select v-model="filterLocation" placeholder="全部位置" clearable style="width: 150px; margin-right: 20px;">
          <el-option label="客厅" value="客厅" />
          <el-option label="卧室" value="卧室" />
          <el-option label="厨房" value="厨房" />
          <el-option label="卫生间" value="卫生间" />
          <el-option label="其他" value="其他" />
        </el-select>
        <span class="filter-label">共 {{ filteredPhotos.length }} 张照片</span>
      </div>
    </div>

    <div class="card-section">
      <div v-if="filteredPhotos.length === 0" class="empty-state">
        <el-icon :size="64" color="#c0c4cc"><Picture /></el-icon>
        <p style="margin-top: 16px; font-size: 14px;">暂无照片，请点击"批量导入照片"添加</p>
      </div>
      <div v-else class="photo-grid">
        <div v-for="photo in filteredPhotos" :key="photo.id" class="photo-item">
          <img :src="photo.data" :alt="photo.name" @click="previewPhoto(photo)" />
          <div class="photo-actions">
            <el-button type="primary" size="small" circle @click.stop="editPhoto(photo)">
              <el-icon><Edit /></el-icon>
            </el-button>
            <el-button type="danger" size="small" circle @click.stop="deletePhoto(photo.id)">
              <el-icon><Delete /></el-icon>
            </el-button>
          </div>
          <div class="photo-info">
            <div class="photo-name" :title="photo.name">{{ photo.name }}</div>
            <div class="photo-meta">
              <el-tag v-if="photo.location" type="info" size="small" style="margin-right: 4px;">
                {{ photo.location }}
              </el-tag>
              <span class="photo-time">{{ formatSize(photo.size) }}</span>
            </div>
            <div v-if="photo.description" class="photo-desc" :title="photo.description">
              {{ photo.description }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <el-dialog v-model="showEditDialog" title="编辑照片信息" width="500px">
      <el-form :model="editingPhoto" label-width="80px">
        <el-form-item label="照片名称">
          <el-input v-model="editingPhoto.name" />
        </el-form-item>
        <el-form-item label="拍摄位置">
          <el-select v-model="editingPhoto.location" placeholder="请选择位置" style="width: 100%">
            <el-option label="客厅" value="客厅" />
            <el-option label="卧室" value="卧室" />
            <el-option label="厨房" value="厨房" />
            <el-option label="卫生间" value="卫生间" />
            <el-option label="阳台" value="阳台" />
            <el-option label="其他" value="其他" />
          </el-select>
        </el-form-item>
        <el-form-item label="照片说明">
          <el-input 
            v-model="editingPhoto.description" 
            type="textarea" 
            :rows="4"
            placeholder="请输入照片说明，描述照片内容或问题点"
          />
        </el-form-item>
        <el-form-item label="上传时间">
          <span>{{ editingPhoto.uploadTime }}</span>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showEditDialog = false">取消</el-button>
        <el-button type="primary" @click="savePhotoEdit">保存</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="showPreview" title="照片预览" width="800px">
      <div class="preview-container">
        <img :src="previewPhotoData?.data" :alt="previewPhotoData?.name" />
      </div>
      <div v-if="previewPhotoData" class="preview-info">
        <p><strong>名称：</strong>{{ previewPhotoData.name }}</p>
        <p><strong>位置：</strong>{{ previewPhotoData.location || '未标注' }}</p>
        <p><strong>说明：</strong>{{ previewPhotoData.description || '无' }}</p>
        <p><strong>上传时间：</strong>{{ previewPhotoData.uploadTime }}</p>
      </div>
    </el-dialog>

    <el-dialog v-model="showCompareDialog" title="照片对比" width="900px">
      <div class="compare-selector">
        <div class="compare-item">
          <label>选择照片A：</label>
          <el-select v-model="comparePhotoA" placeholder="请选择" style="width: 200px;">
            <el-option 
              v-for="photo in photos" 
              :key="photo.id" 
              :label="photo.name || photo.id" 
              :value="photo"
            />
          </el-select>
        </div>
        <div class="compare-item">
          <label>选择照片B：</label>
          <el-select v-model="comparePhotoB" placeholder="请选择" style="width: 200px;">
            <el-option 
              v-for="photo in photos" 
              :key="photo.id" 
              :label="photo.name || photo.id" 
              :value="photo"
            />
          </el-select>
        </div>
      </div>
      <div class="compare-container">
        <div class="compare-panel">
          <div class="compare-label">照片 A</div>
          <div class="compare-image">
            <img v-if="comparePhotoA" :src="comparePhotoA.data" alt="照片A" />
            <div v-else class="compare-placeholder">请选择照片A</div>
          </div>
          <div v-if="comparePhotoA" class="compare-info">
            <p>{{ comparePhotoA.name }}</p>
            <p style="color: #909399; font-size: 12px;">{{ comparePhotoA.location || '未标注位置' }}</p>
          </div>
        </div>
        <div class="compare-divider">
          <el-icon :size="24"><Right /></el-icon>
        </div>
        <div class="compare-panel">
          <div class="compare-label">照片 B</div>
          <div class="compare-image">
            <img v-if="comparePhotoB" :src="comparePhotoB.data" alt="照片B" />
            <div v-else class="compare-placeholder">请选择照片B</div>
          </div>
          <div v-if="comparePhotoB" class="compare-info">
            <p>{{ comparePhotoB.name }}</p>
            <p style="color: #909399; font-size: 12px;">{{ comparePhotoB.location || '未标注位置' }}</p>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { storeToRefs } from 'pinia'
import { useInspectionStore } from '@/stores/inspection'
import { ElMessage, ElMessageBox } from 'element-plus'

const store = useInspectionStore()
const { photos } = storeToRefs(store)

const filterLocation = ref('')
const showEditDialog = ref(false)
const showPreview = ref(false)
const showCompareDialog = ref(false)
const previewPhotoData = ref(null)
const comparePhotoA = ref(null)
const comparePhotoB = ref(null)
const editingPhoto = reactive({
  id: null,
  name: '',
  location: '',
  description: ''
})

const filteredPhotos = computed(() => {
  if (!filterLocation.value) return photos.value
  return photos.value.filter(p => p.location === filterLocation.value)
})

async function handleUploadPhotos() {
  try {
    let selectedPhotos = []
    
    if (window.electronAPI) {
      selectedPhotos = await window.electronAPI.selectImages()
    } else {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'image/*'
      input.multiple = true
      
      selectedPhotos = await new Promise((resolve) => {
        input.onchange = (e) => {
          const files = Array.from(e.target.files)
          const results = files.map(file => ({
            name: file.name,
            size: file.size,
            data: URL.createObjectURL(file)
          }))
          resolve(results)
        }
        input.click()
      })
    }
    
    if (selectedPhotos.length > 0) {
      store.addPhotos(selectedPhotos)
      ElMessage.success(`成功导入 ${selectedPhotos.length} 张照片`)
    }
  } catch (e) {
    ElMessage.error('导入失败：' + e.message)
  }
}

function editPhoto(photo) {
  Object.assign(editingPhoto, {
    id: photo.id,
    name: photo.name,
    location: photo.location,
    description: photo.description
  })
  showEditDialog.value = true
}

function savePhotoEdit() {
  if (!editingPhoto.name.trim()) {
    ElMessage.warning('请输入照片名称')
    return
  }
  store.updatePhoto(editingPhoto.id, {
    name: editingPhoto.name,
    location: editingPhoto.location,
    description: editingPhoto.description
  })
  ElMessage.success('保存成功')
  showEditDialog.value = false
}

function deletePhoto(id) {
  ElMessageBox.confirm('确定删除这张照片吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    store.removePhoto(id)
    ElMessage.success('删除成功')
  }).catch(() => {})
}

function previewPhoto(photo) {
  previewPhotoData.value = photo
  showPreview.value = true
}

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}
</script>

<style scoped>
.action-buttons {
  display: flex;
  gap: 10px;
}

.filter-bar {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.filter-label {
  color: #606266;
  font-size: 14px;
}

.photo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.photo-item {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e4e7ed;
  background: #fff;
  cursor: pointer;
  transition: box-shadow 0.3s;
}

.photo-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.photo-item img {
  width: 100%;
  height: 160px;
  object-fit: cover;
  display: block;
}

.photo-actions {
  position: absolute;
  top: 8px;
  right: 8px;
  display: none;
  gap: 4px;
}

.photo-item:hover .photo-actions {
  display: flex;
}

.photo-info {
  padding: 10px 12px;
}

.photo-name {
  font-size: 13px;
  color: #303133;
  margin-bottom: 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.photo-meta {
  display: flex;
  align-items: center;
  margin-bottom: 6px;
}

.photo-time {
  font-size: 12px;
  color: #909399;
}

.photo-desc {
  font-size: 12px;
  color: #606266;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.preview-container {
  text-align: center;
  margin-bottom: 16px;
}

.preview-container img {
  max-width: 100%;
  max-height: 500px;
  border-radius: 4px;
}

.preview-info {
  background: #f5f7fa;
  padding: 16px;
  border-radius: 6px;
}

.preview-info p {
  margin-bottom: 8px;
  font-size: 14px;
}

.preview-info p:last-child {
  margin-bottom: 0;
}

.compare-selector {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
  padding: 16px;
  background: #f5f7fa;
  border-radius: 6px;
}

.compare-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.compare-container {
  display: flex;
  align-items: stretch;
  gap: 20px;
}

.compare-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.compare-label {
  text-align: center;
  font-weight: 600;
  margin-bottom: 10px;
  color: #303133;
}

.compare-image {
  flex: 1;
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  background: #fafafa;
}

.compare-image img {
  max-width: 100%;
  max-height: 400px;
  object-fit: contain;
}

.compare-placeholder {
  color: #c0c4cc;
  font-size: 14px;
}

.compare-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #c0c4cc;
}

.compare-info {
  margin-top: 10px;
  text-align: center;
}

.compare-info p {
  margin-bottom: 4px;
  font-size: 13px;
}
</style>
