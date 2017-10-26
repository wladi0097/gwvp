/* global $ */
const navigation = {
  init () {
    this.headerItems()
  },

  headerItems () {
    // show
    $('.header-item').on('mouseover', (e) => {
      $('.header-item-options').hide()
      $(e.currentTarget).children('.header-item-options').show()
    })
    // hide
    $(document).on('mouseover', (e) => {
      let target = e.target
      if (!($(target).parents('.header-item').length > 0)) {
        $('.header-item-options').hide()
      }
    })
  }

}

module.exports = navigation
