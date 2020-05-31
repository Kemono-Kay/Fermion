/* eslint-env browser */

document.querySelectorAll('.styleExample').forEach(el => el.appendChild(document.createTextNode('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat...')))

;(function () {
  const argName = 'value'
  const linkExample = 'https://github.com/Kemono-Kay/Fermion/'
  const Tag = (name, text, desc, arg = false, close = true, fn = () => {}) => ({ name, text: (text instanceof Array ? text : [text]), desc, arg, close, fn })
  const text = ['Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat...']
  const shortText = 'Fermion'

  const supportedTags = [[
    Tag('b', text.join(''), 'makes it bold'),
    Tag('i', text.join(''), 'makes it italic'),
    Tag('u', text.join(''), 'makes it underlined'),
    Tag('s', text.join(''), 'makes it strikethrough'),
    Tag('sup', ['Super', 'script'], 'makes it superscript', false, true, el => {
      el.querySelectorAll('.code.open')[1].remove()
      el.querySelectorAll('.code.close')[1].remove()
    }),
    Tag('sub', ['Sub', 'script'], 'makes it subscript', false, true, el => {
      el.querySelectorAll('.code.open')[1].remove()
      el.querySelectorAll('.code.close')[1].remove()
    }),
    Tag('color', text.join(''), `gives it the color <code>${argName}</code>.<br><a href='colors.html'>Click here for a list of accepted values for <code>${argName}</code></a>`, 'red'),
    Tag('url', shortText, `links to the webpage at <code>${argName}</code>.`, linkExample, true, el => {
      const mEl = el.querySelector('.effect')
      const a = document.createElement('a')
      a.setAttribute('href', linkExample)
      a.setAttribute('target', '_blank')
      mEl.childNodes.forEach(node => a.appendChild(node))
      mEl.appendChild(a)
    }),
    Tag('user', shortText, 'links to a user'),
    Tag('icon', shortText, 'links to a user by displaying an image'),
    Tag('eicon', shortText, 'shows an eicon'),
    Tag('noparse', `${text.join('')}`, 'stops BBCode inside it from being parsed', false, true, el => {
      const bEl = el.querySelector('.bbcode')
      bEl.firstElementChild.textContent += '[b]'
      bEl.lastElementChild.textContent = `[/b]${bEl.lastElementChild.textContent}`
      el.querySelectorAll('.effect > *').forEach(el => (el.textContent = `[b]${el.textContent}[/b]`))
    }),
    Tag('session', 'example-session', 'creates an invite link for a channel', shortText, true, el => {
      el.querySelector('.effect > *').textContent = shortText
    })
  ], [
    Tag('li', text, `makes it display as a list item, prefixed with <code>${argName}</code>.<br>This tag is only allowed inside the <code>ol</code> and <code>ul</code> tags`, ['5.', '10.'], true, el => {
      const bEl = el.querySelector('.bbcode')
      bEl.firstElementChild.textContent = `[ol]${bEl.firstElementChild.textContent}`
      bEl.lastElementChild.textContent += '[/ol]'
    }),
    Tag('ol', text, `(short for Ordered List) creates a numbered list.<br>Individual entries should be wrapped with <code>li</code> tags.<br><code>${argName}</code> allows customisation of the numbering format.<br><a href='ol.html'>Click here for a list of accepted values for <code>${argName}</code></a>`, false, true, el => {
      const bEl = el.querySelector('.bbcode')
      bEl.querySelectorAll('.code').forEach(el => (el.textContent = el.textContent.replace('ol', 'li')))
      bEl.firstElementChild.textContent = `[ol=VII]${bEl.firstElementChild.textContent}`
      bEl.lastElementChild.textContent += '[/ol]'
    }),
    Tag('ul', text, `(short for Unordered List) creates a bulleted list.<br>Individual entries should be wrapped with <code>li</code> tags.<br><code>${argName}</code> allows customisation of the bulleting format.<br><a href='ul.html'>Click here for a list of accepted values for <code>${argName}</code></a>`, false, true, el => {
      const bEl = el.querySelector('.bbcode')
      bEl.querySelectorAll('.code').forEach(el => (el.textContent = el.textContent.replace('ul', 'li')))
      bEl.firstElementChild.textContent = `[ul=square]${bEl.firstElementChild.textContent}`
      bEl.lastElementChild.textContent += '[/ul]'
    }),
    Tag('img', 'shortText', `makes it show up as an image.<br>If <code>${argName}</code> is a number, it shows up as an inline for your character.<br>If <code>${argName}</code> is an url, it displays the image at that url.<br>If <code>${argName}</code> isn't provided, the text between the tags is used instead.<br>The text between the tags is used as alt/title text otherwise`, 'example.png'),
    Tag('big', text.join(''), 'makes it big'),
    Tag('small', text.join(''), 'makes it small'),
    Tag('left', text.join(''), 'aligns it on the left'),
    Tag('right', text.join(''), 'aligns it on the right'),
    Tag('center', text.join(''), 'centers it'),
    Tag('justify', text, `justifies it.<br>If <code>${argName}</code> is set to <code>all</code>, the last line is justified as well, which is normally not the case`, ['all', false]),
    Tag('code', `${text.join('')}`, 'stops BBCode inside it from being parsed, and uses a monospace font', false, true, el => {
      const bEl = el.querySelector('.bbcode')
      bEl.firstElementChild.textContent += '[b]'
      bEl.lastElementChild.textContent = `[/b]${bEl.lastElementChild.textContent}`
      el.querySelectorAll('.effect > *').forEach(el => (el.textContent = `[b]${el.textContent}[/b]`))
    }),

    Tag('heading', text.join(''), 'makes it big and bold'),
    Tag('collapse', text, `hides it beneath a button that collapses/expands it.<br>The button will use <code>${argName}</code> as its content`, ['Section 1', 'Section 2']),
    Tag('quote', text.join(''), `styles it as a quote attributed to <code>${argName}</code> (if present)`, 'Fermion', true, el => {
      const t0 = el.querySelector('.t0')

      const q = document.createElement('div')
      q.appendChild(document.createTextNode('Fermion:'))
      q.classList.add('qh')

      const text = document.createElement('div')
      text.appendChild(document.createTextNode(t0.textContent))
      text.classList.add('qb')

      t0.textContent = ''
      t0.appendChild(q)
      t0.appendChild(text)
    }),
    Tag('indent', text, `indents the text.<br>Different kinds of indents are specified using <code>${argName}</code>.<br><a href='indent.html'>Click here for a list of accepted values for <code>${argName}</code></a>`, ['first', 'hanging']),
    Tag('hr', text, `inserts a horizontal line, styled according to <code>${argName}</code><br><a href='colors.html'>Click here for a list of accepted values for <code>${argName}</code></a>`, ['double', 'inset', 'dashed'], false, el => {
      const els = Array(3).fill(() => document.createElement('hr')).map((fn, i) => {
        const el = fn()
        el.classList.add(`hr${i}`)
        return el
      })
      el.querySelector('.t0').before(els[0])
      el.querySelector('.t1').before(els[1])
      el.querySelector('.t1').after(els[2])
    })
  ]]

  const activate = function (el) {
    return (event) => {
      const btnParent = event.currentTarget.parentElement
      const parent = el.parentElement
      btnParent.querySelectorAll('button').forEach(el => el.setAttribute('data-active', false))
      parent.querySelectorAll('.bbcode, .effect').forEach(el => (el.hidden = true))
      el.hidden = false
      event.currentTarget.setAttribute('data-active', true)
    }
  }

  document.querySelectorAll('.bbcode-list').forEach((list, i) => {
    const tagList = supportedTags[i]
    tagList.forEach(tag => {
      const li = document.createElement('li')
      li.classList.add(tag.name)
      const tagDesc = `[${tag.name + (tag.arg ? `=${argName}` : '')}]${tag.close ? `[/${tag.name}]` : ''}`

      // Heading
      const h = document.createElement('h3')
      h.appendChild(document.createTextNode(`[${tag.name + (tag.arg ? `=${argName}` : '')}]${tag.close ? `text[/${tag.name}]` : ''}`))
      li.appendChild(h)

      // Description
      const desc = document.createElement('div')
      desc.insertAdjacentHTML('afterbegin', `${tag.close ? `Surrounding text with <code>${tagDesc}</code>` : `Using the <code>${tagDesc}</code> tag`} ${tag.desc}.`)
      li.appendChild(desc)

      // Example
      const example = document.createElement('div')
      const versions = document.createElement('div')
      example.classList.add('example')
      const buttons = ['BBCode', 'Effect'].map(label => {
        const button = document.createElement('button')
        button.appendChild(document.createTextNode(label))
        button.classList.add(`btn-${label.toLowerCase()}`)
        example.appendChild(button)
        return button
      })
      const fields = buttons.map(button => {
        const field = document.createElement('div')
        field.classList.add(button.textContent.toLowerCase())
        versions.appendChild(field)

        button.addEventListener('click', activate(field))
        return field
      })
      example.appendChild(versions)

      // Fields
      const args = Array(tag.arg).flat()
      tag.text.forEach((str, i, a) => {
        const textEl = document.createElement('div')
        textEl.appendChild(document.createTextNode(str))
        fields[0].appendChild(textEl)

        const effectEl = document.createElement('div')
        effectEl.classList.add(`t${i}`)
        effectEl.appendChild(document.createTextNode(str))
        fields[1].appendChild(effectEl)

        const tagOpenEl = document.createElement('div')
        tagOpenEl.appendChild(document.createTextNode(`[${tag.name + (args[i] ? `=${args[i]}` : '')}]`))
        tagOpenEl.classList.add('code')
        textEl.before(tagOpenEl)

        if (tag.close) {
          tagOpenEl.classList.add('open')

          const tagCloseEl = document.createElement('div')
          tagCloseEl.appendChild(document.createTextNode(`[/${tag.name}]`))
          tagCloseEl.classList.add('code', 'close')
          textEl.after(tagCloseEl)
        } else if (i + 1 === a.length && args.length > a.length) {
          const tagFinalEl = document.createElement('div')
          tagFinalEl.appendChild(document.createTextNode(`[${tag.name + (args[i + 1] ? `=${args[i + 1]}` : '')}]`))
          tagFinalEl.classList.add('code')
          textEl.after(tagFinalEl)
        }
      })

      buttons[0].setAttribute('data-active', true)
      buttons[1].setAttribute('data-active', false)
      fields[1].hidden = true
      tag.fn(example)
      li.appendChild(example)

      list.appendChild(li)
    })
  })
})()
