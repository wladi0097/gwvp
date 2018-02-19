const styleManipulation = require('./styleManipulation')
const elementEditor = {
  selectedItem: null,
  cssClass: null,

  /** Initialize elementEditor. */
  init () {
    this.cacheDom()
    this.bindGlobalEvent()
  },

  /** Cache dom elements. */
  cacheDom () {
    this.$allEvents = document.getElementById('elementEditor')
    this.$classes = document.getElementById('elementClasses')
    this.$addClass = document.getElementById('addClass')
    this.inputs = Array.from(this.$allEvents.querySelectorAll('input')).filter(item => item.hasAttribute('editCSS'))
    this.radios = Array.from(this.$allEvents.querySelectorAll('.radio')).filter(item => item.hasAttribute('editCSS'))
  },

  /* Bind events which should be always present */
  bindGlobalEvent () {
    this.inputs.forEach((item) => {
      item.addEventListener('change', this.inputChanged.bind(this))
    })

    this.radios.forEach((item) => {
      Array.from(item.children).forEach(child => {
        child.addEventListener('mousedown', this.radioClicked.bind(this))
      })
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

    this.radios.forEach(item => {
      let value = styleManipulation.getStyle(this.selectedItem,
        item.getAttribute('editCSS'))
      let current = item.querySelectorAll('.active')[0]
      if (current) current.classList.remove('active')
      Array.from(item.children).forEach(child => {
        if (child.getAttribute('val') === value) child.classList.add('active')
      })
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

  radioClicked (e) {
    let item = e.currentTarget
    this.changeCurrentStyle(item.parentNode.getAttribute('editCSS'), item.getAttribute('val'))
    this.setStyles()
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
