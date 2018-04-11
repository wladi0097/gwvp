/** Manipulate CSS styles for elements or classes */
const styleManipulation = {
  $iframe: null,

  /** Add Iframe to styleManipulation
  * @param {HTMLElement} iframe
  */
  init (iframe) {
    this.$iframe = iframe
  },

  /** Get the computed style from an element.
  * @param {HTMLElement} elem
  * @param {String} style - style like 'width'
  * @return style or false if error
  */
  getStyle (elem, style) {
    if (!elem || !style) return false
    let computed = elem.style[style] || window.getComputedStyle(elem)[style]
    return (computed === '') ? 'default' : computed
  },

  /** Sets the inlineStyle for a element.
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

  /** Remove a single inlineStyle argument from an element.
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

  /** Remove the complete inlineStyle from an element.
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
  cssClasses: [],
  /**
  * @typedef  {Object} cssClass
  * @property {String} name - selector
  * @property {cssClassStyles[]} styles - array out of styles
  */

  headStyle: null,

  /** Create a style element inside the dom head if not found.  */
  isCustomStyleTagPresent () {
    if (!this.headStyle) {
      this.$iframe.getElementsByTagName('head')[0].innerHTML +=
        '<style id="customClassStyles" gwvp-name="User Style"></style>'
      this.headStyle = this.$iframe.getElementById('customClassStyles')
    }
  },

  /** Find an existing class inside cssClasses.
  * @param {String} name - css selector like '.start'
  * @return {cssClass || undefined}
  */
  getCssClassByName (name) {
    return this.cssClasses.find(item => {
      return item.name === name
    })
  },

  /** Create a CssClass.
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

  /** Remove a CssClass. */
  removeCssClass (cssClass) {
    this.cssClasses = this.cssClasses.filter((e) => e !== cssClass)
  },

  /** Add style to an cssClass.
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

  /** Remove style from an cssClass.
  * @param {String} cssClass - css selector like '.start'
  * @param {String} style - css style like 'height'
  * @return {cssClass}
  */
  removeCssClassStyles (cssClass, style) {
    cssClass.styles = cssClass.styles.filter((e) => e.style !== style)
    return cssClass
  },

  /** Add a class with styles.
  * @param {String} className - css selector like '.start
  * @param {String} style - css style like 'height'
  * @param {String} value - css value like '200px'
  */
  addStyleToClass (className, style, value) {
    this.isCustomStyleTagPresent()
    let foundClass = this.getCssClassByName(className) || this.createCssClass(className)
    this.addCssClassStyles(foundClass, style, value)
  },

  /** Remove a class style and remove the class if it is empty afterwards.
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

  /** Insert valid css into the headStyle style tag */
  createStyleHTML () {
    let html = ''
    this.cssClasses.forEach((item) => {
      html += '.' + item.name + ' {\n'
      item.styles.forEach((style) => {
        html += style.style + ': ' + style.value + ';\n'
      })
      html += '}\n'
    })
    this.headStyle.innerHTML = html
  }
}
module.exports = styleManipulation
