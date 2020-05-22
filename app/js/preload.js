const { ipcRenderer } = require('electron')

window.bridge = {
  preferencesEventListeners: [],
  windowstatusEventListeners: [],
  minimize: function () {
    ipcRenderer.invoke('window', 'minimize')
  },

  close: function () {
    ipcRenderer.invoke('window', 'close')
  },

  maximize: function () {
    ipcRenderer.invoke('window', 'maximize')
  }
}

ipcRenderer.on('preferences', (event, message) => {
  window.bridge.preferences = message
  window.bridge.preferencesEventListeners.forEach(cb => cb())
})

ipcRenderer.on('windowstatus', (event, message) => {
  window.bridge.windowstatus = message
  window.bridge.windowstatusEventListeners.forEach(cb => cb())
})
