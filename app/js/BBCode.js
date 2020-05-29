/* eslint-env browser */

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
  constructor (name, takesArgument = false, requiresClosing = true) {
    // BBCode settings
    this.name = name
    this.takesArgument = takesArgument
    this.requiresClosing = requiresClosing
  }
}

/* class Tag {
  constructor () {
    // BBCode settings
    this.fromBBCode = fromBBCode
    this.toBBCode = toBBCode

    // HTML settings
    this.fromHTML = fromHTML
    this.toHTML = toHTML

    // Markdown settings
    this.fromMD = fromMD
    this.toMD = toMD
  }
} */

const validBBCodeTags = [
  new Tag('b'),
  new Tag('i'),
  new Tag('u'),
  new Tag('s'),
  new Tag('url', true),
  new Tag('sup'),
  new Tag('sub'),
  new Tag('color', true),

  // Fermion-specific
  new Tag('*'),
  new Tag('li'),
  new Tag('ol', true), // Starting number/letter
  new Tag('ul', true), // List style character or keyword
  new Tag('img'),
  new Tag('big'),
  new Tag('small'),
  new Tag('left'),
  new Tag('right'),
  new Tag('center'),
  new Tag('hr', false, false), // Not implemented yet
  /*
    possibly table, too
  */

  // F-Chat-only context
  new Tag('user'),
  new Tag('icon'),
  new Tag('eicon'),
  new Tag('noparse'),
  new Tag('session', true)
]

class BBCodeParser {
  constructor () {
    this.dom = createDocument()
    this.settings = {
      allowImages: true,
      parseHackTags: true
    } // For disallowing images, producing BBCode for F-Chat vs. internal etc.
  }

  set bbcode (str) {
    this.dom = createDocument()
    var currentNode = this.dom.firstElementChild
    currentNode.appendChild(this.dom.createTextNode(str))
    const regex = /\[(\/?)([\w-]*?)(?:(?:=(.*?))?)\]/

    while (true) {
      const str = currentNode.lastChild.textContent
      const match = regex.exec(str)
      if (match === null) break
      const tag = validBBCodeTags.find(tag => tag.name === match[MATCH.NAME])
      if (!tag) continue

      // Close current node
      if (
        match[MATCH.CLOSE] &&
        currentNode.tagName.toLowerCase() === match[MATCH.NAME]
      ) {
        currentNode.lastChild.textContent = str.slice(0, match.index)
        currentNode = currentNode.parentElement
        currentNode.appendChild(this.dom.createTextNode(str.slice(match.index + match[MATCH.ALL].length)))

      // Close hacked current node
      } else if (
        this.settings.parseHackTags &&
        !tag.takesArgument &&
        `/${currentNode.tagName.toLowerCase()}` === match[MATCH.ARG]
      ) {
        currentNode.lastChild.textContent = str.slice(0, match.index)
        currentNode = currentNode.parentElement
        currentNode.appendChild(
          this.dom.createTextNode(
            `[${match[MATCH.NAME]}]` + str.slice(match.index + match[MATCH.ALL].length)))

      // Create new node
      } else {
        currentNode.lastChild.textContent = str.slice(0, match.index)
        var el

        // Create hack node
        if (
          this.settings.parseHackTags &&
          !tag.takesArgument &&
          match[MATCH.ARG] &&
          validBBCodeTags.find(tag => tag.name === match[MATCH.ARG].split('=')[0])
        ) {
          const hackTag = validBBCodeTags.find(tag => tag.name === match[MATCH.ARG].split('=')[0])
          el = this.dom.createElement(match[MATCH.ARG])
          const arg = match[MATCH.ARG].split('=')[1]
          if (arg && hackTag.takesArgument) el.setAttribute('arg', arg)
          currentNode.appendChild(el)
          if (tag.requiresClosing) currentNode = el
          currentNode.appendChild(
            this.dom.createTextNode(
              `[${match[MATCH.NAME]}]` + str.slice(match.index + match[MATCH.ALL].length)))

        // Create normal node
        } else {
          el = this.dom.createElement(tag.name)
          if (match[MATCH.ARG] && tag.takesArgument) el.setAttribute('arg', match[MATCH.ARG])
          currentNode.appendChild(el)
          if (tag.requiresClosing) currentNode = el
          currentNode.appendChild(this.dom.createTextNode(str.slice(match.index + match[MATCH.ALL].length)))
        }

        regex.lastIndex = 0
      }
    }
  }

  set html (str) {

  }

  set markdown (str) {

  }

  get bbcode () {

  }

  get html () {

  }

  get markdown () {

  }
}
