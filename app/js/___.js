/* eslint-env browser */

/* parseFromString(`<html>
<body>
<!--StartFragment--><div class="r" style="font-weight: 400; margin: 0px; font-size: small; line-height: 1.58; color: rgb(34, 34, 34); font-family: arial, sans-serif; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-style: initial; text-decoration-color: initial;"><a href="https://stackoverflow.com/questions/5379120/get-the-highlighted-selected-text" ping="/url?sa=t&amp;source=web&amp;rct=j&amp;url=https://stackoverflow.com/questions/5379120/get-the-highlighted-selected-text&amp;ved=2ahUKEwid9puA_dLpAhUxIcUKHX3KBEkQFjAAegQIAxAB" wotsearchprocessed="true" style="color: rgb(102, 0, 153); cursor: pointer; text-decoration: underline;"><div class="TbwUpd NJjxre" style="display: inline-block; line-height: 1.58; padding-bottom: 1px; padding-top: 1px; text-size-adjust: none; position: absolute; left: 0px; top: 0px;"><cite class="iUh30 bc tjvcx" style="color: rgb(32, 33, 36); font-style: normal; font-size: 14px; padding-top: 1px; line-height: 1.3;"><span class="eipWBe" style="color: rgb(95, 99, 104);">ed-sel...</span></cite></div></a><div wotsearchtarget="stackoverflow.com" style="display: inline-block; background: url(&quot;chrome-extension://idfjghemicebadpkihdooaaekecoiolg/skin/fusion/16_16/plain/r5.png&quot;) right center no-repeat; margin-left: 4px; top: 0.08em; position: relative; z-index: 10; cursor: pointer; width: 16px; height: 16px;"> </div><div class="B6fmyf" style="position: absolute; top: 0px; height: 0px; visibility: hidden; white-space: nowrap;"><div class="TbwUpd" style="display: inline-block; line-height: 1.58; padding-bottom: 1px; padding-top: 1px; text-size-adjust: none;"><cite class="iUh30 bc tjvcx" style="color: rgb(32, 33, 36); font-style: normal; font-size: 14px; padding-top: 1px; line-height: 1.3;"><span class="eipWBe" style="color: rgb(95, 99, 104);"></span></cite></div><div class="eFM0qc" style="display: inline-block; padding-bottom: 1px; padding-left: 2px; visibility: visible;"><span><div class="action-menu" style="display: inline; margin: 1px 3px 0px; position: relative; user-select: none; vertical-align: middle;"><a class="GHDvEf" href="https://www.google.com/search?q=js%20get%20selected%20text&amp;oq=js%20get%20selected%20text&amp;aqs=chrome.2.0j69i57j0l6.2735j0j7&amp;sourceid=chrome&amp;ie=UTF-8#" id="am-b0" aria-label="Result options" aria-expanded="false" aria-haspopup="true" role="button" jsaction="m.tdd;keydown:m.hbke;keypress:m.mskpe" data-ved="2ahUKEwid9puA_dLpAhUxIcUKHX3KBEkQ7B0wAHoECAMQBA" style="display: inline-block; background-color: rgb(255, 255, 255); height: 12px; margin-top: 1px; user-select: none; width: 13px; color: rgb(102, 0, 153); cursor: pointer; text-decoration: none;"><span class="mn-dwn-arw" style="border-color: rgb(112, 117, 122) transparent; border-style: solid; border-width: 5px 4px 0px; width: 0px; height: 0px; margin-left: 3px; top: 7px; margin-top: -3px; position: absolute; left: 0px;"></span></a><ol class="action-menu-panel" role="menu" tabindex="-1" jsaction="keydown:m.hdke;mouseover:m.hdhne;mouseout:m.hdhue" data-ved="2ahUKEwid9puA_dLpAhUxIcUKHX3KBEkQqR8wAHoECAMQBQ" style="margin: 0px; padding: 0px; border: 1px solid rgba(0, 0, 0, 0.2); position: absolute; left: 0px; top: 12px; visibility: hidden; background: rgb(255, 255, 255); font-size: 13px; white-space: nowrap; z-index: 3; transition: opacity 0.218s ease 0s; box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 4px;"><li class="action-menu-item" role="menuitem" style="margin: 0px; padding: 0px; border: 0px; list-style: none; cursor: pointer; user-select: none;"><a class="fl" href="https://webcache.googleusercontent.com/search?q=cache:w1j0b2bG4wYJ:https://stackoverflow.com/questions/5379120/get-the-highlighted-selected-text+&amp;cd=1&amp;hl=en&amp;ct=clnk&amp;gl=nl" ping="/url?sa=t&amp;source=web&amp;rct=j&amp;url=https://webcache.googleusercontent.com/search%3Fq%3Dcache:w1j0b2bG4wYJ:https://stackoverflow.com/questions/5379120/get-the-highlighted-selected-text%2B%26cd%3D1%26hl%3Den%26ct%3Dclnk%26gl%3Dnl&amp;ved=2ahUKEwid9puA_dLpAhUxIcUKHX3KBEkQIDAAegQIAxAG" wotsearchprocessed="true" style="text-decoration: none; color: rgb(51, 51, 51); cursor: pointer; font-size: 14px; display: block; padding: 7px 18px; outline: 0px;"></a></li></ol></div></span></div></div></div><div class="s" style="max-width: 48em; color: rgb(77, 81, 86); line-height: 1.58; font-family: arial, sans-serif; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-style: initial; text-decoration-color: initial;"><div><span class="st" style="line-height: 1.58; overflow-wrap: break-word;"><span class="f" style="color: rgb(112, 117, 122); line-height: 1.58;">Jun 19, 2014 -<span> </span></span><em style="font-weight: bold; font-style: normal; color: rgb(95, 99, 104);">Get</em><span> </span>the<span> </span><em style="font-weight: bold; font-style: normal; color: rgb(95, 99, 104);">Highlighted</em>/<em style="font-weight: bold; font-style: normal; color: rgb(95, 99, 104);">Selected text</em><span> </span>·<span> </span><em style="font-weight: bold; font-style: normal; color: rgb(95, 99, 104);">javascript</em><span> </span>jq</span></div></div><!--EndFragment-->
</body>
</html>`) */

function parseFromString (str) {
  var parser = new DOMParser()
  var newDocument = parser.parseFromString(str, 'text/html')
  var removeEls = []
  newDocument.querySelectorAll('*[class]').forEach(el => el.removeAttribute('class'))

  const replaceEl = function (oldEl, newTagName) {
    const newEl = document.createElement(newTagName)
    if (oldEl.className.trim().length > 0) { newEl.classList.add(...oldEl.className.split(' ')) }
    // if(oldEl.getAttribute('style')) newEl.setAttribute('style',)
    oldEl.after(newEl)
    oldEl.childNodes.forEach(node => newEl.appendChild(node))
    removeEls.push(oldEl)
    return newEl
  }

  const getStyles = function (el) {
    const style = el.getAttribute('style')
    if (!style) return {}
    const styleObj = {}
    style
      .split(';')
      .filter(str => str.length > 0)
      .forEach(style => {
        const pair = style.split(':').map(str => str.trim())
        const key = pair[0]
          .split('-')
          .map(str => (str[0] || '').toUpperCase() + str.slice(1))
          .join('')
        styleObj[key[0].toLowerCase() + key.slice(1)] = pair[1]
      })
    return styleObj
  }

  const parseThisAndChildren = function (el) {
    if (el.nodeType === Node.TEXT_NODE) { return }

    // Remove element if hidden
    if (
      el.nodeType === Node.COMMENT_NODE ||
      el.textContent.replace(/^[\t\v \uFEFF]+|[\t\v \uFEFF]+$/g, '').length === 0 ||
      el.hidden ||
      el.style.visibility === 'collapse' ||
      el.style.visibility === 'hidden' ||
      el.style.display === 'none' ||
      el.style.opacity === '0' ||
      el.style.width === 0 ||
      el.style.height === 0 ||
      el.style.maxWidth === 0 ||
      el.style.maxHeight === 0
    ) {
      removeEls.push(el)
      return
    }

    const styles = getStyles(el)

    // Replace elements with spans
    const relevantClass = {
      h1: 'Big',
      h2: 'Big',
      h3: 'Big',
      h4: 'Big',
      h5: 'Big',
      h6: 'Big',
      big: 'Big',
      small: 'Small',
      sub: 'Subscript',
      sup: 'Superscript',
      b: 'Bold',
      strong: 'Bold',
      i: 'Italic',
      em: 'Italic',
      var: 'Italic',
      u: 'Underline',
      mark: 'Underline',
      code: 'Code',
      samp: 'Code',
      q: 'Quote',
      s: 'Strikethrough'
    }

    switch (el.tagName.toLowerCase()) {
      case 'br':
        break
      case 'span': {
        // el = replaceEl(el, 'span')
        const attributes = [...el.attributes]
        for (const attr of attributes) {
          if (!['class', 'data-col', 'data-href', 'data-src'].includes(attr.name)) {
            el.removeAttribute(attr.name)
          }
        }
      } break
      case 'div':
        el = replaceEl(el, 'span')
        el.classList.add('Markup', 'Line')
        break
      case 'ol':
      case 'ul': {
        // el = replaceEl(el, el.tagName)
        el.classList.add('Markup', 'List')
        const attributes = [...el.attributes]
        for (const attr of attributes) {
          if (!['class', 'data-col', 'data-href', 'data-src'].includes(attr.name)) {
            el.removeAttribute(attr.name)
          }
        }
      } break
      case 'li': {
        // el = replaceEl(el, el.tagName)
        el.classList.add('Markup', 'ListItem')
        const attributes = [...el.attributes]
        for (const attr of attributes) {
          if (!['class', 'data-col', 'data-href', 'data-src'].includes(attr.name)) {
            el.removeAttribute(attr.name)
          }
        }
      } break
      case 'a': {
        const oldEl = el
        el = replaceEl(el, 'span')
        el.classList.add('Markup', 'Link')
        el.setAttribute('data-href', oldEl.href)
      } break
      case 'img': {
        const oldEl = el
        el = replaceEl(el, 'span')
        el.classList.add('Markup', 'Image')
        el.setAttribute('data-src', oldEl.src)
      } break
      default: {
        el = replaceEl(el, 'span')
        if (relevantClass[el.tagName.toLowerCase()] !== undefined) {
          el.classList.add('Markup', relevantClass[el.tagName.toLowerCase()])
        }
      }
    }

    // Set element colour if coloured
    if (styles.color !== undefined) {
      el.setAttribute('data-col', styles.color.split(',').map(str =>
        Number([...str].filter(char =>
          ![...'rgba()'].includes(char)
        ).join(''))
      ).slice(0, 3).join())
      el.classList.add('Markup', 'Color')
    }

    // Set element bold flag
    if (styles.fontWeight !== undefined) {
      if (
        styles.fontWeight === 'bold' ||
        styles.fontWeight === 'bolder' ||
        Number(styles.fontWeight) >= 550
      ) {
        el.classList.add('Markup', 'Bold')
      }
    }

    // Set element italics flag
    if (styles.fontStyle !== undefined) {
      if (
        styles.fontStyle === 'italic' ||
        styles.fontStyle.split(' ')[0] === 'oblique'
      ) {
        el.classList.add('Markup', 'Italic')
      }
    }

    // Set element underline and strikethrough flags
    if (styles.textDecoration !== undefined || styles.textDecorationLine !== undefined) {
      const line = [
        ...(styles.textDecoration || '').split(' '),
        ...(styles.textDecorationLine || '').split(' ')
      ]
      if (!line.includes('none')) {
        if (line.includes('underline')) {
          el.classList.add('Markup', 'Underline')
        }
        if (line.includes('line-through')) {
          el.classList.add('Markup', 'Strikethrough')
        }
      }
    }

    // Set element subscript and superscript flags
    if (styles.verticalAlign !== undefined) {
      if (
        styles.verticalAlign === 'sub' ||
        styles.verticalAlign === 'bottom'
      ) {
        el.classList.add('Markup', 'Subscript')
      }
      if (
        styles.verticalAlign === 'top' ||
        styles.verticalAlign === 'super'
      ) {
        el.classList.add('Markup', 'Superscript')
      }
    }

    // Set element size flags
    if (styles.fontSize !== undefined) {
      if (
        styles.fontSize === 'larger' ||
        styles.fontSize === 'large' ||
        styles.fontSize === 'x-large' ||
        styles.fontSize === 'xx-large' ||
        styles.fontSize === 'xxx-large'
      ) {
        el.classList.add('Markup', 'Big')
      }
      if (
        styles.fontSize === 'smaller' ||
        styles.fontSize === 'small' ||
        styles.fontSize === 'x-small' ||
        styles.fontSize === 'xx-small'
      ) {
        el.classList.add('Markup', 'Small')
      }
    }

    // Set display flags
    if (styles.display !== undefined) {
      const outside = styles.display.split(' ')[0].split('-')[0]
      if (outside === 'block') {
        el.classList.add('Markup', 'Line')
      } else if (outside === 'inline') {
        el.classList.remove('Line')
      }
    }

    // Set textAlign flags
    if (styles.textAlign !== undefined) {
      if (styles.textAlign === 'left') {
        el.classList.add('Markup', 'Line', 'Left')
      }
      if (styles.textAlign === 'center') {
        el.classList.add('Markup', 'Line', 'Center')
      }
      if (styles.textAlign === 'right') {
        el.classList.add('Markup', 'Line', 'Right')
      }
    }

    // Remove unnecessary attributes
    // Nesting the same colour is unnecessary
    if (
      el.classList.contains('Color') &&
        el.parentElement.classList.contains('Color') &&
        el.parentElement.getAttribute('data-col') === el.getAttribute('data-col')
    ) {
      el.removeAttribute('data-col')
      el.classList.remove('Color')
    }

    // Links and images can't be further styled
    if (el.classList.contains('Markup')) {
      if (
        [...newDocument.querySelectorAll('.Link')].some(linkEl => linkEl.contains(el)) ||
          [...newDocument.querySelectorAll('.Image')].some(linkEl => linkEl.contains(el))
      ) {
        el.removeAttribute('class')
      }
    }

    // Subscript and superscript cannot contain images or links because the F-Chat webclient throws a fit if you try.
    if (el.classList.contains('Image') || el.classList.contains('Link')) {
      if (
        [...newDocument.querySelectorAll('.Superscript')].some(linkEl => linkEl.contains(el)) ||
          [...newDocument.querySelectorAll('.Subscript')].some(linkEl => linkEl.contains(el))
      ) {
        el.classList.remove('Image', 'Link')
      }
    }

    // Markup tag is only supposed to be combined, so if it's on its own, it can be removed.
    if (el.className === 'Markup') el.removeAttribute('class')

    // Remove style attribute since we're done with it.
    el.removeAttribute('style')

    // Remove unnecessary elements
    if (!el.classList.contains('Markup')) {
      ;[...el.childNodes].reverse().forEach(node => el.after(node))
      removeEls.push(el)
    }

    // Recurse
    for (const subEl of el.childNodes) {
      parseThisAndChildren(subEl)
    }

    /* if (el.querySelectorAll(':root > :not(.Color)').length === 0) {
      el.removeAttribute('Color')
    } */
    /* if (![...el.childNodes].some(node =>
      (node.nodeType === Node.TEXT_NODE &&
      node.textContent.length > 0) ||
      (node.nodeType === Node.ELEMENT_NODE &&
      !node.classList.contains('Color'))
    )) {
      el.classList.add('RemoveColor')
      // el.classList.remove('Color')
    } */
  }

  // Parse document
  for (const el of newDocument.body.childNodes) {
    parseThisAndChildren(el)
  }

  // Remove useless elements
  removeEls.forEach(el => el.remove())
  removeEls = []

  // Insert linebreaks instead of Line elements.
  // This allows splitting the DOM tree using another bit of code.
  newDocument.querySelectorAll('.Line').forEach(el => {
    const parentIsBlock = el.parentElement.classList.contains('Line')
    if (!parentIsBlock || el.previousSibling !== null) {
      el.before(document.createElement('br'))
    }
    if (!parentIsBlock || el.nextSibling !== null) {
      el.after(document.createElement('br'))
      // el.after(document.createTextNode('\n'))
    }
  })

  // Remove Line elements
  newDocument.querySelectorAll('.Line').forEach(el => {
    el.classList.remove('Line')
    if (el.className === 'Markup') {
      el.removeAttribute('class')
      ;[...el.childNodes].reverse().forEach(node => el.after(node))
      removeEls.push(el)
    }
  })

  // Remove useless elements again
  removeEls.forEach(el => el.remove())
  removeEls = []
  unzipDOM(newDocument.body, [...newDocument.querySelectorAll('br')].map(el => ({
    node: el,
    offset: 0
  })))
  newDocument.querySelectorAll('br').forEach(el => el.remove())
  newDocument.querySelectorAll('body > *').forEach(el => el.classList.add('Line'))

  // Remove useless '.Color' nodes
  newDocument.querySelectorAll('.Color').forEach(el => {
    if (![...el.childNodes].some(node =>
      (node.nodeType === Node.TEXT_NODE &&
      node.textContent.length > 0) ||
      (node.nodeType === Node.ELEMENT_NODE &&
      !node.classList.contains('Color'))
    )) {
      el.classList.add('RemoveColor')
    }
  })
  newDocument.querySelectorAll('.RemoveColor').forEach(el => {
    el.classList.remove('Color', 'RemoveColor')
    el.removeAttribute('data-col')
    if (el.className === 'Markup') {
      ;[...el.childNodes].reverse().forEach(node => el.after(node))
      removeEls.push(el)
    }
  })

  // Remove useless elements
  removeEls.forEach(el => el.remove())

  return newDocument
}

function setCol (root) {
  root.querySelectorAll('.Color').forEach(el => {
    el.style.color = `rgb(${el.getAttribute('data-col')})`
  })
}

/**
 * Unzips the DOM down to the base node, splitting it at a list of positions.
 * @param {Node} baseNode
 * @param {{node: Node, offset: Number}} unzipPositions
 */
function unzipDOM (baseNode, unzipPositions) {
  unzipPositions.forEach(pos => {
    const range = new Range()
    range.setStart(baseNode, 0)
    range.setEnd(pos.node, pos.offset)
    range.insertNode(range.extractContents())
  })
}
