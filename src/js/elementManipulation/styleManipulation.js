/* global getComputedStyle */

/** manipulate CSS style for elements or classes
*/
const styleManipulation = {
  /** get computed style from element
  * @param {HTMLElement} elem
  * @param {String} style - style like 'width'
  * @return style or false if error
  */
  getStyle (elem, style) {
    if (!elem || !style) return false
    let computed = getComputedStyle(elem)[style]
    return (computed === '') ? 'default' : computed
  },

  /** sets the inlineStyle for a element
  * @param {HTMLElement} elem
  * @param {String} style - style like 'width'
  * @param {String} value - value for the style
  * @return elem or false if error
  */
  setInlineStyle (elem, style, value) {
    if (!elem || !style || !value) return false

    elem.style[style] = value
    return elem
  },

  /** remove a single inlineStyle argument
  * @param {HTMLElement} elem
  * @param {String} style - style like 'width'
  * @return elem or false if error
  */
  removeInlineStyle (elem, style) {
    if (!elem || !style) return false
    elem.setAttribute('style',
      elem.getAttribute('style').replace(
        new RegExp(style + '[^;]+;?', 'g'), ''))
    return elem
  },

  /** remove complete inlineStyle from element
  * @param {HTMLElement} elem
  * @return elem or false if error
  */
  removeInlineStyleFull (elem) {
    if (!elem) return false
    elem.setAttribute('style', '')
    return elem
  },

  // ---------------------------
  /**
  * @typedef  {Object} cssClassStyles
  * @property {String} style - stylename like 'width'
  * @property {String} value - value of the style
  */

  /**
  * @typedef  {Object} cssClass
  * @property {String} name - selector
  * @property {cssClassStyles[]} styles - array out of styles
  */
  cssClasses: [],
  headStyle: null,

  /** create a style inside the head if not found  */
  isCustomStyleTagPresent () {
    if (!this.headStyle) {
      document.getElementsByTagName('head')[0].innerHTML +=
        '<style id="customClassStyles"></style>'
      this.headStyle = document.getElementById('customClassStyles')
    }
  },

  /** find a existing class inside cssClasses
  * @param {String} name - css selector like '.start'
  * @return {cssClass || undefined}
  */
  getCssClassByName (name) {
    return this.cssClasses.find(item => {
      return item.name === name
    })
  },

  /**
  * @param {String} name - css selector like '.start'
  * @return {cssClass} created cssClass
  */
  createCssClass (name) {
    this.cssClasses.push({
      name,
      styles: []
    })
    return this.cssClasses[this.cssClasses.length - 1]
  },

  removeCssClass (cssClass) {
    this.cssClasses = this.cssClasses.filter((e) => e !== cssClass)
  },

  /** add style to cssClass
  * @param {String} cssClass - css selector like '.start'
  * @param {String} style - css style like 'height'
  * @param {String} value - css value like '200px'
  * @return {cssClass}
  */
  addCssClassStyles (cssClass, style, value) {
    let found = cssClass.styles.find(item => {
      return item.style === style
    })

    if (found) {
      found.value = value
    } else {
      cssClass.styles.push({ style, value })
    }
    return cssClass
  },

  /** remove style from cssClass
  * @param {String} cssClass - css selector like '.start'
  * @param {String} style - css style like 'height'
  * @return {cssClass}
  */
  removeCssClassStyles (cssClass, style) {
    cssClass.styles = cssClass.styles.filter((e) => e.style !== style)
    return cssClass
  },

  /** add a class with styles
  * @param {String} className - css selector like '.start
  * @param {String} style - css style like 'height'
  * @param {String} value - css value like '200px'
  */
  addStyleToClass (className, style, value) {
    this.isCustomStyleTagPresent()
    let foundClass = this.getCssClassByName(className) || this.createCssClass(className)
    this.addCssClassStyles(foundClass, style, value)
  },

  /** remove a class style and remove the class if empty afterwards
  * @param {String} className - css selector like '.start
  * @param {String} style - css style like 'height''
  */
  removeStyleFromClass (className, style) {
    this.isCustomStyleTagPresent()
    let found = this.getCssClassByName(className)
    if (!found) return false
    if (this.removeCssClassStyles(found, style).styles.length === 0) {
      this.removeCssClass(found)
    }
  },

  /** insert valid css into a style tag */
  createStyleHTML () {
    let html = ''
    this.cssClasses.forEach((item) => {
      html += item.name + ' {\n'
      item.styles.forEach((style) => {
        html += style.style + ': ' + style.value + ';\n'
      })
      html += '}\n'
    })
    this.headStyle.innerHTML = html
  }
}
module.exports = styleManipulation
