/* eslint-env node */

const fs = require('fs')

class Store {
  constructor (path) {
    this.path = path
    this.ready = false
    this.error = null
    this.queue = []
    fs.readFile(path, (err, data) => {
      if (err) {
        this.error = err
      } else {
        this.object = JSON.parse(data)
        this.ready = true
        this.queue.forEach(cb => cb(this.object))
        this.queue = []
      }
    })
  }

  enqueue (cb) {
    if (!this.ready) {
      this.queue.push(cb)
    } else {
      cb(this.object)
    }
  }

  update () {

  }

  /* get data () {
    if (this.error) throw this.error
    if (!this.ready) throw new Error('Not yet ready!')
    return this.object
  } */
}

module.exports = Store
