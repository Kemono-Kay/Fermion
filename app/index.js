/* eslint-env node */

const electron = require('electron')
const url = require('url')
const path = require('path')
const fs = require('fs')
const { LocalStorage } = require('node-localstorage')
const Awaiter = require('./js/util/Awaiter')

const { app, BrowserWindow, ipcMain, shell } = electron

let appWindow
let config
let preferences

const appReadyAwaiter = new Awaiter()
appReadyAwaiter.add('ready-to-show')
appReadyAwaiter.add('load')
appReadyAwaiter.add('appInit')
appReadyAwaiter.run().then(() => {
  appWindow.webContents.send('windowstatus', 'part')
  appWindow.show()
}).catch(err => {
  console.error('Error occured during app launch:', err)
  app.exit(1)
})

/*
////// Constant highlight: //////

setTimeout(() => {
  const test = new BrowserWindow({
    frame: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    webPreferences: {
      preload: path.join(__dirname, 'js', 'preload.js'),
      nodeIntegration: true
    }
  })

  setTimeout(() => {
    const i = setInterval(() => {
      appWindow.flashFrame(true)
    })
    appWindow.once('focus', () => {
      clearInterval(i)
      appWindow.flashFrame(false)
    })
  }, 3000)
  appWindow.flashFrame(true)
}, 5000) */

app.on('ready', function () {
  appWindow = new BrowserWindow({
    show: false,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'js', 'preload.js'),
      nodeIntegration: true
    }
  })
  appWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'ui', 'appWindow.html'),
    protocol: 'file:',
    slashes: true
  }))

  appWindow.once('ready-to-show', () => {
    appReadyAwaiter.resolve('ready-to-show')
  })

  appWindow.on('closed', function () {
    appWindow = null
    app.quit()
  })

  appWindow.webContents.on('new-window', function (e, url) {
    e.preventDefault()
    shell.openExternal(url)
  })
})

ipcMain.handle('load', () => {
  appReadyAwaiter.resolve('load')
})

ipcMain.handle('window', (event, type) => {
  switch (type) {
    case 'minimize':
      appWindow.minimize()
      break
    case 'maximize':
      if (appWindow.isMaximized()) {
        appWindow.unmaximize()
        appWindow.webContents.send('windowstatus', 'part')
      } else {
        appWindow.maximize()
        appWindow.webContents.send('windowstatus', 'full')
      }
      break
    case 'close':
      appWindow.close()
      break
  }
})

/* const WebSocket = require('ws')
// const socket = new WebSocket('wss://chat.f-list.net/chat2')

socket.addEventListener('close', (...args) => {
  console.log('close', args[0])
})

socket.addEventListener('error', (...args) => {
  console.log('error', args[0])
})

socket.addEventListener('message', (...args) => {
  console.log('message', args)
})

socket.addEventListener('open', (...args) => {
  console.log('open', args)
}) */

try {
  config = require(path.join(__dirname, 'platform', `${process.platform}.json`))
} catch (err) {
  console.error(`Platform ${process.platform} is not supported.`)
  process.exit(1)
}

async function initApp () {
  const createFolder = function (folder) {
    return new Promise((resolve, reject) => {
      fs.access(path.join(process.cwd(), 'data', folder), fs.constants.F_OK, (err) => {
        if (err) {
          fs.mkdir(path.join(process.cwd(), 'data', folder), { recursive: true }, (err) => {
            if (err) {
              reject(err)
            } else {
              resolve()
            }
          })
        } else {
          resolve()
        }
      })
    })
  }

  await Promise.all([
    createFolder('logs'),
    createFolder('config'),
    createFolder('cache')
  ])

  const flatKeys = (o, p) => Object
    .keys(o)
    .map(i => typeof o[i] !== 'object' || o[i] === null
      ? p
        ? `${p}.${i}`
        : i
      : flatKeys(o[i], p
        ? `${p}.${i}`
        : i))
    .flat()

  const defaults = require(path.join(__dirname, 'defaults', 'preferences.json'))
  const defaultKeys = flatKeys(defaults)
  preferences = new LocalStorage(path.join(process.cwd(), 'data', 'config', 'preferences'), Infinity)

  defaultKeys.forEach(key => {
    if (preferences.getItem(key) === null) {
      preferences.setItem(key, key.split('.').reduce((acc, cur) => acc[cur], defaults))
    }
  })
}

initApp().then(appReadyAwaiter.resolve('appInit'))
