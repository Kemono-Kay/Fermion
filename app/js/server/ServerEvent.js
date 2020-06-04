class ServerEvent {
  constructor () {
    this.observers = []
  }

  /**
   *
   * @param  {...Function} observers
   */
  subscribe (...observers) {
    this.observers.push(...observers)
  }

  /**
   *
   * @param  {...Function} observers
   */
  unsubscribe (...observers) {
    this.observers = this.observers.filter(observer => !observers.includes(observer))
  }

  notify (data) {
    this.observers.forEach(observer => observer(data))
  }
}

module.exports = ServerEvent
