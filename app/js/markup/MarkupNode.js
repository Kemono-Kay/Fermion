const Unparser = require('./bbcode/Unparser')

class MarkupNode {
  constructor (markupNode) {
    this.children = markupNode.children
    this.ruleName = markupNode.rule.toLowerCase()
    this.arg = [markupNode.argo, markupNode.argc]
    this.original = [markupNode.original, markupNode.originalc]
    this.known = markupNode.known
  }

  /* applyProperties () {
    if (this.known) {
      const properties = validRules[this.ruleName].properties
      if (properties.takesArgument) {
        const vanillaArg = properties.validateArgAsVanilla(this.arg[0])
        // if (!validArg) properties.vanillizeArg(this)
      }
    }
  } */

  toBBCode (settings) {
    /* const content = this.children.map(c => c instanceof MarkupNode ? c.toBBCode(settings) : c).join('')
    if (settings.swallowUnknownTags && !validRules.includes(this.ruleName)) {
      return content
    } else if (settings.parseHackTags && !vanillaRules.includes(this.ruleName)) {
      return validRules[this.ruleName]
        ? validRules[this.ruleName].vanillizeTag()
        : new MarkupRule().vanillizeTag()// `[i=${this.ruleName}${this.arg[0] ? `=${this.arg[0]}` : ''}][/i]${content}[i=/${this.ruleName}${this.arg[1] ? `=${this.arg[1]}` : ''}][/i]`
    } else {
      return `[${this.ruleName}${this.arg[0] ? `=${this.arg[0]}` : ''}]${content}[/${this.ruleName}${this.arg[1] ? `=${this.arg[1]}` : ''}]`
    } */
    return Unparser.unparse(this, settings)
  }

  toMD (settings) {
    const content = this.children.map(c => c instanceof MarkupNode ? c.toMD(settings) : c).join('')
  }

  toHTML (settings) {
    const content = this.children.map(c => c instanceof MarkupNode ? c.toHTML(settings) : c).join('')
  }

  static toBBCode (array, settings) {
    return array.map(c => c instanceof MarkupNode ? c.toBBCode(settings) : c).join('')
  }

  static toMD (array, settings) {
    return array.map(c => c instanceof MarkupNode ? c.toMD(settings) : c).join('')
  }

  static toHTML (array, settings) {
    return array.map(c => c instanceof MarkupNode ? c.toHTML(settings) : c).join('')
  }
}

module.exports = MarkupNode
