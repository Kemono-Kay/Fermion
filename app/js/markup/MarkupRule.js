/**
 * Creates an instance with the information necessary to encode or decode a markup rule in supported markup formats.
 */
class MarkupRule {
  /**
   * Creates a tag with the provided settings to help parse between different forms.
   * @param {String} name - Internal and BBCode tag name.
   * @param {String} mdPattern - Pattern for Fermion 'markdown' syntax.
   * @param {Object} properties
   * @param {?Boolean} properties.takesArgument
   * @param {?Boolean} properties.requiresClosing
   * @param {?String[]} properties.disallowedChildren
   * @param {?String[]} properties.uselessChildren
   * @param {?Boolean} properties.requiresContent
   * @param {?Boolean} properties.vanillaTag
   * @param {?Function} properties.validateArgAsVanilla
   * @param {?Function} properties.vanillizeTag
   * @param {?Function} properties.handleClosingArg
   */
  constructor (name, mdPattern, properties = {}) {
    this.name = name
    this.mdPattern = mdPattern instanceof Array ? mdPattern : [mdPattern]

    /**
     * Default properties. By default, a rule:
     * - Doesn't take arguments,
     * - Allows for content,
     * - Allows other rules to be applied inside of it,
     * - Doesn't render other rules it contains useless,
     * - Requires content,
     * - Shows up on vanilla F-Chat
     * - Allows its arguments to take any form,
     * - Reduces to a hack tag on F-Chat if it's not vanilla
     * - Ignores arguments in the closing tag
     */
    this.properties = {
      takesArgument: false,
      requiresClosing: true,
      disallowedChildren: [],
      uselessChildren: [],
      requiresContent: true,
      vanillaTag: true,
      validateArgAsVanilla: () => true,
      vanillizeTag: (c, a) => `[i=${name}${a ? `=${a}` : ''}][/i]${c}[i=/${name}][/i]`,
      handleClosingArg: (_, n) => n,
      ...properties
    }
  }

  /**
     * returns the BBCode for the tag
     */
  /* toBBCode (arg, content, settings) {
    settings = { ...defaultSettings, ...settings }
    if (settings.parseHackTags && (!this.properties.vanillaTag || (arg && !this.properties.validateArgAsVanilla(arg)))) {
      return this.properties.vanillizeTag(content, arg)
    } else {
      return `[${this.name + (this.properties.takesArgument && arg ? `=${arg}` : '')}]${this.properties.requiresClosing ? content + `[/${this.name}]` : ''}`
    }
  }

  /**
     * Returns the Fermion-flavoured markdown for the tag
     * @param {*} arg
     * @param {*} content
     * @param {*} settings
     *
  toMD (arg, content, settings) {
    settings = { ...defaultSettings, ...settings }
    const pattern = arg ? this.mdPattern.find(str => str.includes('a')) : this.mdPattern.find(str => !str.includes('a'))
    if (!pattern) return content
    const multiline = pattern.includes('  ')
    const splitContent = multiline ? [content] : content.split('\n')
    return splitContent.map(str =>
      pattern.split('c').map(str =>
        !arg || str.split('a').length === 1 ? str : str.split('a').join(arg)).join(content))
  } */
}

module.exports = MarkupRule
