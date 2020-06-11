
class MarkupNode {
  constructor (markupNode) {
    this.children = markupNode.children
    this.ruleName = markupNode.rule.toLowerCase()
    this.arg = [markupNode.argo, markupNode.argc]
    this.original = [markupNode.original, markupNode.originalc]
    this.known = markupNode.known
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
