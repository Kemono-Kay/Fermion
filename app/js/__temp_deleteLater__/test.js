/* eslint-env browser */
/* global ChatChannel, User, UI */

window.addEventListener('FermionReady', () => {
  var test = new ChatChannel('TestChannel', true)
  var usr = new User('Test User', 'online')
  UI.showChannel(test)
  test.message(usr, new Date(), 'Hi there!')
  test.message(usr, new Date(), 'A second message!')
}, { once: true })
