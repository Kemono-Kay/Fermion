class Message {
  constructor (messageDOM, user, timestamp = new Date().getTime()) {
    this.messageDOM = messageDOM
    this.timestamp = timestamp
    this.user = user
    this.logged = false
  }

  serialize () {
    return JSON.stringify({ t: this.timestamp, d: this.messageDOM.firstElementChild.outerHTML, u: this.user })
  }

  static deserialize () {

  }
}

module.exports = Message
