/* global $ */
const selectedElement = {
  selectedItem: null,

  init () {
    this.cacheDom()
    this.bindEvents()
  },

  cacheDom () {

  },

  bindEvents () {

  },

  applyCss (property, value) {
    if (!this.selectedItem) {
      return
    }
    $(this.selectedItem).css(property, value)
  },

  select (target) {
    this.selectedItem = target
    this.getSettings(target.nodeName)
  },

  unselect () {
    this.selectedItem = null
  },

  getSettings (nodeName) {
    switch (nodeName) {
      case 'H1':
        break
    }
  }
}

module.exports = selectedElement
