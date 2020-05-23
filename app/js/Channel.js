/* eslint-env browser */

function fa (name, style = 's') {
  const el = document.createElement('span')
  el.classList.add(`fa${style}`)
  el.classList.add(`fa-${name}`)
  return el
}

function formatTimestamp (unix, format) {

}

class User {
  constructor (cname, status) {
    this.cname = cname
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
    this.el.classList.add('Fermion-ChannelArea')

    const headerEl = document.createElement('div')
    const titleEl = document.createElement('div')
    const channelEl = document.createElement('ul')

    headerEl.classList.add('Fermion-ChannelHeader')
    headerEl.classList.add('Fermion-ChannelTitle')
    channelEl.classList.add('Fermion-ChannelBody')

    this.el.appendChild(headerEl)
    headerEl.appendChild(titleEl)
    this.el.appendChild(channelEl)

    titleEl.appendChild(fa('hashtag'))
    titleEl.appendChild(document.createTextNode(` ${name}`))

    this.body = channelEl
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
    this.el.classList.add('Fermion-ChannelMessage')
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

    timestampEl.classList.add('Fermion-ChannelMessage-Timestamp')
    textEl.classList.add('Fermion-ChannelMessage-Body')
    userEl.classList.add('Fermion-ChannelMessage-User')

    userEl.tabIndex = 0
    userEl.draggable = true
    userEl.style.color = user.getColor()

    this.el.appendChild(timestampEl)
    this.el.appendChild(textEl)
    textEl.appendChild(userEl)

    timestampEl.appendChild(document.createTextNode(`[${formatTimestamp(timestamp, Preferences.get('tsFormatShort'))}]`))
    textEl.appendChild(document.createTextNode(`: ${text}`))
    userEl.appendChild(document.createTextNode(user.cname))
  }
}

const Preferences = {
  get: function (key) {
    return 'bla'
    // return window.bridge.properties[key]
  }
}

const UI = {
  showUser: function (user) {

  },
  showChannel: function (channel) {
    document.querySelector('.Fermion-ChannelArea').replaceWith(channel.el)
  }
}
