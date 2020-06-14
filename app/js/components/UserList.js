/* esline-env node, browser */

module.exports = UserList

class UserList {
  constructor () {
    this.list = []
  }

  toHTML () {
    const el = document.createElement('ul')
    el.classList.add('Userlist', 'Main')

    this.list.forEach(u => {
      const uel = document.createElement('li')
      uel.classList.add('Userlist', 'Entry')

      const iel = document.createElement('span')
      iel.classList.add('Icon')

      const nel = document.createElement('span')
      nel.classList.add('Userlist', 'Entry', 'Name')

      nel.appendChild(u.characterName)

      uel.appendChild(iel)
      uel.appendChild(nel)
      el.appendChild(uel)
    })

    return el
  }
}
