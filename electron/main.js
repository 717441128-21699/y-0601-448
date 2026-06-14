const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')
const fs = require('fs')

let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 680,
    title: '租房交接验房系统',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173')
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

ipcMain.handle('select-images', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile', 'multiSelections'],
    filters: [
      { name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'gif', 'bmp'] }
    ]
  })
  
  if (!result.canceled) {
    const images = []
    for (const filePath of result.filePaths) {
      const stats = fs.statSync(filePath)
      const base64 = fs.readFileSync(filePath, 'base64')
      const ext = path.extname(filePath).slice(1)
      images.push({
        name: path.basename(filePath),
        path: filePath,
        size: stats.size,
        data: `data:image/${ext};base64,${base64}`
      })
    }
    return images
  }
  return []
})

ipcMain.handle('save-file', async (event, { defaultPath, content, type }) => {
  const result = await dialog.showSaveDialog(mainWindow, {
    defaultPath: defaultPath,
    filters: type === 'pdf' 
      ? [{ name: 'PDF', extensions: ['pdf'] }]
      : [{ name: 'JSON', extensions: ['json'] }]
  })
  
  if (!result.canceled) {
    if (type === 'pdf') {
      const buffer = Buffer.from(content.split(',')[1], 'base64')
      fs.writeFileSync(result.filePath, buffer)
    } else {
      fs.writeFileSync(result.filePath, content, 'utf-8')
    }
    return { success: true, path: result.filePath }
  }
  return { success: false }
})

ipcMain.handle('load-data', async (event, key) => {
  const userDataPath = app.getPath('userData')
  const filePath = path.join(userDataPath, `${key}.json`)
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8')
      return JSON.parse(data)
    }
  } catch (e) {
    console.error('load data error:', e)
  }
  return null
})

ipcMain.handle('save-data', async (event, key, data) => {
  const userDataPath = app.getPath('userData')
  const filePath = path.join(userDataPath, `${key}.json`)
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8')
    return { success: true }
  } catch (e) {
    console.error('save data error:', e)
    return { success: false, error: e.message }
  }
})

ipcMain.handle('print-window', async () => {
  mainWindow.webContents.print({ silent: false, printBackground: true })
})
