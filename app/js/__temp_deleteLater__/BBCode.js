/* eslint-env browser */
/* eslint-disable no-control-regex */

const { BBCodeParser } = (function () {
  // Doesn't 100% correctly fail malformed query / matrix parameters yet.
  const urlValidationRegex = /^(?:[a-z0-9.+-]*):(?:\/\/)?(?:[^:]+(?::.*)?@)?(?:(?:[^;,/?.:@&=+$\s]+\.)+[^;,/?.:@&=+$\s0-9]+|(?:[0-9]{1,3}\.){3}[0-9]{1,3}|\[((?=.*::)(?!.*::.+::)(::)?([\dA-F]{1,4}:(:|\b)|){5}|([\dA-F]{1,4}:){6})((([\dA-F]{1,4}((?!\3)::|:\b|))|(?!\2\3)){2}|(((2[0-4]|1\d|[1-9])?\d|25[0-5])\.?\b){4})\])(?::[0-9]{1,5})?(?:\/[^;,/?:@&=+$\s]*)*(?:;(?:(?:[^;,/?:@&=+$\s#]*(?:=[^;/?:@&=+$\s#]*)?(?:&|;))*[^;,/?:@&=+$\s#]*(?:=[^;/?:@&=+$\s#]*)?)?)?(?:\?(?:(?:[^;,/?:@&=+$\s#]*(?:=[^;/?:@&=+$\s#]*)?(?:&|;))*[^;,/?:@&=+$\s#]*(?:=[^;/?:@&=+$\s#]*)?)?)?(?:#[^\s]*)?$/ui
  const urlDomainRegex = /^(?:[a-z0-9.+-]*):(?:\/\/)?(?:[^:]+(?::.*)?@)?(?:www\.)?(.*?)(?::[0-9]{1,5})?(?:\/[^;,/?:@&=+$\s]*)*(?:;(?:(?:[^;,/?:@&=+$\s#]*(?:=[^;/?:@&=+$\s#]*)?(?:&|;))*[^;,/?:@&=+$\s#]*(?:=[^;/?:@&=+$\s#]*)?)?)?(?:\?(?:(?:[^;,/?:@&=+$\s#]*(?:=[^;/?:@&=+$\s#]*)?(?:&|;))*[^;,/?:@&=+$\s#]*(?:=[^;/?:@&=+$\s#]*)?)?)?(?:#[^\s]*)?$/ui

  const MATCH = {
    ALL: 0,
    CLOSE: 1,
    NAME: 2,
    ARG: 3
  }

  const createDocument = function () {
    return document.implementation.createDocument(null, 'root')
  }

  const standardizeColor = function (str) {
    /* const hexRegex = /^#([0-9a-f]{3}(?:[0-9a-f]{3})?)/i
    const hexMatch = hexRegex.exec(str)
    if (hexMatch) {
      return hexMatch[1].length === 6 ? hexMatch[0] : `#${hexMatch[1].split('').map(char => char + char).join('')}`
    }

    const fnRegex = /^rgba? *?\(( *?[0-9.] *?(?:,|\)))/i
    const fnMatch = fnRegex.exec(str)
    if (fnMatch) {
      const numbers = fnMatch[1].split(',').slice(0, 3).map(str => Number(str))
      if (numbers.every(n => !isNaN(n) && n >= 0 && n <= 255)) {
        return `#${numbers.map(n => n.toString(16))}`
      }
    }

    return {
      aliceblue: '#f0f8ff',
      antiquewhite: '#faebd7',
      aqua: '#00ffff',
      aquamarine: '#7fffd4',
      azure: '#f0ffff',
      beige: '#f5f5dc',
      bisque: '#ffe4c4',
      black: '#000000',
      blanchedalmond: '#ffebcd',
      blue: '#0000ff',
      blueviolet: '#8a2be2',
      brown: '#a52a2a',
      burlywood: '#deb887',
      cadetblue: '#5f9ea0',
      chartreuse: '#7fff00',
      chocolate: '#d2691e',
      coral: '#ff7f50',
      cornflowerblue: '#6495ed',
      cornsilk: '#fff8dc',
      crimson: '#dc143c',
      cyan: '#00ffff',
      darkblue: '#00008b',
      darkcyan: '#008b8b',
      darkgoldenrod: '#b8860b',
      darkgray: '#a9a9a9',
      darkgreen: '#006400',
      darkkhaki: '#bdb76b',
      darkmagenta: '#8b008b',
      darkolivegreen: '#556b2f',
      darkorange: '#ff8c00',
      darkorchid: '#9932cc',
      darkred: '#8b0000',
      darksalmon: '#e9967a',
      darkseagreen: '#8fbc8f',
      darkslateblue: '#483d8b',
      darkslategray: '#2f4f4f',
      darkturquoise: '#00ced1',
      darkviolet: '#9400d3',
      deeppink: '#ff1493',
      deepskyblue: '#00bfff',
      dimgray: '#696969',
      dodgerblue: '#1e90ff',
      firebrick: '#b22222',
      floralwhite: '#fffaf0',
      forestgreen: '#228b22',
      fuchsia: '#ff00ff',
      gainsboro: '#dcdcdc',
      ghostwhite: '#f8f8ff',
      gold: '#ffd700',
      goldenrod: '#daa520',
      gray: '#808080',
      green: '#008000',
      greenyellow: '#adff2f',
      honeydew: '#f0fff0',
      hotpink: '#ff69b4',
      indianred: '#cd5c5c',
      indigo: '#4b0082',
      ivory: '#fffff0',
      khaki: '#f0e68c',
      lavender: '#e6e6fa',
      lavenderblush: '#fff0f5',
      lawngreen: '#7cfc00',
      lemonchiffon: '#fffacd',
      lightblue: '#add8e6',
      lightcoral: '#f08080',
      lightcyan: '#e0ffff',
      lightgoldenrodyellow: '#fafad2',
      lightgrey: '#d3d3d3',
      lightgreen: '#90ee90',
      lightpink: '#ffb6c1',
      lightsalmon: '#ffa07a',
      lightseagreen: '#20b2aa',
      lightskyblue: '#87cefa',
      lightslategray: '#778899',
      lightsteelblue: '#b0c4de',
      lightyellow: '#ffffe0',
      lime: '#00ff00',
      limegreen: '#32cd32',
      linen: '#faf0e6',
      magenta: '#ff00ff',
      maroon: '#800000',
      mediumaquamarine: '#66cdaa',
      mediumblue: '#0000cd',
      mediumorchid: '#ba55d3',
      mediumpurple: '#9370d8',
      mediumseagreen: '#3cb371',
      mediumslateblue: '#7b68ee',
      mediumspringgreen: '#00fa9a',
      mediumturquoise: '#48d1cc',
      mediumvioletred: '#c71585',
      midnightblue: '#191970',
      mintcream: '#f5fffa',
      mistyrose: '#ffe4e1',
      moccasin: '#ffe4b5',
      navajowhite: '#ffdead',
      navy: '#000080',
      oldlace: '#fdf5e6',
      olive: '#808000',
      olivedrab: '#6b8e23',
      orange: '#ffa500',
      orangered: '#ff4500',
      orchid: '#da70d6',
      palegoldenrod: '#eee8aa',
      palegreen: '#98fb98',
      paleturquoise: '#afeeee',
      palevioletred: '#d87093',
      papayawhip: '#ffefd5',
      peachpuff: '#ffdab9',
      peru: '#cd853f',
      pink: '#ffc0cb',
      plum: '#dda0dd',
      powderblue: '#b0e0e6',
      purple: '#800080',
      rebeccapurple: '#663399',
      red: '#ff0000',
      rosybrown: '#bc8f8f',
      royalblue: '#4169e1',
      saddlebrown: '#8b4513',
      salmon: '#fa8072',
      sandybrown: '#f4a460',
      seagreen: '#2e8b57',
      seashell: '#fff5ee',
      sienna: '#a0522d',
      silver: '#c0c0c0',
      skyblue: '#87ceeb',
      slateblue: '#6a5acd',
      slategray: '#708090',
      snow: '#fffafa',
      springgreen: '#00ff7f',
      steelblue: '#4682b4',
      tan: '#d2b48c',
      teal: '#008080',
      thistle: '#d8bfd8',
      tomato: '#ff6347',
      turquoise: '#40e0d0',
      violet: '#ee82ee',
      wheat: '#f5deb3',
      white: '#ffffff',
      whitesmoke: '#f5f5f5',
      yellow: '#ffff00',
      yellowgreen: '#9acd32'
    }[str] || '#000000' */
    var ctx = document.createElement('canvas').getContext('2d')
    ctx.fillStyle = str
    return ctx.fillStyle
  }

  const RGBToHSL = function (r, g, b) {
    r /= 255
    g /= 255
    b /= 255
    const cmin = Math.min(r, g, b)
    const cmax = Math.max(r, g, b)
    const delta = cmax - cmin
    let h = 0
    let s = 0
    let l = 0
    if (delta === 0) {
      h = 0
    } else if (cmax === r) {
      h = ((g - b) / delta) % 6
    } else if (cmax === g) {
      h = (b - r) / delta + 2
    } else {
      h = (r - g) / delta + 4
    }
    h = Math.round(h * 60)
    if (h < 0) h += 360
    l = (cmax + cmin) / 2
    s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1))
    s = +(s * 100).toFixed(1)
    l = +(l * 100).toFixed(1)
    return [h, s, l]
  }

  const validVanillaColors = ['red', 'blue', 'white', 'yellow', 'pink', 'gray', 'green', 'orange', 'purple', 'black', 'brown', 'cyan']
  const validVanillaColorValues = validVanillaColors
    .map(c => standardizeColor(c))
    .map(c => [c.slice(1, 3), c.slice(3, 5), c.slice(5, 7)]
      .map(str => Number(`0x${str}`)))
    .map(arr => RGBToHSL(arr[0], arr[1], arr[2]))

  /**
   * Default settings for parsing tags.
   */
  const defaultSettings = {
    allowImages: true,
    parseHackTags: true,
    swallowUnknownTags: true
  }

  /**
   * Default settings for a new tag type.
   */
  const defaultTagSettings = {
    takesArgument: false,
    requiresClosing: true,
    disallowedChildren: [],
    uselessChildren: [],
    requiresContent: true,

    vanillaTag: true,
    validateArgAsVanilla: () => true,
    vanillizeTag: () => '[][/]',
    handleClosingArg: () => {}
  }

  /**
   * List of valid tags.
   */
  const tags = {}
  const vanillaTags = {}

  /**
   * Add a valid tag to the list of valid tags.
   * @param {...Tag} args
   */
  const addTag = function (...args) {
    args.forEach(tag => {
      tags[tag.name] = tag
      if (tag.properties.vanillaTag) vanillaTags[tag.name] = tag
    })
  }

  const Tag = class {
    /**
     * Creates a tag with the provided settings to help parse between different forms.
     * @param {String} name - Internal and BBCode tag name.
     * @param {String} mdPattern - Pattern for Fermion 'markdown' syntax.
     * @param {Object} settings
     * @param {?Boolean} settings.takesArgument
     * @param {?Boolean} settings.requiresClosing
     * @param {?String[]} settings.disallowedChildren
     * @param {?String[]} settings.uselessChildren
     * @param {?Boolean} settings.requiresContent
     * @param {?Boolean} settings.vanillaTag
     * @param {?Function} settings.validateArgAsVanilla
     * @param {?Function} settings.vanillizeTag
     * @param {?Function} settings.handleClosingArg
     */
    constructor (name, mdPattern, settings = {}) {
      this.name = name
      this.mdPattern = mdPattern instanceof Array ? mdPattern : [mdPattern]
      this.properties = { ...defaultTagSettings, ...settings }
    }

    /**
     * returns the BBCode for the tag
     */
    toBBCode (arg, content, settings) {
      settings = { ...defaultSettings, ...settings }
      if (settings.parseHackTags && (!this.properties.vanillaTag || (arg && !this.properties.validateArgAsVanilla(arg)))) {
        return this.properties.vanillizeTag(content, arg)
      } else {
        return `[${this.name + (this.properties.takesArgument && arg ? `=${arg}` : '')}]${this.properties.requiresClosing ? content + `[/${this.name}]` : ''}`
      }
    }

    /**
     * Returns the Fermion-flavoured markdown for the tag
     * @param {*} arg
     * @param {*} content
     * @param {*} settings
     */
    toMD (arg, content, settings) {
      settings = { ...defaultSettings, ...settings }
      const pattern = arg ? this.mdPattern.find(str => str.includes('a')) : this.mdPattern.find(str => !str.includes('a'))
      if (!pattern) return content
      const multiline = pattern.includes('  ')
      const splitContent = multiline ? [content] : content.split('\n')
      return splitContent.map(str =>
        pattern.split('c').map(str =>
          !arg || str.split('a').length === 1 ? str : str.split('a').join(arg)).join(content))
    }
  }

  addTag(
    new Tag('b', '**c**', { uselessChildren: ['b'] }),
    new Tag('i', ['*c*', '_c_'], { uselessChildren: ['i'] }),
    new Tag('u', '__c__', { uselessChildren: ['u'] }),
    new Tag('s', '~~c~~', { uselessChildren: ['s'] }),
    new Tag('url', ['[c](a)', '[](c)'], {
      disallowedChildren: 'all',
      takesArgument: true,
      validateArgAsVanilla: arg => urlValidationRegex.test(arg),
      vanillizeTag: (content, arg) => {
        const nArg = arg || content
        var resultArg
        try {
          const fLoc = nArg.indexOf('#')
          const url = encodeURI(fLoc !== -1 ? nArg.slice(0, fLoc) : nArg).replace(/%5B/g, '[').replace(/%5D/g, ']')
          const frag = fLoc !== -1 ? encodeURIComponent(nArg.slice(fLoc + 1)) : undefined
          resultArg = url
          if (frag !== undefined) resultArg += frag
        } catch (err) {
          console.error(err)
          resultArg = nArg
        }
        return `[url${arg ? `=${resultArg}` : ''}]${arg ? content : resultArg}[/url]`
      },
      handleClosingArg (arg, node) {
        if (arg === 'img') {
          const el = node.ownerDocument.createElement('img')
          el.setAttribute('arg', node.getAttribute('arg'))
          node.childNodes.forEach(node => el.appendChild(node))
          node.after(el)
          node.remove()
          return el
        }
        return node
      }
    }),
    new Tag('sup', '^^c^^', { disallowedChildren: ['sup', 'sub', 'url'] }),
    new Tag('sub', '~c~', { disallowedChildren: ['sup', 'sub', 'url'] }),

    new Tag('color', '||a:c||', {
      takesArgument: true,
      validateArgAsVanilla: arg => validVanillaColors.includes(arg),
      vanillizeTag: (content, arg) => {
        if (arg) {
          const col = [standardizeColor(arg)]
            .map(c => [c.slice(1, 3), c.slice(3, 5), c.slice(5, 7)]
              .map(str => Number(`0x${str}`)))[0]
          const hsl = RGBToHSL(...col)
          const closestColor = validVanillaColors[validVanillaColorValues
            .map(arr => [Math.abs(arr[0] - hsl[0]) * 0.9, Math.abs(arr[1] - hsl[1]) * 2.56, Math.abs(arr[2] - hsl[2]) * 2.56]
              .reduce((acc, cur) => acc + cur))
            .reduce((acc, cur, i, a) => cur < a[acc] ? i : acc, 0)]
          return `[color=${closestColor}]${content}[/color=${arg}]`
        } else {
          return content
        }
      },
      handleClosingArg (arg, node) {
        node.setAttribute('arg', arg)
        return node
      }
    }),

    new Tag('user', ['<@c>', '[a](@c)', '[](@c)'], { disallowedChildren: 'all' }),
    new Tag('icon', [':@c:', '![a](@c)', '![](@c)'], { disallowedChildren: 'all' }),
    new Tag('eicon', [':!c:'], { disallowedChildren: 'all' }),
    new Tag('noparse', [], { disallowedChildren: 'all' }), // Done with escape sequences in MD
    new Tag('session', ['[a](#c)', '[](#c)'], { takesArgument: true, disallowedChildren: 'all', requiresContent: false }),

    new Tag('li', ['\n+ c\n', '\n* c\n', '\n+[a] c\n', '\n*[a] c\n'], {
      takesArgument: true, // Number/character
      vanillaTag: false,
      vanillizeTag: (content, arg) => `[i=li${arg ? `=${arg}` : ''}][/i]${content}[i=/li][/i]`
    }),
    new Tag('ol', '<[a]#  c  #>', {
      takesArgument: true, // Sequence of element numbers or keyword
      vanillaTag: false,
      vanillizeTag: (content, arg) => `[i=ol${arg ? `=${arg}` : ''}][/i]${content}[i=/ol][/i]`
    }),
    new Tag('ul', '<[a]+  c  +>', {
      takesArgument: true, // List style
      vanillaTag: false,
      vanillizeTag: (content, arg) => `[i=ul${arg ? `=${arg}` : ''}][/i]${content}[i=/ul][/i]`
    }),
    new Tag('img', '![c](a)', {
      disallowedChildren: 'all',
      takesArgument: true,
      requiresContent: false,
      vanillaTag: false,
      /// TODO: load the url of the appropriate inline.
      /// TODO: In fact, let's just resolve inlines to urls as soon as we're able.
      vanillizeTag: (content, arg) => Number(arg) ? content : `[url=${arg}]${content | 'Untitled Link'}[/url=img]`
    }),
    new Tag('big', '<<c>>', { vanillaTag: false, vanillizeTag: (content) => `[i=big][/i]${content}[i=/big][/i]` }),
    new Tag('small', '>>c<<', { vanillaTag: false, vanillizeTag: (content) => `[i=small][/i]${content}[i=/small][/i]` }),
    new Tag('left', '|<<|  c  |<<|', { vanillaTag: false, vanillizeTag: (content) => `[i=left][/i]${content}[i=/left][/i]` }),
    new Tag('right', '|>>|  c  |>>|', { vanillaTag: false, vanillizeTag: (content) => `[i=right][/i]${content}[i=/right][/i]` }),
    new Tag('center', '|><|  c  |><|', { vanillaTag: false, vanillizeTag: (content) => `[i=center][/i]${content}[i=/center][/i]` }),
    new Tag('justify', '|<a>|  c  |<>|', {
      vanillaTag: false,
      takesArgument: true,
      vanillizeTag: (content, arg) => `[i=justify${arg ? `=${arg}` : ''}][/i]${content}[i=/justify][/i]`
    }),

    new Tag('code', ['`c`', '```a\nc```'], { vanillaTag: false, disallowedChildren: 'all', takesArgument: true, vanillizeTag: (content, arg) => `[i=code${arg ? `=${arg}` : ''}][/i]${content}[i=/code][/i]` }),
    /*
    possibly table, too
    */

    // Profile parsing, not implemented
    new Tag('heading', '\n#c', { vanillaTag: false, vanillizeTag: (content) => `[i=heading][/i]${content}[i=/heading][/i]` }),
    new Tag('collapse', ['[a]{c}', '[]{c}'], {
      vanillaTag: false,
      requiresContent: false,
      takesArgument: true,
      vanillizeTag: (content, arg) => `[i=collapse${arg ? `=${arg}` : ''}][/i]${content}[i=/collapse][/i]`
    }),
    new Tag('quote', [' > c', '\n> c', ' >[a] c', '\n>[a] c'], {
      vanillaTag: false,
      takesArgument: true,
      vanillizeTag: (content, arg) => `[i=quote${arg ? `=${arg}` : ''}][/i]${content}[i=/quote][/i]`
    }), // > x
    new Tag('indent', [], {
      vanillaTag: false,
      takesArgument: true,
      vanillizeTag: (content, arg) => `[i=indent${arg ? `=${arg}` : ''}][/i]${content}[i=/indent][/i]`
    }), // TODO: if alignment switches to right, indent on the right side. Justify/center goes both ways.
    new Tag('hr', [], {
      vanillaTag: false,
      takesArgument: true,
      requiresClosing: false,
      vanillizeTag: (arg) => `[i=hr${arg ? `=${arg}` : ''}][/i]`
    }) // ---, ***, - - -, * * *, etc.

  )

  const BBCodeParser = class {
    constructor () {
      this.dom = createDocument()
      this.errors = []
    }

    /**
     * Sets the DOM using a given BBCode string
     * @param {*} str
     * @param {*} settings
     */
    setBBCode (str, settings = {}) {
      settings = { ...defaultSettings, ...settings }
      this.dom = createDocument()
      this.errors = []
      var currentNode = this.dom.firstElementChild
      currentNode.appendChild(this.dom.createTextNode(str))
      const regex = /\[ *?(\/?) *?([a-zA-Z_-]*?) *?(?:(?:=(.*?))?) *?\]/g

      while (true) {
        const str = currentNode.lastChild.textContent
        const match = regex.exec(str)
        if (match === null) break
        const tag = tags[match[MATCH.NAME]]
        const begin = str.slice(0, match.index)
        const end = str.slice(match.index + match[MATCH.ALL].length)

        // Unknown tag
        if (!tag) {
          this.errors.push([`Unknown tag [${match[MATCH.NAME]}]`, currentNode])
          currentNode.lastChild.textContent = begin
          try {
            const el = this.dom.createElement(match[MATCH.NAME])
            el.setAttribute('unknown-unhandled', true)
            el.setAttribute('unknown', true)
            el.setAttribute('tag-name', match[MATCH.NAME])
            el.setAttribute('original-text', match[0])
            if (match[MATCH.ARG]) el.setAttribute('tag-arg', match[MATCH.ARG])
            el.setAttribute('tag-close', Boolean(match[MATCH.CLOSE]))
            currentNode.appendChild(el)
          } catch (err) {
            this.errors.push([`Invalid tag tag [${match[MATCH.NAME]}]`, currentNode])
            currentNode.appendChild(this.dom.createTextNode(match[MATCH.NAME]))
          }
          currentNode.appendChild(this.dom.createTextNode(str.slice(end)))
          regex.lastIndex = 0
          continue
        }

        if (match[MATCH.CLOSE] && currentNode.tagName.toLowerCase() !== tag.name) continue
        if (settings.parseHackTags && match[MATCH.CLOSE] && match[MATCH.ARG]) {
          currentNode = tag.properties.handleClosingArg(match[MATCH.ARG], currentNode)
        }

        // Close vanilla/custom tags (not hack tags)
        if (match[MATCH.CLOSE]) {
          currentNode.lastChild.textContent = begin
          currentNode.parentNode.appendChild(this.dom.createTextNode(end))
          currentNode = currentNode.parentNode
          regex.lastIndex = 0
          continue
        }

        // Cut off text to insert new elements
        currentNode.lastChild.textContent = begin

        // Find hack tag
        if (settings.parseHackTags && !tag.properties.takesArgument && match[MATCH.ARG]) {
          const hackElTag = tags[match[MATCH.ARG].split('=')[0].replace('/', '').trim()]
          if (hackElTag) {
            const hackEl = this.dom.createElement(hackElTag.name)
            if (hackElTag.properties.takesArgument && match[MATCH.ARG].split('=')[1]) {
              hackEl.setAttribute('arg', match[MATCH.ARG].split('=')[1].trim())
            }
            if (hackElTag.properties.requiresClosing) {
              hackEl.setAttribute('hacktag-unhandled', true)
              hackEl.setAttribute('tag-close', match[MATCH.ARG].split('=')[0].trim()[0] === '/')
            }
            currentNode.appendChild(hackEl)
          }
        }

        // Add normal tag
        const normalEl = this.dom.createElement(tag.name)
        if (tag.properties.takesArgument && match[MATCH.ARG]) normalEl.setAttribute('arg', match[MATCH.ARG])
        currentNode.appendChild(normalEl)
        currentNode = normalEl
        currentNode.appendChild(this.dom.createTextNode(end))
        regex.lastIndex = 0
      }

      // Fix pairs
      const pairSoloEls = (name) => {
        this.dom.querySelectorAll(`[${name}-unhandled][tag-close=false]`).forEach(el => {
          var sibling = el.nextElementSibling
          while (sibling) {
            if (sibling.getAttribute('tag-close') === 'true' && sibling.tagName === el.tagName) {
              while (el.nextSibling !== sibling) {
                el.appendChild(el.nextSibling)
              }
              sibling.remove()
              el.removeAttribute(`${name}-unhandled`)
              el.removeAttribute('tag-close')
              break
            }
            sibling = sibling.nextElementSibling
          }
        })
      }
      pairSoloEls('unknown')
      pairSoloEls('hacktag')
      this.dom.querySelectorAll('[hacktag-unhandled]').forEach(el => el.remove())
      this.dom.querySelectorAll('[unknown-unhandled]').forEach(el => {
        el.after(this.dom.createTextNode(el.getAttribute('original-text')))
        el.remove()
      })
    }
  }
  return { BBCodeParser }
})()

if (typeof window === 'undefined') {
  module.exports = BBCodeParser
}
