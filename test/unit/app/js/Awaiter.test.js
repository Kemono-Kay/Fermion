/* global describe, it, expect, jest */

const path = require('path')
const Awaiter = require(path.join(process.cwd(), 'app', 'js', 'Awaiter.js'))

describe(`The ${Awaiter.name} class`, () => {
  it('should allow instantiation', () => {
    const awaiter = new Awaiter()
    expect(awaiter).toBeTruthy()
  })
  it('should allow manual triggering of resolve states', async done => {
    const awaiter = new Awaiter()
    awaiter.run().then(() => done())
    awaiter.add('name')
    awaiter.resolve('name')
  })
  it('should allow manual triggering of reject states', async done => {
    const awaiter = new Awaiter()
    awaiter.add('name')
    awaiter.run().catch(() => done())
    awaiter.reject('name')
  })
})
describe('The run function', () => {
  it('should not throw when reject states are caught', async done => {
    const awaiter = new Awaiter()
    awaiter.add('name')
    awaiter.run().catch(() => {})
    awaiter.reject('name')
    done()
  })
  it('should reject as soon as one of the promises is rejected', async done => {
    const awaiter = new Awaiter()
    awaiter.add('name')
    awaiter.add('name2')
    awaiter.run().catch(() => done())
    awaiter.reject('name')
  })
  it('should not resolve until all promises are resolved', async done => {
    const awaiter = new Awaiter()
    const fn = jest.fn()
    awaiter.add('name1')
    awaiter.add('name2')
    awaiter.add('name3')
    awaiter.run().then(fn)
    awaiter.promises.name1.then(() => awaiter.resolve('name2'))
    awaiter.promises.name2.then(() => {
      expect(fn).not.toHaveBeenCalled()
      done()
    })
    awaiter.resolve('name1')
  })
})
describe('The add function', () => {
  it('should execute provided functions', async done => {
    const awaiter = new Awaiter()
    const fn = () => {
      done()
    }
    awaiter.add('name', fn)
  })
  it('should keep track of provided promises', async done => {
    const awaiter = new Awaiter()
    var r
    const p = new Promise(resolve => { r = resolve })
    awaiter.add('name', p)
    awaiter.run().then(() => done())
    r()
  })
  it('should return the index for the promise', async done => {
    const awaiter = new Awaiter()
    const i = awaiter.add()
    awaiter.run().then(() => done())
    awaiter.resolve(i)
  })
})
