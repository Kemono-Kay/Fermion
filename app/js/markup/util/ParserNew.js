
class TreeNode {
  constructor (name, parent = null) {
    this.children = []
    this.parent = parent
    this.name = name
  }

  add (name) {
    this.children.push(new TreeNode(name, this))
    return this.children[this.children.length - 1]
  }

  addText (text) {
    return typeof this.children[this.children.length - 1] === 'string'
      ? (this.children[this.children.length - 1] += text)
      : this.children.push(text)
  }

  toString () {
    return this.children.map(tn => tn.toString()).join('')
  }
}

function tokenize (node, char) {
  if (char === '[') {
    if (['t-balance', 't-arg'].includes(node.name)) {
      node.addText(char)
      node = node.add('t-balance')
    } else if (node.name === undefined) {
      node = node.add('t-tag')
    } else {
      const sib = node.parent.children
      sib.splice(sib.indexOf(node), 0, char, ...node.children)
      node.children = []
    }
  } else if (char === ']') {
    if (['t-tag', 't-tag-close'].includes(node.name)) {
      node = node.parent
    } else if (node.name === 't-balance') {
      node = node.parent
      node.addText(node.children.pop().toString())
      node.addText(char)
    } else if (node.name === 't-arg') {
      node = node.parent.parent
    } else {
      node.addText(char)
    }
  } else if (char === '/') {
    if (node.name === 't-tag' && (node.children.length === 0 || (typeof node.children[0] === 'string' && node.children[0].trim().length === 0))) {
      node.name = 't-tag-close'
      node.add('t-slash').addText(char)
    } else {
      node.addText(char)
    }
  } else if (char === '=') {
    if (['t-tag', 't-tag-close'].includes(node.name)) {
      node = node.add('t-arg')
    } else {
      node.addText(char)
    }
  } else if (char === '\0') {
    while (node.name !== undefined) {
      const tags = ['t-tag', 't-tag-close', 't-arg']
      const index = tags.indexOf(node.name)
      if (index !== -1) {
        node.parent.children.pop()
        node.parent.addText(['[', '[', '='][index] + node.toString())
      }
      node = node.parent
    }
  } else {
    node.addText(char)
  }
  return node
}

function lex (str) {
  const tree = new TreeNode()
  ;(str + '\0').split('').reduce(tokenize, tree)
  return tree
}

class Tag {
  constructor (tagName, close, arg, originalText) {
    this.tagName = tagName
    this.close = close
    this.arg = arg
    this.originalText = originalText
  }

  toString () { return this.originalText }
}

function parse (tree) {
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

const argRules = ['color', 'hr']
const contentRules = ['color', 'b']
const knownRules = [...contentRules, 'hr']

class MarkupNode {
  constructor (openTag, closeTag) {
    this.l = 0
    this.children = []
    this.rule = openTag.tagName
    this.known = knownRules.includes(openTag.tagName)

    /* if (openTag instanceof MarkupNode) {
      this.close = openTag.close
      this.argo = openTag.argo
      this.argc = closeTag.argo
      this.original = ''
    } else { */
    this.close = closeTag ? null : openTag.close
    this.argo = openTag.arg
    this.argc = closeTag ? closeTag.arg : null
    this.original = openTag.originalText
    // }
  }

  static getHackTag (openNode, closeNode) {
    const hackTag = (openNode.argo || openNode.argc).split('=')
    const node = new MarkupNode({})
    node.rule = hackTag.shift()
    node.argo = hackTag.length ? hackTag.join('') : null
    node.argc = (closeNode.argo || closeNode.argc)
    node.argc = node.argc ? node.argc.split('=').slice(1).join('') : null
    node.known = knownRules.includes(node.rule)
    node.close = null
    node.original = ''
    return node
  }

  setChildren (arr) {
    this.children = arr
    this.l = arr.length + arr.reduce((a, o) => a + (o.l || 1) - 1, 0)
  }

  getLength () { return this.l }
}

function build (tags, currentTag = null) {
  for (var i = 0; i < tags.length; i++) {
    if (tags[i] instanceof Tag) {
      if (tags[i].close) {
        if (currentTag && currentTag.tagName === tags[i].tagName) {
          return tags.slice(0, i + 1)
        } else {
          tags[i] = new MarkupNode(tags[i])
          // tags[i] = `[${tags[i]}]`
        }
      } else if (contentRules.includes(tags[i].tagName)) {
        const arr = build(tags.slice(i + 1), tags[i])
        if (arr) {
          const node = new MarkupNode(tags[i], arr.pop())
          node.setChildren(arr)
          tags.splice(i, node.getLength() + 2, node)
        } else {
          tags[i] = `[${tags[i]}]`
        }
      } else {
        tags[i] = new MarkupNode(tags[i])
      }
    }
  }
  return currentTag ? null : tags
}

function getIndexOfClosingTag (array, tag = null) {
  return array.reduce((a, v, i) => a !== -1 || typeof v === 'string' || v.close !== null || !v.known || (v.argo || v.argc).slice(0, tag.length) !== tag ? a : i, -1)
}

function parseHackTags (tree) {
  for (var i = 0; i < tree.length; i++) {
    if (tree[i] instanceof MarkupNode && !argRules.includes(tree[i].tagName) && (tree[i].argo || tree[i].argc) && /^[a-z0-9]/i.test(tree[i].argo || tree[i].argc)) {
      const j = getIndexOfClosingTag(tree.slice(i + 1), '/' + (tree[i].argo || tree[i].argc).split('=')[0])
      if (j !== -1) {
        const node = MarkupNode.getHackTag(tree[i], tree[i + j + 1])
        node.setChildren(tree.splice(i, j + 1, node))
        const f = node.children.shift()
        node.children = parseHackTags(node.children)
        node.children.unshift(f)
      }
    }
  }
  return tree
}

function parseBBCode (str, hackTags = true) {
  var tree = build(parse(lex(str)))
  if (hackTags) tree = parseHackTags(tree)
  return tree
}
