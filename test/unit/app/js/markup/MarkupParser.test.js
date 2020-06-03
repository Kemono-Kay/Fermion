/* global describe, it, expect, jest */

const path = require('path')
const MarkupParser = require(path.join(process.cwd(), 'app', 'js', 'markup', 'MarkupParser.js'))

describe('The MarkupParser class', () => {
  it('should allow instantiation', () => {
    const parser = new MarkupParser(() => {})
    expect(parser).toBeInstanceOf(MarkupParser)
  })

  it('should initialise the DOM using the provided function', () => {
    const fn = jest.fn()
    new MarkupParser(fn) // eslint-disable-line no-new
    expect(fn).toHaveBeenCalled()
  })
})
