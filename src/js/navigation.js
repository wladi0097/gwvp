/** All simple Navigation options. */
const navigation = {
  init () {
    this.leftNavBarSelection()
  },

  /** switch between the three tabs */
  leftNavBarSelection () {
    let elements = document.getElementsByClassName('sidebar-navigator-left')
    Array.from(elements).forEach((element) => {
      element.addEventListener('click', this.leftNavBarSelectionEvent.bind(this))
    })
  },

  /** Its the event for leftNavBarSelection */
  leftNavBarSelectionEvent (e) {
    Array.from(document.getElementsByClassName('sidebar-navigator-left'))
      .forEach((element) => {
        element.classList.remove('selected')
      })
    e.currentTarget.classList.add('selected')

    Array.from(document.getElementsByClassName('sidebar-content'))
      .forEach((element) => {
        element.classList.add('hide')
      })

    let data = 'sidebar-' + e.currentTarget.getAttribute('data-open')
    document.getElementsByClassName(data)[0].classList.remove('hide')
  }

}

module.exports = navigation
