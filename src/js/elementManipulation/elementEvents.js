/* global $ alert */
const elementEditor = require('./elementEditor')
const pageDomTree = require('./pageDomTree')
const keydown = require('../interaction/keydown.js')
const contextMenu = require('../interaction/contextMenu.js')

const elementEvents = {
  currentElement: null,
  clipboard: null,

  init () {
    this.cacheDom()
    this.bindEvents()
  },

  cacheDom () {
    this.$close = $('#closeClick')
    this.$move = $('#moveClick')
    this.$duplicate = $('#duplicateClick')
    this.$delete = $('#deleteClick')
  },

  bindEvents () {
    this.$close.on('click', (e) => { this.noClick() })
    this.$move.on('click', (e) => { alert('not Implemented') })
    this.$duplicate.on('click', (e) => { this.duplicate() })
    this.$delete.on('click', (e) => { this.delete() })
  },

  bindFrameEvents () {
    $('#simulated').contents().off('mouseover').on('mouseover', '*', (e) => { // hover events
      e.stopImmediatePropagation()
      this.hover(e)
    })

    $('#simulated').contents().off('click').on('click', '*', (e) => { // click events
      e.stopImmediatePropagation()
      this.click(e)
    })

    $('body').on('mouseover', (e) => { // if iframe is not hovered anymore
      e.stopImmediatePropagation()
      this.noHover(e)
    })

    // bind events to iframe
    contextMenu.init($('iframe').contents())
    keydown.init($('iframe').contents())

    // TODO: scroll
  },

  change () { // gets fired after something was changed
    pageDomTree.build()
  },

  click (e) { // any element clicked
    this.noHover()
    this.currentElement = e.target
    this.showRectAroundElement(e, 'click')
    elementEditor.select(e.target)
  },

  noClick () { // remove all click states
    this.currentElement = null
    elementEditor.unselect()
    this.hideRectAroundElement('click')
  },

  hover (e) { // any element hover
    this.showRectAroundElement(e, 'hover')
  },

  noHover () { // remover hover state
    this.hideRectAroundElement('hover')
  },

  copy () { // copy element in real and virtual clipboard
    if (!this.currentElement) {
      alert('nothing selected')
      return
    }

    var x = $(this.currentElement).wrap('<p/>').parent().html()
    var $temp = $('<input>')
    $('body').append($temp)
    $temp.val(x).select()
    document.execCommand('copy')
    this.clipboard = x
    $temp.remove()
    $(this.currentElement).unwrap()
  },

  cut () { // copy the element and delete it afterwards
    if (!this.currentElement) {
      alert('nothing selected')
      return
    }
    this.copy()
    this.delete()
    this.change()
  },

  delete () { // remove element
    if (!this.currentElement) {
      alert('nothing selected')
      return
    }

    $(this.currentElement).remove()
    this.noClick()
    this.change()
  },

  paste () { // places the virtual copied element under the selected
    if (!this.currentElement || !this.clipboard) {
      alert('nothing selected')
      return
    }
    $(this.clipboard).insertAfter(this.currentElement)
    this.change()
  },

  duplicate () { // duplicates the selected element under the selected
    if (!this.currentElement) {
      alert('nothing selected')
      return
    }
    $(this.currentElement).clone().insertAfter(this.currentElement)
    this.change()
  },

  showRectAroundElement (e, type) { // display rectangle around choosen element
    let rect = e.target.getBoundingClientRect()
    $(`.${type}`).attr('style', `
      display: block;
      width:${rect.width};
      height:${rect.height};
      top:${rect.top};
      left:${rect.left};
      `)
  },

  hideRectAroundElement (type) { // hide rectangle
    $(`.${type}`).attr('style', '')
  }
}
module.exports = elementEvents
