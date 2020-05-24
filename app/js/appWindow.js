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

window.addEventListener('FermionWindowUpdated', () => {
  if (window.bridge.windowstatus === 'full') {
    document.querySelector('.Button.Maximize').title = 'Restore Down'
    document.querySelector('.Button.Maximize > span').className = 'far fa-window-restore'
  } else {
    document.querySelector('.Button.Maximize').title = 'Maximize'
    document.querySelector('.Button.Maximize > span').className = 'far fa-window-maximize'
  }
})
