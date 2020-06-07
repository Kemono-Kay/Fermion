/* eslint-env node, browser */

const { ipcRenderer } = require('electron')
const Awaiter = require('./util/Awaiter')
const path = require('path')
const { LocalStorage } = require('node-localstorage')
const ruleList = require('./markup/util/RuleList')(col => {
  const ctx = document.createElement('canvas').getContext('2d')
  ctx.fillStyle = col
  return ctx.fillStyle
})

// Dispatch FermionReadyEvent once all requirements have been met.
const appReadyAwaiter = new Awaiter()
appReadyAwaiter.add('windowstatusReady')
appReadyAwaiter.run().then(() => window.dispatchEvent(new Event('FermionReady')))

// Communicate back to app that the page has loaded.
window.addEventListener('load', () => {
  window.bridge.handleIcons()
  ipcRenderer.invoke('load')
  for (var i = 0; i < preferences.length; i++) {
    const e = new Event('FermionPreferencesUpdated')
    e.key = preferences.key(i).split('.')
    e.value = preferences.getItem(preferences.key(i))
    window.dispatchEvent(e)
  }
}, { once: true })

// Handle incoming events from the app.
ipcRenderer
  .on('windowstatus', (event, message) => {
    window.bridge.windowstatus = message
    window.dispatchEvent(new Event('FermionWindowUpdated'))
    appReadyAwaiter.resolve('windowstatusReady')
  })

// A simple wrapper to prevent potentially exposing unsafe variables and functions in the node-localstorage package.
class Preferences {
  constructor (path) {
    const ls = new LocalStorage(path, Infinity)

    this.setItem = (key, value) => {
      const e = new Event('FermionPreferencesUpdated')
      e.key = key.split('.')
      e.value = value
      ls.setItem(key, value)
      window.dispatchEvent(e)
    }

    Object.defineProperty(this, 'length', { get: () => ls.length })
    this.getItem = (k, v) => ls.getItem(k, v)
    this.removeItem = (k) => ls.removeItem(k)
    this.key = (k) => ls.key(k)
    this.clear = () => ls.clear()
  }
}
const preferences = new Preferences(path.join(process.cwd(), 'data', 'config', 'preferences'))

// Export the app's interface with the Node backend to the window.
window.bridge = {
  windowstatus: null,
  preferences: preferences,
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
    })
  },
  rehandleIcons: function (rootElement = document) {
    rootElement.querySelectorAll('.HandledIcon').forEach(el => {
      el.className = 'Icon'
    })
    window.bridge.handleIcons(rootElement)
  },
  handleColors: function (rootElement = document) {
    rootElement.querySelectorAll('.Markup.Color').forEach(el => {
      el.style.color = `rgb(${el.getAttribute('data-col')})`
    })
  },

  MarkupParser: class extends require('./markup/MarkupParser') {
    constructor () {
      super(() => document.implementation.createDocument(null, 'root'))
      this.addMarkupRules(...ruleList)
    }
  }
}
