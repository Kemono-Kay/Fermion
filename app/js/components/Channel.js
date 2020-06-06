class Channel {
  constructor (storage, address, title) {
    this.messages = []
    this.settings = {
      logging: true,
      messageLimit: 100
    }

    this.channel = address
    this.title = title || address
    this.storage = storage
  }

  /**
   *
   * @param {*} message
   */
  addMessage (message) {
    this.messages.splice(this.messages.lastIndexOf(m => m.timestamp <= message.timestamp) + 1, 0, message)
    if (this.settings.logging) {
      this.log(message)
      message.logged = true
    }
  }

  async logAll () {
    this.messages.filter(m => !m.logged).forEach(async m => this.log(m))
  }

  log (message) {
    const existingMsg = this.storage.getItem(message.timestamp)
    if (existingMsg) {
      const o = JSON.parse(existingMsg)
      o.push(message.serialize())
      this.storage.setItem(JSON.stringify(o))
    } else {
      this.storage.setItem(JSON.stringify([message.serialize()]))
    }
  }
}

module.exports = Channel
