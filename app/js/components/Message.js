class Message {
  constructor (messageDOM, timestamp = new Date().getTime()) {
    this.messageDOM = messageDOM
    this.timestamp = timestamp
    this.logged = false
  }

  serialize () {
    return `${this.timestamp}:${this.messageDOM.firstElementChild.outerHTML}`
  }
}

module.exports = Message
