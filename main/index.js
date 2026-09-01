const { app, BrowserWindow, globalShortcut, shell } = require('electron');
const path = require('path');
const { getPermission } = require('./utils/comm');
const isDevelopment = process.env.NODE_ENV === 'development'
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1800,
    height: 1000,
    minWidth: 1800,
    minHeight: 1000,
    title: 'MK1300 V2 Keyboard Software',
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      // allowRunningInsecureContent: true,
      // webSecurity: false,
      preload: path.join(__dirname, 'preload.js'),
      zoomFactor: 1.0 // 默认缩放比例
    },
    icon: path.resolve(__dirname, './assets/icon.ico')   // 应用内左上角图标
  });

  // // 根据窗口大小自适应缩放比例
  // const updateZoomFactor = () => {
  //   const [width, height] = mainWindow.getSize();
  //   const zoomFactor = (width > 1000 && height > 1000) ? 1 : 0.5;
  //   mainWindow.webContents.setZoomFactor(zoomFactor);
  // };
  //   // 监听窗口大小变化
  // mainWindow.on('resize', updateZoomFactor);
  
  // // 窗口加载完成后设置初始缩放比例
  // mainWindow.webContents.once('did-finish-load', updateZoomFactor);

  // 禁用放大缩小
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.setZoomFactor(1); // 固定缩放比例
    mainWindow.webContents.setVisualZoomLevelLimits(1, 1); // 禁用缩放
    mainWindow.webContents.setZoomLevel(0); // 默认缩放级别
  });

  mainWindow.webContents.session.on('select-hid-device', (event, details, callback) => {
    // Add events to handle devices being added or removed before the callback on
    // `select-hid-device` is called.

    mainWindow.webContents.session.on('hid-device-added', (event, device) => {
      console.log('hid-device-added FIRED WITH', device)
      // Optionally update details.deviceList
    })

    mainWindow.webContents.session.on('hid-device-removed', (event, device) => {
      console.log('hid-device-removed FIRED WITH', device)
      // Optionally update details.deviceList
    })

    event.preventDefault()
    if (details.deviceList && details.deviceList.length > 0) {
      details.deviceList.map((device) => {
        if (
          getPermission(device.vendorId, device.productId) // 这里需要传入vendorId和productId
        ) {
          callback(device.deviceId);
        }
      })
    }
  })

  mainWindow.webContents.session.setPermissionCheckHandler((webContents, permission, requestingOrigin, details) => {
    if (details && details.device) {
      if (permission === 'hid' && (
        getPermission(details.device.vendorId, details.device.productId) // 这里需要传入vendorId和productId
      )) {
        return true;
      }
    }
    return false;
  })

  mainWindow.webContents.session.setDevicePermissionHandler((details) => {
    if (details && details.device) {
      if (details.deviceType === 'hid' && (
        getPermission(details.device.vendorId, details.device.productId) // 这里需要传入vendorId和productId
      )) {
        return true;
      }
    }
    return false;
  })

  // and load the index.html of the app.
  if (isDevelopment) {
    //注册快捷键
    globalShortcut.register('CommandOrControl+\\', () => {
      mainWindow.webContents.openDevTools()
    })
    mainWindow.loadURL('http://localhost:3000');
  } else {
    // const entryPath = path.resolve(__dirname, '../build/index.html')
    // const entryPath = path.join(__dirname, '..', 'build', 'index.html');
    mainWindow.loadFile(path.join(__dirname, '../build/index.html'));
  }

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
};

app.commandLine.appendSwitch('disable-hid-blocklist')

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('web-contents-created', (e, webContents) => {
  webContents.setWindowOpenHandler(({url}) => {
    shell.openExternal(url);
    // return { action: 'deny' };
  })
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
