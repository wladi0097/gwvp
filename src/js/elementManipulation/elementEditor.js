const selectedElement = { // TODO:
  selectedItem: null,

  select (target) {
    this.selectedItem = target
  },

  unselect () {
    this.selectedItem = null
  }
}

module.exports = selectedElement
