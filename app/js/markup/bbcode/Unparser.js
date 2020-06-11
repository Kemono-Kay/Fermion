const { vanillaRules, validRules } = require('./../rules/RuleList')

function unparse (node, settings) {
  if (typeof node === 'string') {
    return node
  } else {
    const content = this.children.map(n => unparse(n, settings))
    if (!node.known) {
      if (settings.swallowUnknownTags) {
        return content
      } else {
        return `${node.original[0]}${content}${node.original[1]}`
      }
    } else if (!validRules[this.ruleName].properties.takesArgument) {
      node.arg[0] = null
      node.arg[1] = null
    } else if (settings.parseHackTags && !vanillaRules[this.ruleName]) {
      return validRules[this.ruleName].vanillizeTag(content, node.arg[0])
    } else {
      if (validRules[this.ruleName].properties.validateArgAsVanilla(node.arg[0])) {
        return `[${this.ruleName}${this.arg[0] ? `=${this.arg[0]}` : ''}]${
          content
        }[/${this.ruleName}${this.arg[1] ? `=${this.arg[1]}` : ''}]`
      } else {
        return validRules[this.ruleName].vanillizeTag(content, node.arg[0])
      }
    }
  }
}

module.exports = { unparse }
