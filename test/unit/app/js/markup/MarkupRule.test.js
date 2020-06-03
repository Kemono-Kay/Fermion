/* global describe, it, expect */

const path = require('path')
const MarkupRule = require(path.join(process.cwd(), 'app', 'js', 'markup', 'MarkupRule.js'))

describe('The MarkupRule class', () => {
  it('should allow instantiation', () => {
    const rule = new MarkupRule()
    expect(rule).toBeInstanceOf(MarkupRule)
  })

  it('should turn a given markdown pattern string into an array of markdown pattern strings', () => {
    const rule = new MarkupRule(null, 'foo')
    expect(rule.mdPattern).toEqual(['foo'])
  })

  it('should not change the given markdown pattern if it\'s already an array', () => {
    const rule = new MarkupRule(null, ['foo'])
    expect(rule.mdPattern).toEqual(['foo'])
  })
})

describe('A MarkupRule should, by default,', () => {
  it('not take arguments', () => {
    const rule = new MarkupRule()
    expect(rule.properties.takesArgument).toEqual(false)
  })

  it('allow for content', () => {
    const rule = new MarkupRule()
    expect(rule.properties.requiresClosing).toEqual(true)
  })

  it('allows other rules to be applied inside of it', () => {
    const rule = new MarkupRule()
    expect(rule.properties.disallowedChildren).toEqual([])
  })

  it('not render other rules it contains useless', () => {
    const rule = new MarkupRule()
    expect(rule.properties.uselessChildren).toEqual([])
  })

  it('require content', () => {
    const rule = new MarkupRule()
    expect(rule.properties.requiresContent).toEqual(true)
  })

  it('be marked as vanilla (shows up on F-Chat)', () => {
    const rule = new MarkupRule()
    expect(rule.properties.vanillaTag).toEqual(true)
  })

  it('allow arguments of any form', () => {
    const rule = new MarkupRule()
    expect(rule.properties.validateArgAsVanilla()).toEqual(true)
  })

  it('reduce to an italic BBCode hack tag if asked to vanillise itself', () => {
    const rule = new MarkupRule('foo')
    expect(rule.properties.vanillizeTag('bar', 'baz')).toEqual('[i=foo=baz][/i]bar[i=/foo][/i]')
    expect(rule.properties.vanillizeTag('bar')).toEqual('[i=foo][/i]bar[i=/foo][/i]')
  })

  it('ignore arguments in the closing tag, returning the \'node\' argument unmodified', () => {
    const rule = new MarkupRule()
    expect(rule.properties.handleClosingArg(null, 'foo')).toEqual('foo')
  })
})
