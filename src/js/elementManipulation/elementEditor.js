const styleManipulation = require('./styleManipulation')

/** Manipulate inline or CSS styles for elements
  * with an custom UI.
  */
const elementEditor = {
  selectedItem: null,

  // run change after dom changed
  change: null,

  /** Initialize elementEditor. */
  init () {
    this.cacheDom()
    this.bindGlobalEvent()
    classEditor.init()
  },

  /** Initialize elements after the iframe is ready.
  * @param {HTMLElement} iframe - main iframe window
  * @param {Function} change - function to run after dom changed
  */
  initAfterFrame (iframe, change) {
    this.$iframe = iframe.contentDocument
    this.change = change
    styleManipulation.init(this.$iframe)
  },

  /** Cache dom elements. */
  cacheDom () {
    this.$allEvents = document.getElementById('elementEditor')
    this.$elementProperties = document.getElementsByClassName('element-properties')

    // create dynamically
    this.inputs = Array.from(this.$allEvents.querySelectorAll('input')).filter(item => item.hasAttribute('editCSS'))
    this.radios = Array.from(this.$allEvents.querySelectorAll('.radio')).filter(item => item.hasAttribute('editCSS'))
    this.expandable = Array.from(this.$allEvents.querySelectorAll('.expandable-container'))
    this.inputProp = Array.from(this.$allEvents.querySelectorAll('input')).filter(item => item.hasAttribute('editProp'))
  },

  /* Bind events which should be always present */
  bindGlobalEvent () {
    // is input changed
    this.inputs.forEach((item) => {
      item.addEventListener('keydown', this.overwriteDefault.bind(this))
      item.addEventListener('change', this.inputChanged.bind(this))
    })

    // is radio clicked
    this.radios.forEach((item) => {
      Array.from(item.children).forEach(child => {
        child.addEventListener('mousedown', this.radioClicked.bind(this))
      })
    })

    // is expandable clicked
    this.expandable.forEach((item) => {
      this.toggleExpandable(item)
    })

    this.inputProp.forEach((item) => {
      item.addEventListener('keydown', this.overwriteDefault.bind(this))
      item.addEventListener('change', this.propChanged.bind(this))
    })
  },

  overwriteDefault (e) {
    e.stopImmediatePropagation()
  },

  /** from https://stackoverflow.com/a/19765382/8270857 simple rgb to hex converter
   * @param {String} rgb - default html rgb code like: rgb(0, 0, 0)
   */
  rgbToHex (rgb) {
    let color = rgb.replace('rgb(', ' ').replace('rgba(', ' ').replace(')', ' ')
    color = color.split(',')
    var hex = color[2] | (color[1] << 8) | (color[0] << 16)
    return '#' + (0x1000000 + hex).toString(16).slice(1)
  },

  /** show or hide expandable content
   *  @param {HTMLElement} item - a expandable block
   */
  toggleExpandable (item) {
    let opener = item.querySelectorAll('.openContent')[0]
    let open = item.querySelectorAll('.expandable-content')[0]
    if (!opener || !open) return
    opener.addEventListener('mousedown', () => {
      opener.classList.toggle('active')
      open.classList.toggle('active')
    })
  },

  /** Select an HTML Item and show the current style properties.
   * @param {HTMLElement} item - any rendered html element
   */
  select (item) {
    this.selectedItem = item
    this.setStyles()
    classEditor.select(item)
    this.showProperties(item.nodeName)
    this.showPropertiesValue(item.nodeName)
  },

  /** Remove the selected properties and reset style displays.   */
  unselect () {
    this.selectedItem = null
  },

  /** Display compatible properties.
   * @param {String} nodeName - nodeName to find compatible properties
   */
  showProperties (nodeName) {
    if (!this.selectedItem) return false
    Array.from(this.$elementProperties).forEach(item => {
      item.classList.remove('active')
      if (item.getAttribute('inputFor') === nodeName) {
        item.classList.add('active')
      }
    })
  },

  /** Display property values.  */
  showPropertiesValue () {
    if (!this.selectedItem) return false
    this.inputProp.forEach(item => {
      let prop = item.getAttribute('editProp')
      item.value = this.selectedItem.getAttribute(prop) || ''
    })
  },

  /** Replace the current property with a new one or delete it.
  * @param {Event} e - the event with target
  */
  propChanged (e) {
    if (!this.selectedItem) return false
    let val = e.currentTarget.value
    let prop = e.currentTarget.getAttribute('editProp')

    if (val === '') {
      this.selectedItem.removeAttribute(prop)
    } else {
      this.selectedItem.setAttribute(prop, val)
    }
  },

  /** Get current Style and display properties inside inputs, radios and so on.  */
  setStyles () {
    let isClass = false
    if (classEditor.cssClass) {
      classEditor.createClassStyle()
      isClass = true
    }

    this.setStylesInputs(isClass)
    this.setStylesRadios(isClass)

    if (isClass) classEditor.removeStyleClass()
  },

  /** fill the inputs with the current style attributes
   * @param {Bool} isClass - is the edited part a class
   */
  setStylesInputs (isClass) {
    this.inputs.forEach(item => {
      let style = (isClass)
        ? classEditor.getStyleClass(item.getAttribute('editCSS'))
        : styleManipulation.getStyle(this.selectedItem, item.getAttribute('editCSS'))
      if (item.getAttribute('type') === 'color') style = this.rgbToHex(style)
      item.value = style
    })
  },

  /** fill the radios with the current style attributes
   * @param {Bool} isClass - is the edited part a class
   */
  setStylesRadios (isClass) {
    this.radios.forEach(item => {
      let style = (isClass)
        ? classEditor.getStyleClass(item.getAttribute('editCSS'))
        : styleManipulation.getStyle(this.selectedItem, item.getAttribute('editCSS'))
      let current = item.querySelectorAll('.active')[0]
      if (current) current.classList.remove('active')
      Array.from(item.children).forEach(child => {
        if (child.getAttribute('val') === style) child.classList.add('active')
      })
    })
  },

  /** remove current style from inline or css
   * @param {String} style - name of style like: border
   */
  removeStyle (style) {
    if (classEditor.cssClass) {
      styleManipulation.removeStyleFromClass(classEditor.cssClass, style)
      styleManipulation.createStyleHTML()
    } else {
      styleManipulation.removeInlineStyle(this.selectedItem, style)
    }
  },

  /** Display the change after input.
  * @param {Event} e - the event with target
  */
  inputChanged (e) {
    let item = e.currentTarget
    this.changeCurrentStyle(item.getAttribute('editCSS'), item.value)
  },

  /** Display the change after radio selected.
  * @param {Event} e - the event with target
  */
  radioClicked (e) {
    let item = e.currentTarget
    this.changeCurrentStyle(item.parentNode.getAttribute('editCSS'), item.getAttribute('val'))
    this.setStyles()
  },

  /** Change the inline style or the class style
  * @param {String} style - which property to style
  * @param {String} value - the value for the style
  */
  changeCurrentStyle (style, value) {
    if (!classEditor.cssClass) {
      styleManipulation.setInlineStyle(this.selectedItem, style, value)
    } else {
      styleManipulation.addStyleToClass(classEditor.cssClass, style, value)
      styleManipulation.createStyleHTML()
    }
    if (this.change) this.change()
  }

}

module.exports = elementEditor

/** Css class editor, either add or remove style from/to classes. */
const classEditor = {
  clickedClass: null,
  cssClass: null,

  /** Initialize elementEditor. */
  init () {
    this.cacheDom()
    this.bindEvents()
  },

  /** Cache dom elements. */
  cacheDom () {
    // its alot but the easiest way
    // windows
    this.$classListings = document.getElementById('classListings')
    this.$classSettings = document.getElementById('classSettings')
    this.$addClassWindow = document.getElementById('addClassWindow')
    this.$usingClass = document.getElementById('usingClass')

    // inputs and buttons
    this.$selectedClassName = document.getElementById('selectedClassName')
    this.$classes = document.getElementById('elementClasses')
    this.$addClass = document.getElementById('addClass')
    this.$selectClass = document.getElementById('selectClass')
    this.$removeClass = document.getElementById('removeClass')
    this.$returnFromClass = document.getElementById('returnFromClass')
    this.$addClassInput = document.getElementById('addClassInput')
    this.$usingClassName = document.getElementById('usingClassName')
  },

  /** Apply events to static content  */
  bindEvents () {
    this.$classes.addEventListener('mousedown', (e) => {
      let item = e.target.closest('.item')
      if (item) this.clicked(item)
    })

    this.$selectClass.addEventListener('mousedown', this.selectClassToEdit.bind(this))
    this.$removeClass.addEventListener('mousedown', this.remove.bind(this))
    this.$returnFromClass.addEventListener('mousedown', this.returnBack.bind(this))
    this.$addClass.addEventListener('mousedown', this.showAddClass.bind(this))
    this.$addClassInput.addEventListener('change', this.addClass.bind(this))
  },

  /** Select Class
   * @param {HTMLElement} selectedItem
   */
  select (selectedItem) {
    this.cssClass = null
    this.hideAllandShow(this.$classListings)
    this.displayAviableClasses(selectedItem)
  },

  styleClass: null,
  /** Create temporary div and add a class to get the current style. */
  createClassStyle () {
    let temp = elementEditor.$iframe.createElement('div')
    temp.classList.add(this.cssClass)
    elementEditor.$iframe.body.appendChild(temp)
    this.styleClass = temp
  },

  /** Get style info from the created div. */
  getStyleClass (style) {
    return styleManipulation.getStyle(this.styleClass, style)
  },

  /** Remove the created style div. */
  removeStyleClass () {
    this.styleClass.remove()
    this.styleClass = null
  },

  /** Display all the classes the selected item has.  */
  displayAviableClasses (selectedItem) {
    let c = selectedItem.getAttribute('class')
    this.$classes.innerHTML = ''
    if (c) {
      c.split(' ').forEach((item) => {
        this.$classes.innerHTML +=
        `<p class="item">${item}</p>`
      })
    }
  },

  /** Hide all windows and show the only wanted.
   * @param {HTMLElement} toShow - this gets the active class
   */
  hideAllandShow (toShow) {
    this.$classListings.classList.remove('active')
    this.$classSettings.classList.remove('active')
    this.$addClassWindow.classList.remove('active')
    this.$usingClass.classList.remove('active')

    if (toShow) {
      toShow.classList.add('active')
    }
  },

  /** Return to the default state window.  */
  returnBack () {
    this.hideAllandShow(this.$classListings)
  },

  /** Specific classname was clicked and now show the options for it.
   * @param {HTMLElement} element - element with the classname in the innerHTML
   */
  clicked (element) {
    this.clickedClass = element.innerHTML
    this.$selectedClassName.innerHTML = element.innerHTML
    this.hideAllandShow(this.$classSettings)
  },

  /** Remove the class from the selected element.  */
  remove () {
    elementEditor.selectedItem.classList.remove(this.clickedClass)
    this.displayAviableClasses(elementEditor.selectedItem)
    this.hideAllandShow(this.$classListings)
    if (elementEditor.change) elementEditor.change()
  },

  /** Edit now the css class instead the inline.  */
  selectClassToEdit () {
    this.cssClass = this.clickedClass
    this.$usingClassName.innerHTML = this.cssClass
    this.hideAllandShow(this.$usingClass)
    elementEditor.setStyles()
  },

  /** Display add class window.  */
  showAddClass () {
    this.hideAllandShow(this.$addClassWindow)
  },

  /** Add a Class to the current Element.
   * @param {Event} e
   */
  addClass (e) {
    let className = e.currentTarget.value
    elementEditor.selectedItem.classList.add(className)
    this.displayAviableClasses(elementEditor.selectedItem)
    e.currentTarget.value = ''
    this.hideAllandShow(this.$classListings)
    if (elementEditor.change) elementEditor.change()
  }
}

module.exports.classEditor = classEditor
