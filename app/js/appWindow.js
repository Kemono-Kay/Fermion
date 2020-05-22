/* eslint-env browser */

document.getElementById('minimize-button').addEventListener('click', window.bridge.minimize)
document.getElementById('close-button').addEventListener('click', window.bridge.close)
document.getElementById('maximize-button').addEventListener('click', window.bridge.maximize)

const styles = {}
function updateStyles () {
  let styleText = ''
  for (const style in styles) {
    styleText += `${style}:${styles[style]};`
  }
  document.firstElementChild.style.cssText = styleText
}

window.bridge.preferencesEventListeners.push(function () {
  styles['--fermion-scaling'] = window.bridge.preferences.fontsizes[window.bridge.preferences.fontsize]
  updateStyles()
})

window.bridge.windowstatusEventListeners.push(function () {
  document.getElementById('maximize-button').title = window.bridge.windowstatus === 'full' ? 'Restore Down' : 'Maximize'
})
