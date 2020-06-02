/* global describe, it, expect, jest, beforeEach */
/*
const standardizeColorMock = jest.fn(() => '#000000')
const path = require('path')
const jsdom = require('jsdom')
const { JSDOM } = jsdom
const window = new JSDOM('...').window
const BBCode = require(path.join(process.cwd(), 'app', 'js', 'modules', 'BBCode.js'))
const { BBCodeParser, Tag, tags, urlValidationRegex, urlDomainRegex, RGBToHSL, addTag } = BBCode(
  () => window.document.implementation.createDocument(null, 'root'),
  standardizeColorMock
)

beforeEach(() => {
  standardizeColorMock.mockClear()
})

describe('The BBCode module', () => {
  it('should initialise without errors', () => {
    expect(() => BBCode(
      () => window.document.implementation.createDocument(null, 'root'),
      standardizeColorMock
    )).not.toThrow()
  })
})

describe('The class BBCodeParser', () => {
  it('should allow instantiation', () => {
    expect(new BBCodeParser()).toBeTruthy()
  })
  it('should parse valid BBCode back and forth without changes.', () => {

  })
})

describe('The class Tag', () => {
  it('should allow instantiation', () => {
    expect(new Tag()).toBeTruthy()
  })
})

describe('The RGBToHSL function', () => {
  it('should output the correct hsl value', () => {
    expect(RGBToHSL(255, 255, 255)[2]).toStrictEqual(100)
    expect(RGBToHSL(0, 0, 0)[2]).toStrictEqual(0)
    expect(RGBToHSL(255, 0, 0)[0]).toStrictEqual(0)
    expect(RGBToHSL(0, 255, 0)[0]).toStrictEqual(120)
    expect(RGBToHSL(0, 0, 255)[0]).toStrictEqual(240)
    expect(RGBToHSL(128, 128, 128)[1]).toStrictEqual(0)
    expect(RGBToHSL(255, 0, 0)[1]).toStrictEqual(100)
    expect(RGBToHSL(0, 255, 0)[1]).toStrictEqual(100)
    expect(RGBToHSL(0, 0, 255)[1]).toStrictEqual(100)
  })
})

describe('The url validation regex', () => {
  it('should pass valid urls', () => {
    ;['http://foo.com/blah_blah', 'http://foo.com/blah_blah/', 'http://foo.com/blah_blah_(wikipedia)', 'http://foo.com/blah_blah_(wikipedia)_(again)', 'http://www.example.com/wpstyle/?p=364', 'https://www.example.com/foo/?bar=baz&inga=42&quux', 'http://✪df.ws/123', 'http://userid:password@example.com:8080', 'http://userid:password@example.com:8080/', 'http://userid@example.com', 'http://userid@example.com/', 'http://userid@example.com:8080', 'http://userid@example.com:8080/', 'http://userid:password@example.com', 'http://userid:password@example.com/', 'http://142.42.1.1/', 'http://142.42.1.1:8080/', 'http://➡.ws/䨹', 'http://⌘.ws', 'http://⌘.ws/', 'http://foo.com/blah_(wikipedia)#cite-1', 'http://foo.com/blah_(wikipedia)_blah#cite-1', 'http://foo.com/unicode_(✪)_in_parens', 'http://foo.com/(something)?after=parens', 'http://☺.damowmow.com/', 'http://code.google.com/events/#&product=browser', 'http://j.mp', 'ftp://foo.bar/baz', 'http://foo.bar/?q=Test%20URL-encoded%20stuff', 'http://مثال.إختبار', 'http://例子.测试', 'http://उदाहरण.परीक्षा', "http://-.~_!$&'()*+,;=:%40:80%2f::::::@example.com", 'http://1337.net', 'http://a.b-c.de', 'http://223.255.255.254']
      .forEach(url => expect(urlValidationRegex.test(url)).toBeTruthy())
  })

  it('should fail invalid urls', () => {
    ;['http://', 'http://.', 'http://..', 'http://../', 'http://?', 'http://??', 'http://??/', 'http://#', 'http://##', 'http://##/', 'http://foo.bar?q=Spaces should be encoded', '//', '//a', '///a', '///', 'http:///a', 'foo.com', 'rdar://1234', 'h://test', 'http:// shouldfail.com', ':// should fail', 'http://foo.bar/foo(bar)baz quux', 'http://1.1.1.1.1', 'http://123.123.123', 'http://3628126748', 'http://.www.foo.bar/', 'http://www.foo.bar./', 'http://.www.foo.bar./']
      .forEach(url => expect(urlValidationRegex.test(url)).not.toBeTruthy())
  })
})
*/
