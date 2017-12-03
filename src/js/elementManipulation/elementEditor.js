const selectedElement = {
  // TODO EVERYTHING
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
