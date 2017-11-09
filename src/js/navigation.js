/* global $ */
/* All simple Navigation options. */
const navigation = {
  init () {
    this.leftNavBarSelection()
  },

  // switch between the three tabs
  leftNavBarSelection () {
    $('.sidebar-navigator').on('click', (e) => {
      // change color
      $('.sidebar-navigator').removeClass('selected')
      $(e.currentTarget).addClass('selected')

      // open sidebar
      let open = 'sidebar-' + $(e.currentTarget).data('open')
      $('.sidebar-content').addClass('hide')
      $(`.${open}`).removeClass('hide')
    })
  }

}

module.exports = navigation
