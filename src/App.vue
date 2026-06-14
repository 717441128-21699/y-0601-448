<template>
  <div class="app-container">
    <el-container class="layout">
      <el-aside width="220px" class="sidebar no-print">
        <div class="logo">
          <el-icon :size="28" color="#409eff"><House /></el-icon>
          <span class="logo-text">验房管理系统</span>
        </div>
        <el-menu
          :default-active="activeMenu"
          class="menu"
          background-color="#001529"
          text-color="#c0c4cc"
          active-text-color="#409eff"
          @select="handleMenuSelect"
        >
          <el-menu-item index="/room-archive">
            <el-icon><House /></el-icon>
            <span>房间档案</span>
          </el-menu-item>
          <el-menu-item index="/inspection">
            <el-icon><List /></el-icon>
            <span>验房清单</span>
          </el-menu-item>
          <el-menu-item index="/photos">
            <el-icon><Picture /></el-icon>
            <span>照片取证</span>
          </el-menu-item>
          <el-menu-item index="/fees">
            <el-icon><Money /></el-icon>
            <span>费用核算</span>
          </el-menu-item>
          <el-menu-item index="/handover">
            <el-icon><Document /></el-icon>
            <span>交接单</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header class="header no-print">
          <div class="header-left">
            <span class="page-title">{{ currentPageTitle }}</span>
          </div>
          <div class="header-right">
            <el-button type="primary" @click="saveData">
              <el-icon><CircleCheck /></el-icon>
              保存数据
            </el-button>
            <el-button @click="resetData">
              <el-icon><RefreshRight /></el-icon>
              重置
            </el-button>
          </div>
        </el-header>
        <el-main class="main-content">
          <router-view v-slot="{ Component }">
            <component :is="Component" />
          </router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useInspectionStore } from '@/stores/inspection'

const route = useRoute()
const router = useRouter()
const store = useInspectionStore()

const activeMenu = ref(route.path)
const currentPageTitle = computed(() => route.meta.title || '')

function handleMenuSelect(index) {
  router.push(index)
  activeMenu.value = index
}

async function saveData() {
  try {
    await store.saveToStorage()
    ElMessage.success('数据保存成功')
  } catch (e) {
    ElMessage.error('保存失败：' + e.message)
  }
}

function resetData() {
  ElMessageBox.confirm('确定要重置所有数据吗？此操作不可撤销。', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    localStorage.removeItem('inspection_data')
    location.reload()
  }).catch(() => {})
}

onMounted(async () => {
  await store.loadFromStorage()
})
</script>

<style scoped>
.app-container {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.layout {
  height: 100%;
}

.sidebar {
  background: #001529;
  display: flex;
  flex-direction: column;
}

.logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border-bottom: 1px solid #1f2d3d;
}

.logo-text {
  color: #fff;
  font-size: 16px;
  font-weight: 600;
}

.menu {
  flex: 1;
  border-right: none;
}

.header {
  background: #fff;
  border-bottom: 1px solid #e4e7ed;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 60px;
}

.header-left .page-title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.header-right {
  display: flex;
  gap: 10px;
}

.main-content {
  padding: 0;
  background: #f5f7fa;
  overflow-y: auto;
}
</style>
