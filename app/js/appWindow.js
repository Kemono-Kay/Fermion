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
    el.querySelector('.HandledIcon').classList = 'UnhandledIcon'
    window.bridge.handleIcons()
  }
  /* if (window.bridge.windowstatus === 'full') {
    document.querySelector('.Button.Maximize').title = 'Restore Down'
    document.querySelector('.Button.Maximize > span').className = 'far fa-window-restore'
  } else {
    document.querySelector('.Button.Maximize').title = 'Maximize'
    document.querySelector('.Button.Maximize > span').className = 'far fa-window-maximize'
  } */
})

// Temporary, replace with proper event handler later
window.setInterval(() => {
  const chantype = '#'
  const channame = 'TestChannel'
  const notifs = 12
  document.title = `${chantype}${channame} - Fermion`
  if (notifs > 0) document.title = `(${notifs}) ` + document.title
}, 1000)
