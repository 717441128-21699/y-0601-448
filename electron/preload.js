const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  selectImages: () => ipcRenderer.invoke('select-images'),
  saveFile: (options) => ipcRenderer.invoke('save-file', options),
  loadData: (key) => ipcRenderer.invoke('load-data', key),
  saveData: (key, data) => ipcRenderer.invoke('save-data', key, data),
  printWindow: () => ipcRenderer.invoke('print-window')
})
