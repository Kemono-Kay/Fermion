const MarkupNode = require('./MarkupNode')
const { contentNotRequiredRules } = require('./rules/RuleList')

const parse = {
  bbcode: require('./bbcode/Parser').parse,
  md: () => null,
  html: () => null,
  json: (tree) => JSON.stringify(tree)
}

const print = {
  bbcode: MarkupNode.toBBCode,
  md: MarkupNode.toMD,
  html: MarkupNode.toHTML,
  json: JSON.parse
}

class MarkupTree {
  constructor (settings) {
    this.settings = {
      parseHackTags: true,
      swallowUnknownTags: true,
      ...settings
    }
    this.tree = []
  }

  cleantree (tree) {
    for (var i = 0; i < tree.length; i++) {
      if (!(typeof tree[i] === 'string')) {
        this.cleantree(tree[i].children)
        if (tree[i].children.length === 0 && !contentNotRequiredRules.includes(tree[i].ruleName)) { tree.splice(i, 1) }
      }
    }
  }

  to (kind, settings) {
    return print[kind](this.tree, kind, { ...this.settings, ...settings })
  }

  /* toBBCode (settings) {
    return IntermediateNode.toBBCode(this.tree, { ...this.settings, ...settings })
  }

  toMD (settings) {
    return IntermediateNode.toMD(this.tree, { ...this.settings, ...settings })
  }

  toHTML (settings) {
    return IntermediateNode.toHTML(this.tree, { ...this.settings, ...settings })
  } */

  serialize () {
    return JSON.stringify(this.tree)
  }

  static from (str, kind, settings) {
    const imt = new this(settings)
    imt.tree = parse[kind](str, settings)
    imt.cleantree(imt.tree)
    return imt
  }

  /* static fromBBCode (str, settings = {}) {
    const imt = new this(settings)
    imt.tree = BBCodeParser.parse(str, settings)
    imt.cleantree(imt.tree)
    return imt
  } */

  /* static deserialize (str, settings = {}) {
    const imt = new this(settings)
    imt.tree = JSON.parse(str)
    return imt
  } */
}

module.exports = MarkupTree
