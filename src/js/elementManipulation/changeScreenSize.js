/* global $ */
const changeScreenSize = {
  init () {
    this.cacheDom()
    this.bindEvents()
  },

  cacheDom () {
    // dom to resize
    this.$hover = $('.hover-wrapper')
    this.$click = $('.click-wrapper')
    this.$simulated = $('#simulated')
    this.$buttons = $('.header-icons')

    // custom buttons
    this.$tv = $('#screen-Tv')
    this.$computer = $('#screen-Computer')
    this.$tablet = $('#screen-Tablet')
    this.$mobile = $('#screen-Mobile')
  },

  bindEvents () {
    // add events to the cutstom buttons
    this.$tv.on('click', () => { this.changeResolution('Tv') })
    this.$computer.on('click', () => { this.changeResolution('Computer') })
    this.$tablet.on('click', () => { this.changeResolution('Tablet') })
    this.$mobile.on('click', () => { this.changeResolution('Mobile') })
  },

  changeResolution (type) {
    this.$buttons.children('.selected').removeClass('selected') // remove custom style
    let width = 1200
    switch (type) { // type = name of device
      case 'Tv':
        width = 1200
        this.$tv.addClass('selected') // add custom style to button
        break
      case 'Computer':
        width = 979
        this.$computer.addClass('selected') // add custom style to button
        break
      case 'Tablet':
        width = 767
        this.$tablet.addClass('selected') // add custom style to button
        break
      case 'Mobile':
        width = 480
        this.$mobile.addClass('selected') // add custom style to button
        break
    }
    // resize dom elements
    this.$hover.css('width', width).css('min-width', width)
    this.$click.css('width', width).css('min-width', width)
    this.$simulated.css('width', width).css('min-width', width)
  },

  changeZoom (percent) {
    // TODO:
  }
}
module.exports = changeScreenSize
