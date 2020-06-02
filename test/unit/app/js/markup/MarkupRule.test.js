/* global describe, it, expect */

const path = require('path')
const MarkupRule = require(path.join(process.cwd(), 'app', 'js', 'markup', 'MarkupRule.js'))

describe('The MarkupRule class', () => {
  it('should allow instantiation', () => {
    const rule = new MarkupRule(() => {})
    expect(rule).toBeTruthy()
  })
})
