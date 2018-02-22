/** edit text inside the iframe */
const textEditor = {
  /** is textEditor mode active */
  active: false,
  /** main iframe */
  $iframe: null,

  /** Initialize  */
  init () {
  },

  /** get the iframe from elementEvents */
  initWithFrame (iframe) {
    this.$iframe = iframe
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

  /** enable textEditor mode  */
  enable () {
    this.active = true
    this.$iframe.body.setAttribute('contentEditable', 'true')
  },

  /** disable textEditor mode  */
  disable () {
    this.active = false
    this.$iframe.body.removeAttribute('contentEditable')
  }
}
module.exports = textEditor
