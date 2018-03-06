/** All simple Navigation options. */
const navigation = {
  init () {
    this.navBarSelection()
  },

  /** switch between the three tabs */
  navBarSelection () {
    let elements = document.getElementsByClassName('sidebar-navigator')
    Array.from(elements).forEach((element) => {
      element.addEventListener('mousedown', this.navBarSelectionEvent.bind(this))
    })
  },

  /** Its the event for leftNavBarSelection */
  navBarSelectionEvent (e) {
    let target = e.currentTarget
    Array.from(target.parentNode.children).forEach(item => {
      if (item.classList.contains('sidebar-navigator')) {
        let open = item.getAttribute('open')
        item.classList.remove('selected')
        document.getElementsByClassName(open)[0].classList.remove('selected')
      }
    })
    target.classList.add('selected')
    document.getElementsByClassName(target.getAttribute('open'))[0].classList.add('selected')
  },

  simulateNavBarSelection (open) {
    let elem = document.querySelector(`[open="${open}"]`)
    let e = {currentTarget: elem}
    this.navBarSelectionEvent(e)
  }

}

module.exports = navigation
