/* eslint-env node */

class Awaiter {
  constructor () {
    this.promises = []
    this.acceptors = []
    this.rejectors = []
  }

  add (index = this.promises.length, executor) {
    let acceptor
    let rejector
    const promise = new Promise((resolve, reject) => {
      if (executor instanceof Promise) {
        executor.then(resolve).catch(reject)
      } else if (executor instanceof Function) {
        executor()
      }
      acceptor = resolve
      rejector = reject
    })
    this.promises[index] = promise
    this.acceptors[index] = acceptor
    this.rejectors[index] = rejector
    return index
  }

  resolve (index) {
    this.acceptors[index]()
  }

  reject (index) {
    this.rejectors[index]()
  }

  run () {
    return Promise.all(Object.values(this.promises))
  }
}

module.exports = Awaiter
