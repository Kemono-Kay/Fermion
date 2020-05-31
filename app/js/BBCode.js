/* eslint-env browser */

const { BBCodeParser } = (function () {
  function createDocument () {
    return document.implementation.createDocument(null, 'root')
  }

  const MATCH = {
    ALL: 0,
    CLOSE: 1,
    NAME: 2,
    ARG: 3
  }

  class Tag {
    constructor (name, settings = {}) {
    // BBCode settings
      this.tagSafeName = name
      this.takesArgument = settings.takesArgument !== undefined ? settings.takesArgument : false
      this.requiresClosing = settings.requiresClosing !== undefined ? settings.requiresClosing : true
      this.disallowedChildren = settings.disallowedChildren !== undefined ? settings.disallowedChildren : []
      this.uselessChildren = settings.uselessChildren !== undefined ? settings.uselessChildren : []
      this.requiresContent = settings.requiresContent !== undefined ? settings.requiresContent : true
      this.requiresArgument = settings.requiresArgument !== undefined ? settings.requiresArgument : false
      if (!this.requiresClosing) this.requiresContent = false
    }

    get name () {
      return this.tagSafeName[0] === '_' ? String.fromCharCode(this.tagSafeName.slice(1)) : this.tagSafeName
    }
  }

  /*

  MD:

  -- en dash
  --- em dash

  */

  // Profile tags:
  /*

  Apparently no further subtags are allowed.

  big allows: ['url','i','u','b','color','s']
  small allows: ['url','i','u','b','color','s']

  sup allows: ["b", "i", "u"]
  sub allows: ["b", "i", "u"]

  */

  const webclientBBCodeTags = [
    new Tag('b', { uselessChildren: ['b'] }), // **x**
    new Tag('i', { uselessChildren: ['i'] }), // _x_, *x*
    new Tag('u', { uselessChildren: ['u'] }), // __x__
    new Tag('s', { uselessChildren: ['s'] }), // ~~x~~
    new Tag('url', { takesArgument: true, disallowedChildren: 'all' }), // [x](y)
    new Tag('sup', { disallowedChildren: ['sup', 'sub', 'url'] }), // ^^x^^
    new Tag('sub', { disallowedChildren: ['sup', 'sub', 'url'] }), // ~x~
    new Tag('color', { takesArgument: true }),

    // F-Chat-only context
    new Tag('user', { disallowedChildren: 'all' }), // <@x>, [](@x)
    new Tag('icon', { disallowedChildren: 'all' }), // :@x:, ![](@x)
    new Tag('eicon', { disallowedChildren: 'all' }), // :x:
    new Tag('noparse', { disallowedChildren: 'all' }), // Done with escape sequences in MD
    new Tag('session', { takesArgument: true, disallowedChildren: 'all', requiresContent: false }) // [x](#y)
  ]

  const validBBCodeTags = [

    ...webclientBBCodeTags,

    // Fermion-specific
    // new Tag('_42'),
    new Tag('li'),
    new Tag('ol', { takesArgument: true }), // Sequence of element numbers or keyword
    new Tag('ul'),
    new Tag('img', { disallowedChildren: 'all', takesArgument: true, requiresContent: false }), // ![x](y)
    new Tag('big'),
    new Tag('small'),
    new Tag('left'),
    new Tag('right'),
    new Tag('center'),
    new Tag('justify'), // Not implemented
    new Tag('code', { disallowedChildren: 'all' }), // Not implemented ```x```, `x`
    /*
    possibly table, too
    */

    // Profile parsing, not implemented
    new Tag('heading'), // Shorthand for bold & big? Not implemented
    new Tag('collapse', { takesArgument: true, requiresContent: false }),
    new Tag('quote'), // > x
    new Tag('indent'), // TODO: if alignment switches to right, indent on the right side. Justify will match the parent.
    new Tag('hr', { requiresClosing: false }) // ---, ***, - - -, * * *, etc.

  ]

  const contentTags = validBBCodeTags
    .filter(tag => tag.requiresContent)
    .map(tag => tag.name)

  const uselessChildren = validBBCodeTags
    .filter(tag => tag.uselessChildren)
    .reduce((acc, cur) => [...acc, ...cur.uselessChildren], [])
    .filter((v, i, a) => a.indexOf(v) === i)

  /**
   * Parser class
   */
  class BBCodeParser {
    constructor () {
      this.errors = []
      this.dom = createDocument()
      this.settings = {
        allowImages: true,
        parseHackTags: true,
        swallowUnknownTags: true
      } // For disallowing images, producing BBCode for F-Chat vs. internal etc.
    }

    getErrors () {
      return this.errors.map(err => {
        var str = `Error: ${err[0]}`
        var el = err[1]
        while (el.parentElement) {
          str += `\n\tin [${el.tagName.toLowerCase()}] tag`
          el = el.parentElement
        }
        return str
      })
    }

    correctDOM (settings = {}) {
      settings = { ...this.settings, ...settings }
      // Filtering out empty tags that are useless when empty
      ;[...this.dom
        .querySelectorAll(contentTags)]
        .filter(el => el.textContent.length === 0)
        .reverse()
        .forEach(el => {
          if ([...el.children].every(el => contentTags.includes(el.tagName.toLowerCase()))) {
            ;[...el.childNodes].forEach(node => el.before(node))
            el.remove()
          }
        })

      // Turn unknown tags without a matching closing or opening tag into text
      this.dom.querySelectorAll('*[unknown-unhandled]').forEach(el => {
        if (!el.getAttribute('unknown-unhandled')) return
        const matchingTagType = !el.getAttribute('tag-close')
        var sibling = el
        while (true) {
          sibling = sibling.nextElementSibling
          if (sibling === null) break
          if (!sibling.getAttribute('unknown-unhandled')) continue
          if (
            Boolean(sibling.getAttribute('tag-close')) === matchingTagType &&
          el.getAttribute('tag-name') === sibling.getAttribute('tag-name')
          ) {
            el.removeAttribute('unknown-unhandled')
            sibling.removeAttribute('unknown-unhandled')
          }
        }
      })
      this.dom.querySelectorAll('*[unknown-unhandled]').forEach(el => {
        el.before(this.dom.createTextNode(el.getAttribute('original-text')))
        el.remove()
      })

      // Remove useless tags
      this.dom
        .querySelectorAll(uselessChildren)
        .forEach(el => {
          var currentNode = el
          while (currentNode.parentElement) {
            currentNode = currentNode.parentElement
            if (validBBCodeTags.find(tag => tag.uselessChildren.includes(currentNode.tagName.toLowerCase()))) {
              ;[...el.childNodes].forEach(node => el.before(node))
              el.remove()
              break
            }
          }
        })
    }

    setBBCode (str, settings = {}) {
      settings = { ...this.settings, ...settings }
      this.dom = createDocument()
      var currentNode = this.dom.firstElementChild
      currentNode.appendChild(this.dom.createTextNode(str))
      const regex = /\[(\/?)([\w-]*?)(?:(?:=(.*?))?)\]/g

      while (true) {
        const str = currentNode.lastChild.textContent
        const match = regex.exec(str)
        if (match === null) break
        const tag = validBBCodeTags.find(tag => tag.name === match[MATCH.NAME])
        if (!tag) {
          this.errors.push([`Unknown tag [${match[MATCH.NAME]}]`, currentNode])
          currentNode.lastChild.textContent = str.slice(0, match.index)
          const el = this.dom.createElement(match[MATCH.NAME])
          el.setAttribute('unknown-unhandled', true)
          el.setAttribute('unknown', true)
          el.setAttribute('tag-name', match[MATCH.NAME])
          el.setAttribute('original-text', match[0])
          if (match[MATCH.ARG]) el.setAttribute('tag-arg', match[MATCH.ARG])
          if (match[MATCH.CLOSE]) el.setAttribute('tag-close', true)
          currentNode.appendChild(el)
          currentNode.appendChild(
            this.dom.createTextNode(
              str.slice(match.index + match[MATCH.ALL].length)))
          regex.lastIndex = 0
          continue
        }
        const currentTag =
        validBBCodeTags.find(tag => tag.name === currentNode.tagName.toLowerCase()) ||
        { disallowedChildren: [] }

        // Close current node
        if (
          match[MATCH.CLOSE] &&
        currentNode.tagName.toLowerCase() === match[MATCH.NAME]
        ) {
          currentNode.lastChild.textContent = str.slice(0, match.index)
          currentNode = currentNode.parentElement
          currentNode.appendChild(this.dom.createTextNode(str.slice(match.index + match[MATCH.ALL].length)))
          regex.lastIndex = 0

        // Close hacked current node
        } else if (
          settings.parseHackTags &&
        !tag.takesArgument &&
        `/${currentNode.tagName.toLowerCase()}` === match[MATCH.ARG]
        ) {
          currentNode.lastChild.textContent = str.slice(0, match.index)
          currentNode = currentNode.parentElement
          currentNode.appendChild(
            this.dom.createTextNode(
            `[${match[MATCH.NAME]}]` + str.slice(match.index + match[MATCH.ALL].length)))
          regex.lastIndex = 0

        // Create new node
        } else if (
          !match[MATCH.CLOSE] &&
        !(currentTag.disallowedChildren === 'all' ||
        currentTag.disallowedChildren.includes(match[MATCH.NAME]))
        ) {
          currentNode.lastChild.textContent = str.slice(0, match.index)

          // Create hack node
          if (
            settings.parseHackTags &&
          !tag.takesArgument &&
          match[MATCH.ARG] &&
          validBBCodeTags.find(tag => tag.name === match[MATCH.ARG].split('=')[0])
          ) {
            const hackTag = validBBCodeTags.find(tag => tag.name === match[MATCH.ARG].split('=')[0])
            const el = this.dom.createElement(match[MATCH.ARG])
            const arg = match[MATCH.ARG].split('=')[1]
            if (arg && hackTag.takesArgument) el.setAttribute('arg', arg)
            currentNode.appendChild(el)
            if (tag.requiresClosing) currentNode = el
            currentNode.appendChild(
              this.dom.createTextNode(
              `[${match[MATCH.NAME]}]` + str.slice(match.index + match[MATCH.ALL].length)))

          // Create normal node
          } else {
            const el = this.dom.createElement(tag.name)
            if (match[MATCH.ARG] && tag.takesArgument) el.setAttribute('arg', match[MATCH.ARG])
            currentNode.appendChild(el)
            if (tag.requiresClosing) currentNode = el
            currentNode.appendChild(this.dom.createTextNode(str.slice(match.index + match[MATCH.ALL].length)))
          }

          regex.lastIndex = 0

        // Closing unopened node
        } else if (
          match[MATCH.CLOSE] &&
        !(currentTag.disallowedChildren === 'all' ||
        currentTag.disallowedChildren.includes(match[MATCH.NAME]))
        ) {
          this.errors.push([`Couldn't find matching opening tag for [/${match[MATCH.NAME]}]`, currentNode])
        }
      }
      var unclosedEl = currentNode
      while (unclosedEl.parentElement) {
        this.errors.push([`Couldn't find matching closing tag for [${unclosedEl.tagName.toLowerCase()}]`, unclosedEl.parentNode])
        unclosedEl = unclosedEl.parentElement
      }
      this.correctDOM(settings)
    }

    setHTML (str) {

    }

    setMD (str) {

    }

    getBBCode () {

    }

    getHTML () {

    }

    getMD () {

    }
  }

  return { BBCodeParser }
})()
