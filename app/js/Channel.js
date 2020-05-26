/* eslint-env browser */
/* eslint-disable no-unused-vars */
/* global formatTimestamp */

function fa (name, style = 's') {
  const el = document.createElement('span')
  el.classList.add(`fa${style}`)
  el.classList.add(`fa-${name}`)
  return el
}

class User {
  constructor (characterName, status) {
    this.characterName = characterName
    this.status = status || false
  }

  getColor () {
    return 'red'
  }
}

class Channel {
  constructor (name, logging) {
    this.messages = []
    this.logging = logging

    const titleEl = document.createElement('div')
    titleEl.classList.add('Channel', 'Title')
    titleEl.appendChild(fa('hashtag')) // fa('at') for user
    titleEl.appendChild(document.createTextNode(` ${name}`))

    const controlsEl = document.createElement('div')
    controlsEl.classList.add('Channel', 'Controls')
    this.controls = controlsEl

    const headerEl = document.createElement('div')
    headerEl.classList.add('Channel', 'Header')
    headerEl.appendChild(titleEl)
    headerEl.appendChild(controlsEl)

    const channelEl = document.createElement('ul')
    channelEl.classList.add('Channel', 'Body')
    this.body = channelEl

    this.el = document.createElement('div')
    this.el.classList.add('Channel', 'Main')
    this.el.appendChild(headerEl)
    this.el.appendChild(channelEl)
  }

  deactivate () {
    this.messages.splice(Preferences.get('pastmessagecount') || this.messages.length)
  }

  message (user, timestamp, text) {
    const msg = new ChatMessage(user, timestamp, text)
    this.messages.push(msg)
    this.body.appendChild(msg.el)
  }
}

const createControl = function (faName, name) {
  const el = document.createElement('button')
  el.classList.add('Channel', 'Control')

  el.appendChild(fa(faName))
  el.appendChild(document.createTextNode(` ${name}`))
  return el
}

class UserChannel extends Channel {
  constructor (name, logging) {
    super(name, logging)
    this.controls.appendChild(createControl('chevron-down', 'Profile'))
    this.controls.appendChild(createControl('copy', 'Logs'))
    this.controls.appendChild(createControl('sliders-h', 'Settings'))
    this.controls.appendChild(createControl('times', 'Close tab'))
    this.controls.appendChild(createControl('exclamation-triangle', 'Alert Staff'))
  }
}
class ChatChannel extends Channel {
  constructor (name, logging) {
    super(name, logging)
    /* this.controls.appendChild(createControl('chevron-down', 'Description'))
    this.controls.appendChild(createControl('copy', 'Logs'))
    this.controls.appendChild(createControl('sliders-h', 'Settings'))
    this.controls.appendChild(createControl('times', 'Close tab'))
    this.controls.appendChild(createControl('exclamation-triangle', 'Alert Staff')) */
    // this.controls.appendChild(createControl('ellipsis-v', ''))
    // this.controls.appendChild(createControl('times', ''))

    this.controls.appendChild(createControl('chevron-down', 'Description'))
    this.controls.appendChild(createControl('copy', 'Logs'))
    this.controls.appendChild(createControl('sliders-h', 'Settings'))
    this.controls.appendChild(createControl('times', 'Close tab'))
  }
}
class DefaultChannel extends Channel {
  constructor (name, logging) {
    super(name, logging)
    this.controls.appendChild(createControl('copy', 'Logs'))
    this.controls.appendChild(createControl('sliders-h', 'Settings'))
  }
}

class ChannelMessage {
  constructor () {
    this.el = document.createElement('li')
    this.el.classList.add('Message', 'Main')
  }
}

class ChatMessage extends ChannelMessage {
  constructor (user, timestamp, text) {
    super()
    this.timestamp = timestamp
    this.user = user
    this.text = text

    const timestampEl = document.createElement('span')
    timestampEl.classList.add('Message', 'Timestamp')
    timestampEl.setAttribute('title', `[${formatTimestamp(Preferences.get('timestamptemplate').full, timestamp)}]`)
    timestampEl.appendChild(document.createTextNode(`[${formatTimestamp(Preferences.get('timestamptemplate').short, timestamp)}]`))

    const userEl = document.createElement('span')
    userEl.classList.add('Message', 'User')
    userEl.tabIndex = 0
    userEl.draggable = true
    userEl.style.color = user.getColor()
    userEl.appendChild(document.createTextNode(user.characterName))

    const textEl = document.createElement('span')
    textEl.classList.add('Message', 'Body')
    textEl.appendChild(userEl)
    textEl.appendChild(document.createTextNode(`: ${text}`))

    this.el.appendChild(timestampEl)
    this.el.appendChild(document.createTextNode(' '))
    this.el.appendChild(textEl)
  }
}

const Preferences = {
  get: function (key) {
    return window.bridge.preferences[key]
  }
}

const UI = {
  showUser: function (user) {

  },
  showChannel: function (channel) {
    document.querySelector('.Channel.Main').replaceWith(channel.el)
  }
}
