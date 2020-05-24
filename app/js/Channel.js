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

    this.el = document.createElement('div')
    this.el.classList.add('Channel', 'Main')

    const headerEl = document.createElement('div')
    const titleEl = document.createElement('div')
    const channelEl = document.createElement('ul')

    headerEl.classList.add('Channel', 'Header')
    titleEl.classList.add('Channel', 'Title')
    channelEl.classList.add('Channel', 'Body')

    this.el.appendChild(headerEl)
    headerEl.appendChild(titleEl)
    this.el.appendChild(channelEl)

    titleEl.appendChild(fa('hashtag')) // fa('at') for user
    titleEl.appendChild(document.createTextNode(` ${name}`))

    this.body = channelEl
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
    const textEl = document.createElement('span')
    const userEl = document.createElement('span')

    timestampEl.classList.add('Message', 'Timestamp')
    textEl.classList.add('Message', 'Body')
    userEl.classList.add('Message', 'User')

    userEl.tabIndex = 0
    userEl.draggable = true
    userEl.style.color = user.getColor()

    this.el.appendChild(timestampEl)
    this.el.appendChild(document.createTextNode(' '))
    this.el.appendChild(textEl)
    textEl.appendChild(userEl)

    timestampEl.appendChild(document.createTextNode(`[${formatTimestamp(Preferences.get('timestamptemplate').short, timestamp)}]`))
    timestampEl.setAttribute('title', `[${formatTimestamp(Preferences.get('timestamptemplate').full, timestamp)}]`)
    textEl.appendChild(document.createTextNode(`: ${text}`))
    userEl.appendChild(document.createTextNode(user.characterName))
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
