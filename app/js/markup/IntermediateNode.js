const { vanillaRules, validRules } = require('./rules/RuleList')

class IntermediateNode {
  constructor (markupNode) {
    this.children = markupNode.children
    this.ruleName = markupNode.rule.toLowerCase()
    this.arg = [markupNode.argo, markupNode.argc]
    this.original = [markupNode.original, markupNode.originalc]
    this.known = markupNode.known
  }

  toBBCode (settings = { swallowUnknownTags: true, parseHackTags: true }) {
    const content = this.children.map(c => c instanceof IntermediateNode ? c.toBBCode(settings) : c).join('')
    if (settings.swallowUnknownTags && !validRules.includes(this.ruleName)) {
      return content
    } else if (settings.parseHackTags && !vanillaRules.includes(this.ruleName)) {
      return `[i=${this.ruleName}${this.arg[0] ? `=${this.arg[0]}` : ''}][/i]${content}[i=/${this.ruleName}${this.arg[1] ? `=${this.arg[1]}` : ''}][/i]`
    } else {
      return `[${this.ruleName}${this.arg[0] ? `=${this.arg[0]}` : ''}]${content}[/${this.ruleName}${this.arg[1] ? `=${this.arg[1]}` : ''}]`
    }
  }

  static toBBCode (array, settings = { swallowUnknownTags: true, parseHackTags: true }) {
    return array.map(c => c instanceof IntermediateNode ? c.toBBCode(settings) : c).join('')
  }
}

module.exports = IntermediateNode
