class Channel {
  constructor (store, address, title) {
    this.messages = []
    this.settings = {
      logging: true,
      messageLimit: 100
    }

    this.channel = address
    this.title = title || address
    this.store = store
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

  log (message) {
    this.store.update(message.serialize())
    // TODO
  }
}

module.exports = Channel
