const ServerEvent = require('./ServerEvent')

class Server {
  constructor () {
    this.events = {}
  }

  registerEvent (event) {
    return (this.events[event] = new ServerEvent())
  }

  on (event, fn) {
    if (!this.events[event]) this.registerEvent(event)
    const e = this.events[event]
    e.subscribe(fn)
    return () => e.unsubscribe(fn)
  }
}

module.exports = Server
