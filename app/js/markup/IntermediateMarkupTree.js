const BBCodeParser = require('./bbcode/BBCodeParser')
const IntermediateNode = require('./IntermediateNode')
const { contentNotRequiredRules } = require('./rules/RuleList')

class IntermediateMarkupTree {
  constructor (settings) {
    this.settings = {
      parseHackTags: true,
      swallowUnknownTags: true,
      ...settings
    }
    this.tree = []
  }

  static fromBBCode (str, settings = {}) {
    const imt = new this(settings)
    imt.tree = BBCodeParser.parse(str, settings)
    /* var tree = build(parse(lex(str)))
    if (settings.parseHackTags) tree = parseHackTags(tree)
    imt.tree = parseUnknownTags(tree) */
    // require('./parser/BBCodeParser')(str, settings)
    imt.cleantree(imt.tree)
    return imt
  }

  toBBCode (settings) {
    return IntermediateNode.toBBCode(this.tree, { ...this.settings, ...settings })
  }

  cleantree (tree) {
    for (var i = 0; i < tree.length; i++) {
      if (!(typeof tree[i] === 'string')) {
        this.cleantree(tree[i].children)
        if (tree[i].children.length === 0 && !contentNotRequiredRules.includes(tree[i].ruleName)) { tree.splice(i, 1) }
      }
    }
  }

  serialize () {
    return JSON.stringify(this.tree)
  }

  static deserialize (str, settings = {}) {
    const imt = new this(settings)
    imt.tree = JSON.parse(str)
    return imt
  }
}

module.exports = IntermediateMarkupTree
