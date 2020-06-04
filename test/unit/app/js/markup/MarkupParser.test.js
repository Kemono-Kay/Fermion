/* global describe, it, expect, jest, beforeEach */

const path = require('path')
const MarkupParser = require(path.join(process.cwd(), 'app', 'js', 'markup', 'MarkupParser.js'))
const MarkupRule = require(path.join(process.cwd(), 'app', 'js', 'markup', 'MarkupRule.js'))
const jsdom = new (require('jsdom').JSDOM)('...')
const initDOM = () => jsdom.window.document.implementation.createDocument(null, 'foo')
const handleClosingArg = jest.fn((_, n) => n)
const testMarkupRules = [
  new MarkupRule('bar', '[c]', { uselessChildren: ['bar'] }),
  new MarkupRule('baz', '!', { requiresClosing: false }),
  new MarkupRule('qux', '<c>', { vanillaTag: false }),
  new MarkupRule('quux', '(a){c}', { takesArgument: true, handleClosingArg: handleClosingArg }),
  new MarkupRule('quuz', '~~c~~', { requiresContent: false })
]

beforeEach(() => {
  handleClosingArg.mockClear()
})

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

  it('should throw if instantiated without a function to initialise the DOM with', () => {
    expect(() => new MarkupParser()).toThrow()
  })
})

describe('The \'addMarkupRules\' funtion', () => {
  it('should add to the parser\'s list of markup rules', () => {
    const MockRule = class extends MarkupRule {
      constructor (n) {
        super(n)
        this.mockGetName = jest.fn(() => n)
        Object.defineProperty(this, 'name', { get: this.mockGetName })
      }
    }

    const parser = new MarkupParser(() => {})
    const mockRule1 = new MockRule('foo')
    const mockRule2 = new MockRule('bar')
    parser.addMarkupRules(mockRule1, mockRule2)

    expect('foo' in parser.markupRules).toEqual(true)
    expect('bar' in parser.markupRules).toEqual(true)

    expect(mockRule1.mockGetName).toHaveBeenCalled()
    expect(mockRule2.mockGetName).toHaveBeenCalled()
  })

  it('should throw if the provided rule is invalid', () => {
    const parser = new MarkupParser(() => {})
    expect(() => parser.addMarkupRules({})).toThrow()
  })

  it('should add relevant information from the provided rules to the parser', () => {
    const parser = new MarkupParser(() => {})
    parser.addMarkupRules(new MarkupRule('foo', null, { requiresClosing: false, uselessChildren: ['bar'] }))
    parser.addMarkupRules(new MarkupRule('baz', null, { uselessChildren: ['bar'] }))
    parser.addMarkupRules(new MarkupRule('bar', null, { requiresClosing: false }))
    expect(parser.contentRules).toEqual(['baz'])
    expect(parser.uselessChildren).toEqual(['bar'])
  })
})

describe('The \'fromBBCode\' funtion', () => {
  describe.each([
    ['[quux][baz][/quux]', [
      ['quux', root => root.children[0].tagName],
      ['baz', root => root.children[0].children[0].tagName]
    ]],
    ['[baz][quux=foobar]x[/quux]', [
      ['quux', root => root.children[1].tagName],
      ['foobar', root => root.children[1].getAttribute('arg')],
      ['baz', root => root.children[0].tagName]
    ]],
    ['[bar]x[/bar][baz]', [
      ['bar', root => root.children[0].tagName],
      ['baz', root => root.children[1].tagName]
    ]],
    ['[bar][quuz][/quuz][/bar]', [
      ['bar', root => root.children[0].tagName],
      ['quuz', root => root.children[0].children[0].tagName]
    ]]
  ])('should parse %s into the DOM without change,', (bbcode, tests) => {
    const parser = new MarkupParser(initDOM)
    parser.addMarkupRules(...testMarkupRules)
    parser.fromBBCode(bbcode)
    tests.forEach(test => test.push(parser.dom.firstElementChild))

    it.each(tests.map(test => [
      test[0],
      parser.dom.firstElementChild.innerHTML,
      test[1],
      parser.dom.firstElementChild
    ]))('containing \'%s\' at the correct place in the output (%s)', (tagName, _, getSomeNode, domRoot) => {
      expect(() => getSomeNode(domRoot)).not.toThrow()
      expect(getSomeNode(domRoot)).toEqual(tagName)
    })
  })

  describe.each([
    ['[bar=qux][/bar][baz][bar=/qux][/bar]', [
      ['qux', root => root.children[0].tagName],
      ['baz', root => root.children[0].children[0].tagName]
    ]],
    ['[bar=qux][baz][/bar]x[bar=/qux][baz][/bar]', [
      ['qux', root => root.children[0].tagName],
      ['bar', root => root.children[0].children[0].tagName],
      ['baz', root => root.children[0].children[0].children[0].tagName],
      ['bar', root => root.children[1].tagName],
      ['baz', root => root.children[1].children[0].tagName]
    ]],
    ['[bar=quux=foobar][/bar]x[bar=/quux][/bar]', [
      ['quux', root => root.children[0].tagName],
      ['foobar', root => root.children[0].getAttribute('arg')]
    ]],
    ['[bar=baz]x[/bar]', [
      ['baz', root => root.children[0].tagName],
      ['bar', root => root.children[1].tagName]
    ]]
  ])('should parse hack tags in %s into DOM tags if the \'parseHackTags\' rule is set to true,', (bbcode, tests) => {
    const parser = new MarkupParser(initDOM)
    parser.addMarkupRules(...testMarkupRules)
    parser.fromBBCode(bbcode, { parseHackTags: true })
    tests.forEach(test => test.push(parser.dom.firstElementChild))
    // throw parser.contentRules
    it.each(tests.map(test => [
      test[0],
      parser.dom.firstElementChild.innerHTML,
      test[1],
      parser.dom.firstElementChild
    ]))('containing \'%s\' at the correct place in the output (%s)', (tagName, _, getSomeNode, domRoot) => {
      expect(() => getSomeNode(domRoot)).not.toThrow()
      expect(getSomeNode(domRoot)).toEqual(tagName)
    })
  })

  describe.each([
    ['[bar=qux]x[/bar][baz][bar=/qux]x[/bar]', [
      ['bar', root => root.children[0].tagName],
      ['baz', root => root.children[1].tagName],
      ['bar', root => root.children[2].tagName]
    ]],
    ['[bar=qux][baz][/bar]x[bar=/qux][baz][/bar]', [
      ['bar', root => root.children[0].tagName],
      ['baz', root => root.children[0].children[0].tagName],
      ['bar', root => root.children[1].tagName],
      ['baz', root => root.children[1].children[0].tagName]
    ]],
    ['[bar=qux][/bar][bar=quuz][/bar][bar=/quuz][/bar][bar=/qux][/bar]', [
      ['qux', root => root.children[0].tagName],
      ['quuz', root => root.children[0].children[0].tagName]
    ]]
  ])('should NOT parse hack tags in %s into DOM tags if the \'parseHackTags\' rule is set to false,', (bbcode, tests) => {
    const parser = new MarkupParser(initDOM)
    parser.addMarkupRules(...testMarkupRules)
    parser.fromBBCode(bbcode, { parseHackTags: false })
    tests.forEach(test => test.push(parser.dom.firstElementChild))

    it.each(tests.map(test => [
      test[0],
      parser.dom.firstElementChild.innerHTML,
      test[1],
      parser.dom.firstElementChild
    ]))('containing \'%s\' at the correct place in the output (%s)', (tagName, _, getSomeNode, domRoot) => {
      expect(() => getSomeNode(domRoot)).not.toThrow()
      expect(getSomeNode(domRoot)).toEqual(tagName)
    })
  })

  describe.each([
    ['[invalidTag]', [
      ['[invalidTag]', root => root.childNodes[0].textContent]
    ]],
    ['[invalidTag][bar][/invalidTag][/bar]', [
      ['bar', root => root.children[0].tagName],
      ['[invalidTag]', root => root.childNodes[0].textContent],
      ['[/invalidTag]', root => root.children[0].childNodes[0].textContent]
    ]]
  ])('should parse unclosed unknown tags in %s in plaintext,', (bbcode, tests) => {
    const parser = new MarkupParser(initDOM)
    parser.addMarkupRules(...testMarkupRules)
    parser.fromBBCode(bbcode, { parseHackTags: true })
    tests.forEach(test => test.push(parser.dom.firstElementChild))

    it.each(tests.map(test => [
      test[0],
      parser.dom.firstElementChild.innerHTML,
      test[1],
      parser.dom.firstElementChild
    ]))('containing \'%s\' at the correct place in the output (%s)', (tagName, _, getSomeNode, domRoot) => {
      expect(() => getSomeNode(domRoot)).not.toThrow()
      expect(getSomeNode(domRoot)).toEqual(tagName)
    })
  })

  describe.each([
    ['[invalidTag][bar]x[/bar][/invalidTag]', [
      ['invalidTag', root => root.children[0].tagName],
      ['true', root => root.children[0].getAttribute('unknown')],
      ['bar', root => root.children[0].children[0].tagName]
    ]],
    ['[bar]x[invalidTag=foobar][/invalidTag][/bar]', [
      ['bar', root => root.children[0].tagName],
      ['invalidTag', root => root.children[0].children[0].tagName],
      ['foobar', root => root.children[0].children[0].getAttribute('tag-arg')]
    ]]
  ])('should parse unknown tags in %s into the DOM clearly marked,', (bbcode, tests) => {
    const parser = new MarkupParser(initDOM)
    parser.addMarkupRules(...testMarkupRules)
    parser.fromBBCode(bbcode)
    tests.forEach(test => test.push(parser.dom.firstElementChild))

    it.each(tests.map(test => [
      test[0],
      parser.dom.firstElementChild.innerHTML,
      test[1],
      parser.dom.firstElementChild
    ]))('containing \'%s\' at the correct place in the output (%s)', (tagName, _, getSomeNode, domRoot) => {
      expect(() => getSomeNode(domRoot)).not.toThrow()
      expect(getSomeNode(domRoot)).toEqual(tagName)
    })
  })

  describe.each([
    ['[bar][bar][baz][/bar][/bar]', [
      ['bar', root => root.children[0].tagName],
      ['baz', root => root.children[0].children[0].tagName]
    ]],
    ['[bar][qux][bar]x[/bar][/qux][/bar]', [
      ['bar', root => root.children[0].tagName],
      ['qux', root => root.children[0].children[0].tagName],
      ['x', root => root.children[0].children[0].childNodes[0].textContent]
    ]]
  ])('should NOT parse redundant tags in %s into the DOM,', (bbcode, tests) => {
    const parser = new MarkupParser(initDOM)
    parser.addMarkupRules(...testMarkupRules)
    parser.fromBBCode(bbcode)
    tests.forEach(test => test.push(parser.dom.firstElementChild))

    it.each(tests.map(test => [
      test[0],
      parser.dom.firstElementChild.innerHTML,
      test[1],
      parser.dom.firstElementChild
    ]))('containing \'%s\' at the correct place in the output (%s)', (tagName, _, getSomeNode, domRoot) => {
      expect(() => getSomeNode(domRoot)).not.toThrow()
      expect(getSomeNode(domRoot)).toEqual(tagName)
    })
  })

  describe.each([
    ['[bar][-][baz][/-][/bar]', [
      ['bar', root => root.children[0].tagName],
      ['[-]', root => root.children[0].childNodes[0].textContent],
      ['[/-]', root => root.children[0].childNodes[2].textContent]
    ]],
    ['[bar][/qux][/bar]', [
      ['bar', root => root.children[0].tagName],
      ['[/qux]', root => root.children[0].childNodes[0].textContent]
    ]],
    ['[bar=fail=bad]x[/bar][bar=/fail=bad]y[/bar]', [
      ['bar', root => root.children[0].tagName],
      ['x', root => root.children[0].childNodes[0].textContent],
      ['bar', root => root.children[1].tagName],
      ['y', root => root.children[1].childNodes[0].textContent]
    ]]
  ])('should NOT parse erroneous tag in %s into the DOM,', (bbcode, tests) => {
    const parser = new MarkupParser(initDOM)
    parser.addMarkupRules(...testMarkupRules)
    parser.fromBBCode(bbcode, { parseHackTags: true })
    tests.forEach(test => test.push(parser.dom.firstElementChild))

    it.each(tests.map(test => [
      test[0],
      parser.dom.firstElementChild.innerHTML,
      test[1],
      parser.dom.firstElementChild
    ]))('containing \'%s\' at the correct place in the output (%s)', (tagName, _, getSomeNode, domRoot) => {
      expect(() => getSomeNode(domRoot)).not.toThrow()
      expect(getSomeNode(domRoot)).toEqual(tagName)
    })
  })

  it('should handle closing arguments using the provided function', () => {
    const parser = new MarkupParser(initDOM)
    parser.addMarkupRules(...testMarkupRules)
    parser.fromBBCode('[quux]x[/quux=foobar]')
    expect(handleClosingArg).toHaveBeenCalledWith('foobar', parser.dom.children[0].children[0])
  })
})
