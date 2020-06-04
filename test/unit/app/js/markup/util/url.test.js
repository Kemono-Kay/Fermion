/* global describe, it, expect */

const path = require('path')
const { validationRegex, domainRegex } = require(path.join(process.cwd(), 'app', 'js', 'markup', 'util', 'url.js'))

describe('The url validation regex', () => {
  it.each(
    ['http://foo.com/blah_blah', 'http://foo.com/blah_blah/', 'http://foo.com/blah_blah_(wikipedia)', 'http://foo.com/blah_blah_(wikipedia)_(again)', 'http://www.example.com/wpstyle/?p=364', 'https://www.example.com/foo/?bar=baz&inga=42&quux', 'http://✪df.ws/123', 'http://userid:password@example.com:8080', 'http://userid:password@example.com:8080/', 'http://userid@example.com', 'http://userid@example.com/', 'http://userid@example.com:8080', 'http://userid@example.com:8080/', 'http://userid:password@example.com', 'http://userid:password@example.com/', 'http://142.42.1.1/', 'http://142.42.1.1:8080/', 'http://➡.ws/䨹', 'http://⌘.ws', 'http://⌘.ws/', 'http://foo.com/blah_(wikipedia)#cite-1', 'http://foo.com/blah_(wikipedia)_blah#cite-1', 'http://foo.com/unicode_(✪)_in_parens', 'http://foo.com/(something)?after=parens', 'http://☺.damowmow.com/', 'http://code.google.com/events/#&product=browser', 'http://j.mp', 'ftp://foo.bar/baz', 'http://foo.bar/?q=Test%20URL-encoded%20stuff', 'http://مثال.إختبار', 'http://例子.测试', 'http://उदाहरण.परीक्षा', "http://-.~_!$&'()*+,;=:%40:80%2f::::::@example.com", 'http://1337.net', 'http://a.b-c.de', 'http://223.255.255.254']
  )('should pass the valid url \'%s\'', (url) => {
    expect(validationRegex.test(url)).toEqual(true)
  })

  it.each(
    ['http://', 'http://.', 'http://..', 'http://../', 'http://?', 'http://??', 'http://??/', 'http://#', 'http://##', 'http://##/', 'http://foo.bar?q=Spaces should be encoded', '//', '//a', '///a', '///', 'http:///a', 'foo.com', 'rdar://1234', 'h://test', 'http:// shouldfail.com', ':// should fail', 'http://foo.bar/foo(bar)baz quux', 'http://1.1.1.1.1', 'http://123.123.123', 'http://3628126748', 'http://.www.foo.bar/', 'http://www.foo.bar./', 'http://.www.foo.bar./']
  )('should fail invalid url \'%s\'', (url) => {
    expect(validationRegex.test(url)).toEqual(false)
  })
})

describe('The url domain regex', () => {
  // TODO: expand this list
  it.each([
    ['foo.com', 'http://foo.com/blah_blah'],
    ['example.com', 'http://www.example.com/wpstyle/?p=364'],
    ['foo.bar.baz.com', 'http://foo.bar.baz.com/;qux=quux']
  ])('should get the domain \'%s\' from the url \'%s\'', (domain, url) => {
    expect(domainRegex.exec(url)[1]).toEqual(domain)
  })
})
