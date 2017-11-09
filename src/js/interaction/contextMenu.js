/* global $ */
/* the contextmenu (rightclick) */
const contextMenu = {
  location: null, // the dom element which can be clicked

  init (location) {
    this.location = location
    this.$domItem = $('.header-contextmenu')
    this.$domItem.hide()
    this.bindContextMenu()
    this.bindCloseContextMenu()
  },

  // open menu
  bindContextMenu () {
    $(this.location).contextmenu((e) => {
      this.$domItem.show()
      let position = this.getBetPosition(e.clientX, e.clientY)
      this.$domItem.attr('style', `top:${position.y}; left:${position.x}`)
      return false
    })
  },

  // close menu
  bindCloseContextMenu () {
    $(this.location).on('click', (e) => {
      if (!$(e.target).closest('.header-contextmenu').length) {
        this.$domItem.hide()
      }
    })
  },

  // get the best possible position for the copntextmenu
  getBetPosition (x, y) {
    y = y - 40
    let position = {x: x, y: y}
    let width = this.$domItem.children('div').width()
    let height = this.$domItem.children('div').height()
    let fullwidth = $(window).width()
    let fullheight = $(window).height()

    if ((x + width + 20) > fullwidth) {
      position.x = x - width
    }

    if ((y + height + 30) > fullheight) {
      position.y = y - height
    }
    return position
  }
}
module.exports = contextMenu
