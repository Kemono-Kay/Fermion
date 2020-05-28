/* eslint-env browser */

document.querySelector('.Button.Minimize').addEventListener('click', window.bridge.minimize)
document.querySelector('.Button.Close').addEventListener('click', window.bridge.close)
document.querySelector('.Button.Maximize').addEventListener('click', window.bridge.maximize)

const styles = {}
function updateStyles () {
  let styleText = ''
  for (const style in styles) {
    styleText += `${style}:${styles[style]};`
  }
  document.firstElementChild.style.cssText = styleText
}

window.addEventListener('FermionPreferencesUpdated', () => {
  styles['--fermion-scaling'] = window.bridge.preferences.fontsizes[window.bridge.preferences.fontsize]
  updateStyles()
})

// Todo: Update upon being maximised or restored by dragging the window.
window.addEventListener('FermionWindowUpdated', () => {
  var el
  if (window.bridge.windowstatus === 'full') {
    el = document.querySelector('.Button.Maximize')
    if (el) {
      el.classList.remove('Maximize')
      el.classList.add('Restore')
      el.title = 'Restore Down'
    }
  } else {
    el = document.querySelector('.Button.Restore')
    if (el) {
      el.classList.remove('Restore')
      el.classList.add('Maximize')
      el.title = 'Maximize'
    }
  }
  if (el) {
    // el.querySelector('.HandledIcon').classList = 'Icon'
    window.bridge.rehandleIcons(el)
  }
})

// Temporary, replace with proper event handler later
window.setInterval(() => {
  const chantype = '#'
  const channame = 'TestChannel'
  const notifs = 12
  document.title = `${chantype}${channame} - Fermion`
  if (notifs > 0) document.title = `(${notifs}) ` + document.title
}, 1000)

/* document.querySelector('.Textentry.Editable.Richtextmode').addEventListener('keydown', (event) => {
  // console.log(event.key)
  const selection = window.getSelection()
  if (event.currentTarget.childNodes.length === 0) {
    const el = document.createElement('div')
    el.classList.add('Markup', 'Line')
  }
  if (event.currentTarget.textContent === '') {
    if (event.key.length === 1) {
      event.currentTarget.firstElementChild.appendChild(document.createTextNode(event.key))
      selection.collapse(event.currentTarget.firstElementChild, 1)
      event.preventDefault()
    }
  }
  if (event.key === 'Enter') {
    if (selection.isCollapsed) {
      const text = [
        document.createTextNode(selection.anchorNode.textContent.substring(0, selection.anchorOffset)),
        document.createElement('br'),
        document.createTextNode(selection.anchorNode.textContent.substring(selection.anchorOffset))
      ]
      selection.anchorNode.after(...text)
      selection.anchorNode.remove()
      /* selection.removeAllRanges()
      const range = document.createRange()
      range.setStart(text,)
      selection.addRange(range) */
/* window.getSelection().collapse(text[2], 0)
    } else {
      console.log(selection)
    }
    event.preventDefault()
  }
}) */

const textentryEl = document.querySelector('.Textentry.Editable.Richtextmode')
const editObserver = new MutationObserver(o => o.forEach(record => {
  switch (record.type) {
    case 'childList':
      record.addedNodes.forEach(node => {
        // If a text node is added in at the top level, put it in a line element
        if (node.nodeType === Node.TEXT_NODE && node.parentNode === textentryEl) {
          const el = document.createElement('span')
          el.classList.add('Markup', 'Line')
          textentryEl.appendChild(el)
          el.appendChild(node)
          window.getSelection().collapse(node, node.textContent.length)
        }

        // If an element node is added that's not part of the markup, remove it.
        if (node.nodeType === Node.ELEMENT_NODE && !node.classList.contains('Markup')) {
          node.childNodes.forEach(el => node.befpre(el))
          node.remove()
        }

        // If a text node contains a newline, split the line.
        if (node.nodeType === Node.TEXT_NODE && node.textContent.includes('\n')) {
          const lines = node.textContent.split('\n').map(text => document.createTextNode(text))
          const parents = []
          var currentNode = node
          while (currentNode.parentNode !== textentryEl) {
            parents.push(currentNode.parentNode)
            currentNode = currentNode.parentNode
          }
          node.remove()

          parents.reduce((childEls, currentEl) => {
            const nodes = [...currentEl.childNodes]
            const elGroups = childEls.map(o => [o])
            elGroups[0].unshift(...nodes.slice(0, nodes.indexOf(childEls[0])))
            elGroups[elGroups.length - 1].push(...nodes.slice(nodes.indexOf(childEls[childEls.length - 1]) + 1))
            const newNodes = elGroups.map(elGroup => {
              const newEl = currentEl.cloneNode(false)
              elGroup.forEach(childEl => newEl.appendChild(childEl))
              return newEl
            })
            newNodes.forEach(node => currentEl.before(node))
            currentEl.remove()
            return newNodes
          }, lines)
        }
      })
      break
    case 'characterData':
      break
  }
}))
editObserver.observe(document.querySelector('.Textentry.Editable.Richtextmode'), {
  childList: true,
  characterData: true,
  characterDataOldValue: true,
  subtree: true
})

/* document.querySelector('.Textentry.Editable.Richtextmode').addEventListener('focusin', (event) => {
  console.log(event.currentTarget.textContent, event.currentTarget.textContent.length)
  if (event.currentTarget.textContent === '') {
    console.log(event.currentTarget.firstElementChild)
    window.getSelection().collapse(event.currentTarget.firstElementChild, 0)
  }
}) */

document.addEventListener('paste', (event) => {
  console.log(event.clipboardData.getData('text/html'))
  console.log(event.clipboardData.getData('text/plain'))
})
