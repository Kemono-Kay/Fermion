const MarkupRule = require('./MarkupRule')
const { findClosestVanillaColor, vanillaColors } = require('./Color')
const { validationRegex } = require('./URL')
const standardizeColor = require('./StandardizeColor')

const rules = [
  new MarkupRule('b', '**c**', { uselessChildren: ['b'] }),
  new MarkupRule('i', ['*c*', '_c_'], { uselessChildren: ['i'] }),
  new MarkupRule('u', '__c__', { uselessChildren: ['u'] }),
  new MarkupRule('s', '~~c~~', { uselessChildren: ['s'] }),
  new MarkupRule('url', ['[c](a)', '[](c)'], {
    disallowedChildren: 'all',
    takesArgument: true,
    validateArgAsVanilla: arg => validationRegex.test(arg),
    vanillizeTag: (content, arg) => {
      const nArg = arg || content
      var resultArg
      try {
        const fLoc = nArg.indexOf('#')
        const url = encodeURI(fLoc !== -1 ? nArg.slice(0, fLoc) : nArg).replace(/%5B/g, '[').replace(/%5D/g, ']')
        const frag = fLoc !== -1 ? encodeURIComponent(nArg.slice(fLoc + 1)) : undefined
        resultArg = url
        if (frag !== undefined) resultArg += frag
      } catch (err) {
        console.error(err)
        resultArg = nArg
      }
      return `[url${arg ? `=${resultArg}` : ''}]${arg ? content : resultArg}[/url]`
    },
    handleClosingArg (node) { if (node.arg[1] === 'img') node.ruleName = 'img' }
  }),
  new MarkupRule('sup', '^^c^^', { disallowedChildren: ['sup', 'sub', 'url'] }),
  new MarkupRule('sub', '~c~', { disallowedChildren: ['sup', 'sub', 'url'] }),
  new MarkupRule('color', '||a:c||', {
    takesArgument: true,
    validateArgAsVanilla: arg => vanillaColors.includes(arg),
    vanillizeTag: (content, arg) => {
      if (arg) {
        const col = [standardizeColor(arg)]
          .map(c => [c.slice(1, 3), c.slice(3, 5), c.slice(5, 7)]
            .map(str => Number(`0x${str}`)))[0]
        const closestColor = findClosestVanillaColor(...col)
        return `[color=${closestColor}]${content}[/color=${arg}]`
      } else {
        return content
      }
    },
    handleClosingArg (node) { node.arg[0] = node.arg[1] }
  }),
  new MarkupRule('user', ['<@c>', '[a](@c)', '[](@c)'], { disallowedChildren: 'all' }),
  new MarkupRule('icon', [':@c:', '![a](@c)', '![](@c)'], { disallowedChildren: 'all' }),
  new MarkupRule('eicon', [':!c:'], { disallowedChildren: 'all' }),
  new MarkupRule('noparse', [], { disallowedChildren: 'all' }), // Done with escape sequences in MD
  new MarkupRule('session', ['[a](#c)', '[](#c)'], { takesArgument: true, disallowedChildren: 'all', requiresContent: false }),
  new MarkupRule('li', ['\n+ c\n', '\n* c\n', '\n+[a] c\n', '\n*[a] c\n'], {
    takesArgument: true, // Number/character
    vanillaTag: false
  }),
  new MarkupRule('ol', '<[a]#  c  #>', {
    takesArgument: true, // Sequence of element numbers or keyword
    vanillaTag: false
  }),
  new MarkupRule('ul', '<[a]+  c  +>', {
    takesArgument: true, // List style
    vanillaTag: false
  }),
  new MarkupRule('img', '![c](a)', {
    disallowedChildren: 'all',
    takesArgument: true,
    requiresContent: false,
    vanillaTag: false,
    /// TODO: load the url of the appropriate inline.
    /// TODO: In fact, let's just resolve inlines to urls as soon as we're able.
    vanillizeTag: (content, arg) => Number(arg) ? content : `[url=${arg}]${content | 'Untitled Link'}[/url=img]`
  }),
  new MarkupRule('big', '<<c>>', { vanillaTag: false }),
  new MarkupRule('small', '>>c<<', { vanillaTag: false }),
  new MarkupRule('left', '|<<|  c  |<<|', { vanillaTag: false }),
  new MarkupRule('right', '|>>|  c  |>>|', { vanillaTag: false }),
  new MarkupRule('center', '|><|  c  |><|', { vanillaTag: false }),
  new MarkupRule('justify', '|<a>|  c  |<>|', { vanillaTag: false, takesArgument: true }),
  new MarkupRule('code', ['`c`', '```a\nc```'], { vanillaTag: false, disallowedChildren: 'all', takesArgument: true }),
  /*
    possibly table, too
    */
  // Profile parsing, not implemented
  new MarkupRule('heading', '\n#c', { vanillaTag: false }),
  new MarkupRule('collapse', ['[a]{c}', '[]{c}'], { vanillaTag: false, requiresContent: false, takesArgument: true }),
  new MarkupRule('quote', [' > c', '\n> c', ' >[a] c', '\n>[a] c'], { vanillaTag: false, takesArgument: true }), // > x
  new MarkupRule('indent', [], { vanillaTag: false, takesArgument: true }),
  // TODO: if alignment switches to right, indent on the right side. Justify/center goes both ways.
  new MarkupRule('hr', [], {
    vanillaTag: false,
    takesArgument: true,
    requiresClosing: false,
    vanillizeTag: (arg) => `[i=hr${arg ? `=${arg}` : ''}][/i]`
  }) // ---, ***, - - -, * * *, etc.
]

const validRules = {}
const vanillaRules = {}
const contentRequiredRules = {}
const contentNotRequiredRules = {}
const closingRequiredRules = {}
const argumentRules = {}

rules.forEach(r => {
  validRules[r.tagName] = r
  if (r.properties.vanillaTag) vanillaRules[r.tagName] = r
  if (r.properties.requiresContent) { contentRequiredRules[r.tagName] = r } else { contentNotRequiredRules[r.tagName] = r }
  if (r.properties.requiresClosing) closingRequiredRules[r.tagName] = r
  if (r.properties.takesArgument) argumentRules[r.tagName] = r
})

module.exports = { validRules, vanillaRules, contentRequiredRules, contentNotRequiredRules, closingRequiredRules, argumentRules }
