
class MarkupNode {
  constructor (ruleNode) {
    this.children = ruleNode.children
    this.ruleName = ruleNode.rule.toLowerCase()
    this.arg = [ruleNode.argo, ruleNode.argc]
    this.original = [ruleNode.original, ruleNode.originalc]
    this.known = ruleNode.known
  }

  /* toMD (settings) {
    const content = this.children.map(c => c instanceof MarkupNode ? c.toMD(settings) : c).join('')
  }

  toHTML (settings) {
    const content = this.children.map(c => c instanceof MarkupNode ? c.toHTML(settings) : c).join('')
  } */

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
