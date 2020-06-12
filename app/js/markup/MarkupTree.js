const MarkupNode = require('./MarkupNode')
const { contentNotRequiredRules, validRules } = require('./rules/RuleList')

const parse = {
  bbcode: require('./bbcode/Parser').parse,
  md: () => null,
  html: () => null,
  json: (tree) => JSON.parse(tree)
}

const print = {
  bbcode: (tree, settings) => tree.map(t => require('./bbcode/Unparser').unparse(t, settings)).join(''),
  md: MarkupNode.toMD,
  html: MarkupNode.toHTML,
  json: JSON.stringify
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

  cleantree (tree, stack = []) {
    for (var i = 0; i < tree.length; i++) {
      if (!(typeof tree[i] === 'string')) {
        this.cleantree(tree[i].children, [...stack, tree[i].ruleName])
        if (tree[i].children.length === 0 && !contentNotRequiredRules[tree[i].ruleName]) {
          tree.splice(i, 1)
        } else if (stack
          .map(s => validRules[s] ? validRules[s].properties.uselessChildren : [])
          .flat()
          .includes(tree[i].ruleName)
        ) {
          tree.splice(i, 1, ...tree[i].children)
        } else if (stack
          .map(s => validRules[s] ? validRules[s].properties.disallowedChildren : [])
          .flat()
          .includes(tree[i].ruleName)
        ) {
          tree.splice(i, 1, tree[i].original[0], ...tree[i].children, tree[i].original[1])
        }
      }
    }
  }

  to (kind, settings) {
    return print[kind](this.tree, { ...this.settings, ...settings })
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
