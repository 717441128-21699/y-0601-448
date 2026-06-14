import { defineStore } from 'pinia';
import dayjs from 'dayjs';

export const useInspectionStore = defineStore('inspection', {
  state: () => ({
    roomInfo: {
      roomNumber: '',
      building: '',
      tenantName: '',
      tenantPhone: '',
      moveInDate: '',
      contractNo: '',
      keys: [
        { id: 1, name: '大门钥匙', count: 1, status: 'normal' },
        { id: 2, name: '卧室钥匙', count: 1, status: 'normal' }
      ],
      accessCards: [
        { id: 1, name: '门禁卡', count: 2, status: 'normal' }
      ],
      appliances: [
        { id: 1, name: '空调', brand: '格力', model: '', serialNo: '', status: 'normal' },
        { id: 2, name: '冰箱', brand: '海尔', model: '', serialNo: '', status: 'normal' },
        { id: 3, name: '洗衣机', brand: '小天鹅', model: '', serialNo: '', status: 'normal' },
        { id: 4, name: '电视', brand: '小米', model: '', serialNo: '', status: 'normal' },
        { id: 5, name: '热水器', brand: '美的', model: '', serialNo: '', status: 'normal' }
      ],
      lastHandover: {
        date: '',
        type: '',
        operator: '',
        remark: ''
      }
    },
    inspectionItems: {
      livingRoom: [
        { id: 'lr1', name: '墙面', damaged: false, missing: false, clean: true, usable: true, remark: '' },
        { id: 'lr2', name: '地面', damaged: false, missing: false, clean: true, usable: true, remark: '' },
        { id: 'lr3', name: '天花板', damaged: false, missing: false, clean: true, usable: true, remark: '' },
        { id: 'lr4', name: '门窗', damaged: false, missing: false, clean: true, usable: true, remark: '' },
        { id: 'lr5', name: '灯具', damaged: false, missing: false, clean: true, usable: true, remark: '' },
        { id: 'lr6', name: '沙发', damaged: false, missing: false, clean: true, usable: true, remark: '' },
        { id: 'lr7', name: '茶几', damaged: false, missing: false, clean: true, usable: true, remark: '' },
        { id: 'lr8', name: '电视柜', damaged: false, missing: false, clean: true, usable: true, remark: '' }
      ],
      bedroom: [
        { id: 'br1', name: '墙面', damaged: false, missing: false, clean: true, usable: true, remark: '' },
        { id: 'br2', name: '地面', damaged: false, missing: false, clean: true, usable: true, remark: '' },
        { id: 'br3', name: '天花板', damaged: false, missing: false, clean: true, usable: true, remark: '' },
        { id: 'br4', name: '门窗', damaged: false, missing: false, clean: true, usable: true, remark: '' },
        { id: 'br5', name: '灯具', damaged: false, missing: false, clean: true, usable: true, remark: '' },
        { id: 'br6', name: '床', damaged: false, missing: false, clean: true, usable: true, remark: '' },
        { id: 'br7', name: '衣柜', damaged: false, missing: false, clean: true, usable: true, remark: '' },
        { id: 'br8', name: '床头柜', damaged: false, missing: false, clean: true, usable: true, remark: '' }
      ],
      kitchen: [
        { id: 'kt1', name: '墙面', damaged: false, missing: false, clean: true, usable: true, remark: '' },
        { id: 'kt2', name: '地面', damaged: false, missing: false, clean: true, usable: true, remark: '' },
        { id: 'kt3', name: '天花板', damaged: false, missing: false, clean: true, usable: true, remark: '' },
        { id: 'kt4', name: '橱柜', damaged: false, missing: false, clean: true, usable: true, remark: '' },
        { id: 'kt5', name: '灶台', damaged: false, missing: false, clean: true, usable: true, remark: '' },
        { id: 'kt6', name: '抽油烟机', damaged: false, missing: false, clean: true, usable: true, remark: '' },
        { id: 'kt7', name: '水槽', damaged: false, missing: false, clean: true, usable: true, remark: '' },
        { id: 'kt8', name: '水龙头', damaged: false, missing: false, clean: true, usable: true, remark: '' }
      ],
      bathroom: [
        { id: 'bt1', name: '墙面', damaged: false, missing: false, clean: true, usable: true, remark: '' },
        { id: 'bt2', name: '地面', damaged: false, missing: false, clean: true, usable: true, remark: '' },
        { id: 'bt3', name: '天花板', damaged: false, missing: false, clean: true, usable: true, remark: '' },
        { id: 'bt4', name: '马桶', damaged: false, missing: false, clean: true, usable: true, remark: '' },
        { id: 'bt5', name: '洗手台', damaged: false, missing: false, clean: true, usable: true, remark: '' },
        { id: 'bt6', name: '淋浴设施', damaged: false, missing: false, clean: true, usable: true, remark: '' },
        { id: 'bt7', name: '镜子', damaged: false, missing: false, clean: true, usable: true, remark: '' },
        { id: 'bt8', name: '换气扇', damaged: false, missing: false, clean: true, usable: true, remark: '' }
      ]
    },
    photos: [],
    historicalPhotos: [],
    fees: {
      repair: { items: [], total: 0 },
      cleaning: { items: [], total: 0 },
      compensation: { items: [], total: 0 },
      deposit: { total: 0, refund: 0 },
      unsettled: { items: [], total: 0 }
    },
    handover: {
      type: 'checkout',
      date: dayjs().format('YYYY-MM-DD'),
      propertyStaff: '',
      tenantSignature: '',
      propertySignature: '',
      remarks: ''
    }
  }),
  getters: {
    totalFees: (state) => {
      return state.fees.repair.total + state.fees.cleaning.total + 
             state.fees.compensation.total + state.fees.unsettled.total
    },
    netRefund: (state) => {
      const totalDeductions = state.fees.repair.total + state.fees.cleaning.total + 
                              state.fees.compensation.total + state.fees.unsettled.total
      return state.fees.deposit.total - totalDeductions
    }
  },
  actions: {
    updateRoomInfo(info) {
      this.roomInfo = { ...this.roomInfo, ...info }
    },
    addKey(key) {
      this.roomInfo.keys.push({ id: Date.now(), ...key })
    },
    removeKey(id) {
      this.roomInfo.keys = this.roomInfo.keys.filter(k => k.id !== id)
    },
    addAccessCard(card) {
      this.roomInfo.accessCards.push({ id: Date.now(), ...card })
    },
    removeAccessCard(id) {
      this.roomInfo.accessCards = this.roomInfo.accessCards.filter(c => c.id !== id)
    },
    addAppliance(appliance) {
      this.roomInfo.appliances.push({ id: Date.now(), ...appliance })
    },
    removeAppliance(id) {
      this.roomInfo.appliances = this.roomInfo.appliances.filter(a => a.id !== id)
    },
    updateInspectionItem(category, id, updates) {
      const items = this.inspectionItems[category]
      const item = items.find(i => i.id === id)
      if (item) {
        Object.assign(item, updates)
      }
    },
    addInspectionItem(category, item) {
      if (this.inspectionItems[category]) {
        this.inspectionItems[category].push({ id: Date.now().toString(), ...item })
      }
    },
    removeInspectionItem(category, id) {
      if (this.inspectionItems[category]) {
        this.inspectionItems[category] = this.inspectionItems[category].filter(i => i.id !== id)
      }
    },
    addPhotos(photos) {
      const newPhotos = photos.map(p => ({
        ...p,
        id: Date.now() + Math.random(),
        location: '',
        description: '',
        uploadTime: dayjs().format('YYYY-MM-DD HH:mm:ss')
      }))
      this.photos.push(...newPhotos)
    },
    updatePhoto(id, updates) {
      const photo = this.photos.find(p => p.id === id)
      if (photo) {
        Object.assign(photo, updates)
      }
    },
    removePhoto(id) {
      this.photos = this.photos.filter(p => p.id !== id)
    },
    addFeeItem(category, item) {
      if (this.fees[category]) {
        const newItem = { id: Date.now(), ...item }
        this.fees[category].items.push(newItem)
        this.calculateCategoryTotal(category)
      }
    },
    removeFeeItem(category, id) {
      if (this.fees[category]) {
        this.fees[category].items = this.fees[category].items.filter(i => i.id !== id)
        this.calculateCategoryTotal(category)
      }
    },
    updateFeeItem(category, id, updates) {
      if (this.fees[category]) {
        const item = this.fees[category].items.find(i => i.id === id)
        if (item) {
          Object.assign(item, updates)
          this.calculateCategoryTotal(category)
        }
      }
    },
    calculateCategoryTotal(category) {
      if (this.fees[category] && this.fees[category].items) {
        this.fees[category].total = this.fees[category].items.reduce((sum, item) => sum + (item.amount || 0), 0)
      }
    },
    updateHandover(data) {
      this.handover = { ...this.handover, ...data }
    },
    async saveToStorage() {
      const data = {
        roomInfo: this.roomInfo,
        inspectionItems: this.inspectionItems,
        photos: this.photos,
        fees: this.fees,
        handover: this.handover
      }
      if (window.electronAPI) {
        await window.electronAPI.saveData('inspection_data', data)
      } else {
        localStorage.setItem('inspection_data', JSON.stringify(data))
      }
    },
    async loadFromStorage() {
      let data
      if (window.electronAPI) {
        data = await window.electronAPI.loadData('inspection_data')
      } else {
        const stored = localStorage.getItem('inspection_data')
        data = stored ? JSON.parse(stored) : null
      }
      if (data) {
        this.roomInfo = data.roomInfo || this.roomInfo
        this.inspectionItems = data.inspectionItems || this.inspectionItems
        this.photos = data.photos || []
        this.fees = data.fees || this.fees
        this.handover = data.handover || this.handover
      }
    }
  }
})
