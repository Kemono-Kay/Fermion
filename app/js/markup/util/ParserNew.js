function treeNode (name, parent = null) {
  const o = {
    children: [],
    parent,
    name,
    add: name => {
      o.children.push(treeNode(name, o))
      return o.children[o.children.length - 1]
    },
    addText: text => typeof o.children[o.children.length - 1] === 'string'
      ? (o.children[o.children.length - 1] += text)
      : o.children.push(text),
    toString: () => o.children.map(n => n.toString()).join('')
  }
  return o
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

function parseBBCodeToTree (str) {
  const tree = treeNode()
  ;(str + '\0').split('').reduce(tokenize, tree)
  return tree
}

function parseTreeToTags (tree) {
  return tree.children.map(node => {
    if (typeof node !== 'string') {
      var tagName = ''
      var close = node.name === 't-tag-close'
      var arg = null
      node.children.forEach(n => {
        if (typeof n === 'string') {
          tagName += n.trim()
        } else if (n.name === 't-arg') {
          arg = n.toString()
        }
      })
      node = { tagName, close, arg }
    }
    return node
  })
}

function buildAST (node, tag) {
  return node
}

function parseTagsToAST (tags) {
  const tree = treeNode()
  tags.reduce(buildAST, tree)
  return tree
  // return tags
}

function parseBBCode (str) {
  return parseTagsToAST(parseTreeToTags(parseBBCodeToTree(str)))
}
