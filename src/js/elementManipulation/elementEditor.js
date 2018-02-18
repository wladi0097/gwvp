const styleManipulation = require('./styleManipulation')
const elementEditor = {
  selectedItem: null,
  cssClass: null,

  init () {
    this.cacheDom()
    this.bindGlobalEvent()
  },

  cacheDom () {
    this.$allEvents = document.getElementById('elementEditor')
    this.$classes = document.getElementById('elementClasses')
    this.$addClass = document.getElementById('addClass')
    this.inputs = Array.from(this.$allEvents.querySelectorAll('input')).filter(item => item.hasAttribute('editCSS'))
  },

  bindGlobalEvent () {
    this.inputs.forEach((item) => {
      item.addEventListener('change', this.inputChanged.bind(this))
    })
  },

  select (item) {
    this.selectedItem = item
    this.setStyles()
    this.setClasses()
  },

  unselect () {
    this.selectedItem = null
  },

  setStyles () {
    this.inputs.forEach(item => {
      item.value = styleManipulation.getStyle(this.selectedItem, item.getAttribute('editCSS'))
    })
  },

  setClasses () {
    let c = this.selectedItem.getAttribute('class')
    if (c) {
      c.split(' ').forEach((item) => {

      })
    }
  },

  inputChanged (e) {
    let item = e.currentTarget
    this.changeCurrentStyle(item.getAttribute('editCSS'), item.value)
  },

  changeCurrentStyle (style, value) {
    if (!this.cssClass) {
      styleManipulation.setInlineStyle(this.selectedItem, style, value)
    } else {
      styleManipulation.addStyleToClass(this.cssClass, style, value)
    }
  }

}

module.exports = elementEditor
