/* global getComputedStyle */
/** edit text inside the iframe */
const textEditor = {
  /** is textEditor mode active */
  active: false,
  /** main iframe */
  $iframe: null,
  /** selected text by user */
  selectedText: null,
  /** selected element which contains the selcted text */
  selectedElement: null,

  /** Initialize  */
  init () {
    this.cacheDom()
    this.bindEvents()
  },

  /** get the iframe from elementEvents */
  initWithFrame (iframe) {
    this.$iframe = iframe
  },

  /** cache all static dom elements */
  cacheDom () {
    this.$texteditor = document.getElementById('texteditor')
    this.$dropdown = document.getElementsByClassName('texteditor-dropdown')
    // font tag
    this.$tag = document.getElementById('textEditor-item-tag')
    this.$tagChoose = document.getElementById('textEditor-item-tagChoose')

    // fontfamily
    this.$fontFamily = document.getElementById('textEditor-item-fontFamily')
    this.$fontFamilyChoose = document.getElementById('textEditor-item-fontFamilyChoose')

    // fontSize
    this.$fontSize = document.getElementById('textEditor-item-fontSize')

    // alignment
    this.$alignLeft = document.getElementById('textEditor-item-alignLeft')
    this.$alignCenter = document.getElementById('textEditor-item-alignCenter')
    this.$alignRight = document.getElementById('textEditor-item-alignRight')

    // font formating
    this.$bold = document.getElementById('textEditor-item-bold')
    this.$italics = document.getElementById('textEditor-item-italics')
    this.$underline = document.getElementById('textEditor-item-underline')
    this.$strikethrough = document.getElementById('textEditor-item-strikethrough')
    this.$link = document.getElementById('textEditor-item-link')
    this.$allFontFormating = [this.$bold, this.$italics, this.$underline, this.$strikethrough, this.$link]

    // font spacing
    this.$letterSpacing = document.getElementById('textEditor-item-letterSpacing')
    this.$lineHeight = document.getElementById('textEditor-item-lineHeight')

    // clear
    this.$clear = document.getElementById('textEditor-item-clear')
  },

  /** bind all static events for the cacheDom() elements */
  bindEvents () {
    Array.from(this.$dropdown)
      .forEach((element) => {
        element.addEventListener('mousedown', (e) => { this.showDropdown(e) })
      })
    document.addEventListener('mousedown', (e) => { this.hideDropdown(e) })
    // font family
    this.$fontFamily.addEventListener('change', (e) => { this.setFontFamily(e.currentTarget.value) })
    this.$fontFamilyChoose.addEventListener('mousedown', (e) => {
      let el = e.target.closest('li')
      if (el) {
        this.setFontFamily(getComputedStyle(el)['font-family'])
      }
    })
    // font size
    this.$fontSize.addEventListener('change', (e) => { this.setFontSize(e.currentTarget.value) })
    // alignment
    this.$alignLeft.addEventListener('mousedown', () => { this.setAlignment('left') })
    this.$alignCenter.addEventListener('mousedown', () => { this.setAlignment('center') })
    this.$alignRight.addEventListener('mousedown', () => { this.setAlignment('right') })
    // font formating
    Array.from(this.$allFontFormating)
      .forEach((element) => {
        element.addEventListener('mousedown', (e) => { this.fontFormating(e) })
      })
    // font spacing
    this.$letterSpacing.addEventListener('change', (e) => { this.setLetterSpacing(e.currentTarget.value) })
    this.$lineHeight.addEventListener('change', (e) => { this.setLineHeight(e.currentTarget.value) })
    // clear
    this.$clear.addEventListener('mousedown', () => { this.clear() })
  },

  /** bind iframe specific events */
  bindFrameEvents () {
    this.selectedEvent = this.selected.bind(this)
    this.$iframe.addEventListener('mouseup', this.selectedEvent)
    this.hideDropdownEvent = this.hideDropdown.bind(this)
    this.$iframe.addEventListener('mousedown', this.hideDropdownEvent)
    this.overwriteEvent = this.overwrite.bind(this)
    this.$iframe.addEventListener('keydown', this.overwriteEvent, true)
    this.$iframe.addEventListener('contextmenu', this.overwriteEvent, true)
  },

  /** unbind iframe specific events */
  unBindFrameEvents () {
    this.$iframe.removeEventListener('mouseup', this.selectedEvent)
    this.$iframe.removeEventListener('mousedown', this.hideDropdownEvent)
    this.$iframe.removeEventListener('keydown', this.overwriteEvent, true)
    this.$iframe.removeEventListener('contextmenu', this.overwriteEvent, true)
  },

  /** display the dropdown menus
  * @param {Event} e - event
  */
  showDropdown (e) {
    e.currentTarget.classList.toggle('active')
  },

  /** hide the dropdown menus
  * @param {Event} e - event
  */
  hideDropdown (e) {
    if (!e.target.closest('.texteditor-dropdown')) {
      Array.from(this.$dropdown)
        .forEach((element) => {
          element.classList.remove('active')
        })
    }
  },

  /** overwrite the keydown and contextmenu, so there
  * are no problems editing the text
  * @param {Event} e - event
  */
  overwrite (e) {
    e.stopImmediatePropagation()
  },

  /** some textarea got selected
  * @param {Event} e - event
  */
  selected (e) {
    e.stopImmediatePropagation()
    if (this.active) {
      this.selectedElement = this.findTextParent(e.target)
      this.selectedText = this.$iframe.getSelection()

      this.getAndShowTagRelatedStyling()
      this.getInlineStyling()
    }
  },

  /** all elements in the selected area  */
  selectedElements: [],
  /** get the range and elements inside the selected area  */
  getInlineStyling () {
    this.selectedElements = []
    // clear
    Array.from(this.$allFontFormating).forEach(elem => {
      elem.classList.remove('active')
    })
    // build new
    let range = this.selectedText.getRangeAt(0)
    if (range.commonAncestorContainer.nodeName === '#text') {
      this.showInlineStyling(range.commonAncestorContainer.parentNode)
    } else if (range.commonAncestorContainer.children) {
      let foundfirst = false
      Array.from(range.commonAncestorContainer.children)
        .forEach(elem => {
          if (elem === range.startContainer.parentNode ||
             this.selectedElement === range.startContainer.parentNode) {
            foundfirst = true
          }
          if (foundfirst) {
            this.selectedElements.push(elem)
            this.showInlineStyling(elem)
          }
        })
    }
  },

  /** display the currently active inline styling
   * @param {HTMLElement} elem - an InlineStyling menu button
   */
  showInlineStyling (elem) {
    switch (elem.nodeName) {
      case 'B':
        this.addInlineStylingActive(this.$bold)
        return
      case 'I':
        this.addInlineStylingActive(this.$italics)
        return
      case 'U':
        this.addInlineStylingActive(this.$underline)
        return
      case 'STRIKE':
        this.addInlineStylingActive(this.$strikethrough)
        return
      case 'A':
        this.addInlineStylingActive(this.$link)
    }
  },

  /** switch element to active if it isnt already
   * @param {HTMLElement} elem - element to give the active state to
   */
  addInlineStylingActive (elem) {
    if (!elem.classList.contains('active')) {
      elem.classList.add('active')
    }
  },

  /** get styling from elements and dispay it on the inputs and buttons  */
  getAndShowTagRelatedStyling () {
    let el = this.selectedElement
    this.setAlignment(getComputedStyle(el)['text-align'], false)
    this.setFontSize(getComputedStyle(el)['font-size'], false)
    this.setFontFamily(getComputedStyle(el)['font-family'], false)
    this.setLetterSpacing(getComputedStyle(el)['letter-spacing'], false)
    this.setLineHeight(getComputedStyle(el)['line-height'], false)
    this.setTag(el.nodeName, false)
  },

  /** wrap or unwrap text inside inline elements
   * @param {Event} e - event
   */
  fontFormating (e) {
    let elem = e.currentTarget.getAttribute('elem')
    if (e.currentTarget.classList.contains('active')) {
      let selected = this.selectedElements
      for (var i = 0; i < selected.length; i++) {
        if (selected[i].nodeName === elem) {
          selected[i].outerHTML = selected[i].innerHTML
        }
      }
    } else {
      if (this.selectedText.rangeCount) {
        let range = this.selectedText.getRangeAt(0)
        let text = this.selectedText.toString()
        range.deleteContents()
        let domelem = document.createElement(elem)
        domelem.innerHTML = text
        range.insertNode(domelem)
      }
    }
    this.getInlineStyling()
  },

  /** show / set the tagname
   * @param {String} to - element node name
   */
  setTag (to) {
    let name = to
    switch (to) {
      case 'H1':
        name = 'Heading 1'
        break
      case 'H2':
        name = 'Heading 2'
        break
      case 'H3':
        name = 'Heading 3'
        break
      case 'H4':
        name = 'Heading 4'
        break
      case 'H5':
        name = 'Heading 5'
        break
      case 'H6':
        name = 'Heading 6'
        break
      case 'P':
        name = 'Paragraph'
        break
    }
    this.$tag.innerHTML = name
  },

  /** show / set the font family
   * @param {String} to - element font family
   * @param {Boolean} addCSS - add setting to iframe element
   */
  setFontFamily (to, addCSS = true) {
    if (addCSS) {
      this.setCSS('font-family', to)
    }
    this.$fontFamily.value = to
  },

  /** show / set the font size
   * @param {String} to - element font size
   * @param {Boolean} addCSS - add setting to iframe element
   */
  setFontSize (to, addCSS = true) {
    if (addCSS) {
      this.setCSS('font-size', to)
    }
    this.$fontSize.value = to
  },

  /** show / set the text alignment
   * @param {String} to - element text alignment
   * @param {Boolean} addCSS - add setting to iframe element
   */
  setAlignment (to, addCSS = true) {
    if (addCSS) {
      this.setCSS('text-align', to)
    }
    this.$alignLeft.classList.remove('active')
    this.$alignCenter.classList.remove('active')
    this.$alignRight.classList.remove('active')
    switch (to) {
      case 'left':
      case 'start':
        this.$alignLeft.classList.add('active')
        return
      case 'center':
        this.$alignCenter.classList.add('active')
        return
      case 'right':
        this.$alignRight.classList.add('active')
    }
  },

  /** show / set the letter spacing
   * @param {String} to - element letter spacing
   * @param {Boolean} addCSS - add setting to iframe element
   */
  setLetterSpacing (to, addCSS = true) {
    if (addCSS) {
      this.setCSS('letter-spacing', to)
    }
    this.$letterSpacing.value = to
  },

  /** show / set the line height
   * @param {String} to - element line height
   * @param {Boolean} addCSS - add setting to iframe element
   */
  setLineHeight (to, addCSS = true) {
    if (addCSS) {
      this.setCSS('line-height', to)
    }
    this.$lineHeight.value = to
  },

  /** remove all inline css from iframe element  */
  clear () {
    this.selectedElement.setAttribute('style', '')
  },

  /** set CSS style to element
   * @param {String} - style name
   * @param {String} - value of style
   */
  setCSS (style, value) {
    let elem = this.selectedElement
    elem.style[style] = value
  },

  /** text Elements allowed to edit easily  */
  textElements: ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P', 'LI'],
  /** if inside inline Element find next text element as parent
  * @param {HTMLElement} node - "inline element" or something else
  */
  findTextParent (node) {
    if (this.textElements.indexOf(node.nodeName) !== -1) {
      return node
    } else {
      let search = node
      for (var i = 0; i < 10; i++) {
        search = node.parentNode
        if (this.textElements.indexOf(search.nodeName) !== -1) {
          return search
        }
      }
      return node
    }
  },

  /** enable textEditor mode  */
  enable () {
    this.bindFrameEvents()
    this.active = true
    this.$texteditor.classList.add('active')
    this.$iframe.body.setAttribute('contentEditable', 'true')
  },

  /** disable textEditor mode  */
  disable () {
    this.unBindFrameEvents()
    this.active = false
    this.$texteditor.classList.remove('active')
    this.$iframe.body.removeAttribute('contentEditable')
  }
}
module.exports = textEditor
