function parseTag (str, currentEl) {
  const endCurrentTagRegex = new RegExp('\\[ *?\\/ *?(' + currentEl.tagName + ') *?(?:=(.*?))? *?\\]', 'i')
  const startNextTagRegex = new RegExp('\\[ *?([a-z_][a-z0-9-_]*) *?(?:=(.*?))? *?\\]', 'i')

  const end = endCurrentTagRegex.exec(str)
  const start = startNextTagRegex.exec(str)

  if (end && (!start || start.index > end.index)) {
    currentEl.appendChild(document.createTextNode(str.slice(0, end.index)))
    return str.slice(end.index + end[0].length)
  } else if (start && (!end || end.index > start.index)) {
    const el = document.createElement(start[1])
    if (start[2]) el.setAttribute('arg-open', start[2])
    currentEl.appendChild(document.createTextNode(str.slice(0, start.index)))
    currentEl.appendChild(el)

    const content = parseTag(str.slice(start.index + start[0].length), el)
    return content ? parseTag(content, currentEl) : ''
  } else {

  }
  return ''
}
