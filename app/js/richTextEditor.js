/* eslint-env browser */

/**
 * Fixes any part of the DOM that needs to be rearranged.
 */
{
  const textentryEl = document.querySelector('.Textentry.Editable.Richtextmode')

  /**
   * Unzips the DOM down to the base node, splitting it at a list of positions.
   * @param {Node} baseNode
   * @param {{node: Node, offset: Number}} unzipPositions
   */
  const unzipDOM = function (baseNode, unzipPositions) {
    unzipPositions.forEach(pos => {
      const range = new Range()
      range.setStart(baseNode, 0)
      range.setEnd(pos.node, pos.offset)
      range.insertNode(range.extractContents())
    })
  }

  // Structure newly added text and elements correctly
  const editObserver = new MutationObserver(o => {
    unzipDOM(textentryEl, o.map(record => {
      const unzipPositions = []

      // Make the added elements show up correctly by modifying them (if necessary).
      if (record.type === 'childList') {
        unzipPositions.push(...[...record.addedNodes].map(node => {
          const unzipPositions = []

          // Text nodes should not be at the top level, but in '.Line' elements.
          if (node.nodeType === Node.TEXT_NODE && node.parentNode === textentryEl) {
            const el = document.createElement('span')
            el.classList.add('Markup', 'Line')
            textentryEl.appendChild(el)
            el.appendChild(node)
          }

          // Nodes that do not contain markup can be removed without affecting the view.
          if (node.nodeType === Node.ELEMENT_NODE && !node.classList.contains('Markup')) {
            node.childNodes.forEach(el => node.before(el))
            node.remove()
          }

          // Newlines should be replaced with line break elements for easier parsing.
          if (node.nodeType === Node.TEXT_NODE && node.textContent.includes('\n')) {
            node.textContent.split('\n').forEach((str, i, a) => {
              node.before(document.createTextNode(str))
              if (i !== a.length - 1) {
                const br = document.createElement('br')
                node.before(br)
                unzipPositions.push({ node: br, offset: 0 })
              }
            })
          }

          // Cursor should be moved to the end to be able to continue typing properly
          const range = new Range()
          range.setStartAfter(node)
          window.getSelection().removeAllRanges()
          window.getSelection().addRange(range)

          return unzipPositions
        }))
      }

      // Unzip line breaks into separate '.Line' elements
      unzipPositions.push(...[...textentryEl.querySelectorAll('br')].map(el => ({ node: el, offset: 0 })))
      return unzipPositions
    }).flat(2))

    // Line breaks are no longer needed after unzipping
    textentryEl.querySelectorAll('br').forEach(el => el.remove())
  })
  editObserver.observe(textentryEl, {
    childList: true,
    characterData: true,
    characterDataOldValue: true,
    subtree: true
  })

  // Capture key presses to insert behaviour necessary for proper display.
  textentryEl.addEventListener('keydown', (event) => {
    // If the editor is empty, add a '.Line' element for proper display.
    if (textentryEl.childNodes.length === 0) {
      const el = document.createElement('span')
      el.classList.add('Markup', 'Line')
    }

    // If the editor has no text content, add newly typed character to the first '.Line' element for proper display.
    if (textentryEl.textContent === '' && event.key.length === 1) {
      textentryEl.firstElementChild.appendChild(document.createTextNode(event.key))
      window.getSelection().collapse(textentryEl.firstElementChild, 1)
      event.preventDefault()
    }

    // If a newline is added, unzip the DOM at that location for proper display.
    if (event.key === 'Enter') {
      window.getSelection().getRangeAt(0).deleteContents()
      unzipDOM(textentryEl, [{
        node: window.getSelection().getRangeAt(0).startContainer,
        offset: window.getSelection().getRangeAt(0).startOffset
      }])
      event.preventDefault()
    }
  })
}
