/* eslint-env node */

const fs = require('fs')
const path = require('path')

class Storage {
  async load (filePath) {
    this.data = {}
    this.filePath = path.join(process.cwd, 'data', ...filePath)
    const content = await fs.promises.readFile(this.filePath, { encoding: 'utf-8' })
    content.split('\n').forEach(line => {
      const i = line.indexOf('=')
      const key = i !== -1 ? line.slice(0, i) : ''
      const value = i !== -1 ? line.slice(i + 1) : line
      this.add(key, value, false)
    })

    this.appendQueue = []
    this.writeDirty = false
    this.writing = false
  }

  async handleQueue () {
    this.writing = true
    await this.handleWrite()
    while (this.appendQueue.length) {
      await fs.promises.appendFile(this.filePath, this.appendQueue.shift())
      await this.handleWrite()
    }
    this.writing = false
  }

  async handleWrite () {
    if (this.writeDirty) {
      this.writeDirty = false
      this.appendQueue = []
      await fs.promises.writeFile(
        this.filePath,
        Object
          .keys(this.data)
          .map(key => this.data[key]
            .map(data => `${key}=${data}`)
            .join('\n'))
          .join('\n'))
    }
  }

  add (key, value, writeChange = true) {
    if (this.data[key] === undefined) this.data[key] = []
    this.data[key].push(value)
    if (writeChange) {
      this.appendQueue.push(`${key}=${value}`)
      if (!this.writing) {
        this.handleQueue()
      }
      // fs.promises.appendFile(this.filePath, `${key}=${value}`)
    }
  }

  set (key, value, writeChange = true) {
    this.data[key] = [value]
    if (writeChange) {
      this.writeDirty = true
      if (!this.writing) {
        this.handleQueue()
      }
    }
  }

  get (key) {
    return this.data[key]
  }

  getAll () {
    return this.data
  }

  remove (key, writeChange = true) {
    if (this.data[key]) {
      this.data[key] = undefined
      // see if this works at all
    }
  }
}

module.exports = Storage
