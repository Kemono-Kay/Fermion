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
  window.bridge.handleIcons()
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
  },
  handleIcons: function (rootElement = document) {
    rootElement.querySelectorAll('.Icon:not(.HandledIcon)').forEach(el => {
      const iconName = window.getComputedStyle(el).getPropertyValue('--fermion-icon').trim()
      const iconStyle = window.getComputedStyle(el).getPropertyValue('--fermion-icon-style').trim()
      el.classList.add(
        'HandledIcon',
        iconStyle || 'fas',
        `fa-${iconName}`)
      // el.classList.remove('Icon')
    })
  },
  rehandleIcons: function (rootElement = document) {
    rootElement.querySelectorAll('.HandledIcon').forEach(el => {
      el.className = 'Icon'
    })
    window.bridge.handleIcons(rootElement)
  }
}
