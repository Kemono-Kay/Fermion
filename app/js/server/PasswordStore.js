class PasswordStore {
  constructor () {
    var key
    var credentials

    /**
     * TODO: Rework to be more secure
     * @param {*} val
     * @param {*} key
     */
    function encrypt (val, key) {
      return val.split('').map(char => char.codePointAt(0) ^ key).join()
    }

    /**
     * TODO: Rework to be more secure
     * @param {*} val
     * @param {*} key
     */
    function decrypt (val, key) {
      return val.split().map(num => String.fromCodePoint(Number(num) ^ key)).join('')
    }

    /**
     *
     * @param {String} account
     * @param {String} password
     */
    function setCredentials (account, password) {
      key = new Date().getTime()
      credentials = [encrypt(account, key), encrypt(password, key)]
    }

    /**
     *
     * @returns {String}
     */
    function getToken () {
      var c = credentials.map(val => decrypt(val, key))
      const p = new Promise((resolve, reject) => {
        // Do token request
        reject(new Error('Not yet implemented'))
      })
      c = null
      return p
    }

    /**
     *
     * @returns {String}
     */
    function serialize () {
      // TODO
    }

    this.setCredentials = setCredentials
    this.getToken = getToken
    this.serialize = serialize
  }

  /**
   *
   * @param {*} data
   * @returns {PasswordStore}
   */
  static deserialize (data) {

  }
}

module.exports = PasswordStore
