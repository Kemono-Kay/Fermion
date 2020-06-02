const MATCH = {
  ALL: 0,
  CLOSE: 1,
  NAME: 2,
  ARG: 3
}

class MarkupParser {
  constructor (domGetter = () => { throw new Error() }) {
    this.createDocument = domGetter
    this.dom = this.createDocument()
    this.errors = []

    this.markupRules = {}
    this.defaultSettings = {
      allowImages: true,
      parseHackTags: true,
      swallowUnknownTags: true
    }
  }

  /**
   * Add a valid tag to the list of valid tags.
   * @param {...MarkupRule} args
   */
  addMarkupRules (...args) {
    args.forEach(rule => {
      this.markupRules[rule.name] = rule
    })
  }

  /**
   * Sets the DOM using a given BBCode string
   * @param {*} str
   * @param {*} settings
   */
  fromBBCode (str, settings = {}) {
    settings = { ...this.defaultSettings, ...settings }
    this.dom = this.createDocument()
    this.errors = []
    var currentNode = this.dom.firstElementChild
    currentNode.appendChild(this.dom.createTextNode(str))
    const regex = /\[ *?(\/?) *?([a-zA-Z_-]*?) *?(?:(?:=(.*?))?) *?\]/g

    while (true) {
      const str = currentNode.lastChild.textContent
      const match = regex.exec(str)
      if (match === null) break
      const tag = this.markupRules[match[MATCH.NAME]]
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
        const hackElTag = this.markupRules[match[MATCH.ARG].split('=')[0].replace('/', '').trim()]
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

module.exports = MarkupParser
