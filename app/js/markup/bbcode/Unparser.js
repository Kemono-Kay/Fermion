const { vanillaRules, validRules } = require('./../rules/RuleList')

function unparse (node, settings) {
  if (typeof node === 'string') {
    return node
  } else {
    const content = node.children.map(n => unparse(n, settings)).join('')
    if (!node.known) {
      if (settings.swallowUnknownTags) {
        return content
      } else {
        return `${node.original[0]}${content}${node.original[1]}`
      }
    }

    if (!validRules[node.ruleName].properties.takesArgument) {
      node.arg[0] = null
      node.arg[1] = null
    }

    if (settings.parseHackTags && !vanillaRules[node.ruleName]) {
      return validRules[node.ruleName].properties.vanillizeTag(content, node.arg[0])
    } else {
      if (validRules[node.ruleName].properties.validateArgAsVanilla(node.arg[0])) {
        return `[${node.ruleName}${node.arg[0] ? `=${node.arg[0]}` : ''}]${
          content
        }[/${node.ruleName}${node.arg[1] ? `=${node.arg[1]}` : ''}]`
      } else {
        return validRules[node.ruleName].properties.vanillizeTag(content, node.arg[0])
      }
    }
  }
}

module.exports = { unparse }
