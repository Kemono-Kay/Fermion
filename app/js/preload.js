/* eslint-env node, browser */

const { ipcRenderer } = require('electron')
const Awaiter = require('./Awaiter')

const FermionReadyEvent = new Event('FermionReady')
const FermionPreferencesUpdatedEvent = new Event('FermionPreferencesUpdated')
const FermionWindowUpdatedEvent = new Event('FermionWindowUpdated')

// Dispatch FermionReadyEvent once all requirements have been met.
const appReadyAwaiter = new Awaiter()
appReadyAwaiter.add('windowstatusReady')
appReadyAwaiter.add('preferencesReady')
appReadyAwaiter.run().then(() => window.dispatchEvent(FermionReadyEvent))

// Communicate back to app that the page has loaded.
window.addEventListener('load', () => {
  ipcRenderer.invoke('load')
}, { once: true })

// Handle incoming events from the app.
ipcRenderer
  .on('windowstatus', (event, message) => {
    window.bridge.windowstatus = message
    window.dispatchEvent(FermionWindowUpdatedEvent)
    appReadyAwaiter.resolve('windowstatusReady')
  })
  .on('preferences', (event, message) => {
    window.bridge.preferences = message
    window.dispatchEvent(FermionPreferencesUpdatedEvent)
    appReadyAwaiter.resolve('preferencesReady')
  })

// Export the app's interface with the Node backend to the window.
window.bridge = {
  windowstatus: null,
  preferences: null,
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
