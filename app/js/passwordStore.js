/* eslint-env browser */

const { setCredentials, getToken } = (function () {
  var key
  var credentials

  function encrypt (val, key) {
    return val.split('').map(char => char.codePointAt(0) ^ key).join()
  }

  function decrypt (val, key) {
    return val.split().map(num => String.fromCodePoint(Number(num) ^ key)).join('')
  }

  const setCredentials = function (account, password) {
    key = new Date().getTime()
    credentials = [encrypt(account, key), encrypt(password, key)]
  }

  const getToken = function () {
    var c = credentials.map(val => decrypt(val, key))
    const p = new Promise((resolve, reject) => {
      // Do token request
      reject(new Error('Not yet implemented'))
    })
    c = null
    return p
  }

  return { setCredentials, getToken }
})()
