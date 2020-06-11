const { validRules, closingRequiredRules, argumentRules } = require('../rules/RuleList')
const MarkupNode = require('./../MarkupNode')
const Tokenizer = require('./Tokenizer')

class Tag {
  constructor (tagName, close, arg, originalText) {
    this.tagName = tagName
    this.close = close
    this.arg = arg
    this.originalText = originalText
  }

  toString () { return this.originalText }
}

class TagNode {
  constructor (openTag, closeTag) {
    this.l = 0
    this.children = []
    this.rule = openTag.tagName
    this.known = Object.keys(validRules).includes(openTag.tagName)

    this.close = closeTag ? null : openTag.close
    this.argo = openTag.arg
    this.argc = closeTag ? closeTag.arg : null
    this.original = openTag.originalText
    this.originalc = closeTag ? closeTag.originalText : null
  }

  static getHackTag (openNode, closeNode) {
    const hackTag = (openNode.argo || openNode.argc).split('=')
    const node = new this({})
    node.rule = hackTag.shift()
    node.argo = hackTag.length ? hackTag.join('') : null
    node.argc = (closeNode.argo || closeNode.argc)
    node.argc = node.argc ? node.argc.split('=').slice(1).join('') : null
    node.known = Object.keys(validRules).includes(node.rule)
    node.close = null
    node.original = `[${node.rule}${node.argo ? `=${node.argo}` : ''}]`
    node.originalc = `[/${node.rule}${node.argc ? `=${node.argc}` : ''}]`
    return node
  }

  setChildren (arr) {
    this.children = arr
    this.l = arr.length + arr.reduce((a, o) => a + (o.l || 1) - 1, 0)
  }

  getLength () { return this.l }
}

function parseTokens (str) {
  const tree = Tokenizer.tokenize(str)
  return tree.children.map(node => {
    if (typeof node !== 'string') {
      var tagName = ''
      var close = node.name === 't-tag-close'
      var arg = null
      var original = ''
      node.children.forEach(n => {
        if (typeof n === 'string') {
          tagName += n.trim()
        } else if (n.name === 't-arg') {
          arg = n.toString()
          original += '='
        }
        original += n
      })
      node = new Tag(tagName, close, arg, original)
    }
    return node
  })
}

function parseTags (tags, currentTag = null) {
  for (var i = 0; i < tags.length; i++) {
    if (tags[i] instanceof Tag) {
      if (tags[i].close) {
        if (currentTag && currentTag.tagName === tags[i].tagName) {
          return tags.slice(0, i + 1)
        } else {
          tags[i] = new TagNode(tags[i])
        }
      } else if (Object.keys(closingRequiredRules).includes(tags[i].tagName)) {
        const arr = parseTags(tags.slice(i + 1), tags[i])
        if (arr) {
          const node = new TagNode(tags[i], arr.pop())
          node.setChildren(arr)
          tags.splice(i, node.getLength() + 2, node)
        } else {
          tags[i] = `[${tags[i]}]`
        }
      } else {
        tags[i] = new TagNode(tags[i])
      }
    }
  }
  return currentTag ? null : tags
}

function getIndexOfClosingHackTag (array, tag = null) {
  return array.reduce((a, v, i) => a !== -1 || typeof v === 'string' || v.close !== null || !v.known || (v.argo || v.argc).slice(0, tag.length) !== tag ? a : i, -1)
}

function parseHackTags (tree) {
  for (var i = 0; i < tree.length; i++) {
    if (tree[i] instanceof TagNode && !Object.keys(argumentRules).includes(tree[i].tagName) && (tree[i].argo || tree[i].argc) && /^[a-z0-9]/i.test(tree[i].argo || tree[i].argc)) {
      tree.splice(i + 1, 0, ...parseHackTags(tree.splice(i + 1)))
      const j = getIndexOfClosingHackTag(tree.slice(i + 1), '/' + (tree[i].argo || tree[i].argc).split('=')[0])
      if (j !== -1) {
        const node = TagNode.getHackTag(tree[i], tree[i + j + 1])
        node.setChildren(tree.splice(i, j + 1, node))
        const f = node.children.shift()
        node.children = parseHackTags(node.children)
        node.children.unshift(f)
      }
    }
  }
  return tree
}

function parseUnknownTags (tree) {
  for (var i = 0; i < tree.length; i++) {
    if (tree[i] instanceof TagNode) {
      if (!tree[i].known && tree[i].close === false) {
        tree.splice(i + 1, 0, ...parseUnknownTags(tree.splice(i + 1)))
        const j = tree.slice(i + 1).reduce((a, v, i) => a !== -1 || typeof v === 'string' || v.close !== true || v.rule !== tree[i].rule ? a : i, -1)
        if (j !== -1) {
          tree[i].setChildren(tree.splice(i + 1, j))
          tree[i].argc = tree.splice(i + 1, 1)[0].argo
          tree[i] = new MarkupNode(tree[i])
        } else {
          tree[i] = `[${tree[i].original}]`
        }
      } else {
        tree[i] = new MarkupNode(tree[i])
      }
    }
  }
  return tree
}

const Parser = {
  parse: function (str, settings) {
    var tree = parseTags(parseTokens(str))
    if (settings.parseHackTags) tree = parseHackTags(tree)
    return parseUnknownTags(tree)
  }
}

module.exports = Parser
