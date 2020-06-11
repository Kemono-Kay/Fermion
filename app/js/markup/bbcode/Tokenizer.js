class TokenNode {
  constructor (name, parent = null) {
    this.children = []
    this.parent = parent
    this.name = name
  }

  add (name) {
    this.children.push(new TokenNode(name, this))
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

function writeToken (node, char) {
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

const Tokenizer = {
  tokenize: str => {
    const tree = new TokenNode()
    ;(str + '\0').split('').reduce(writeToken, tree)
    return tree
  }
}

module.exports = Tokenizer
