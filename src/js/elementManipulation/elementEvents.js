/* global $ alert */
const elementEditor = require('./elementEditor')
const pageDomTree = require('./pageDomTree')
const changeScreenSize = require('./changeScreenSize')
const keydown = require('../interaction/keydown.js')
const contextMenu = require('../interaction/contextMenu.js')

const elementEvents = {
  currentElement: null, // selected Element
  hoveredElement: null, // current hovered element
  clipboard: null, // virtual clipboard

  init () {
    this.cacheDom()
    this.bindEvents()
    changeScreenSize.init()
  },

  initAfterFrame () {
    this.bindFrameEvents()
    pageDomTree.build()
  },

  cacheDom () {
    this.$close = $('#closeClick')
    this.$drag = $('#moveClick')
    this.$duplicate = $('#duplicateClick')
    this.$delete = $('#deleteClick')
  },

  bindEvents () {
    this.$close.on('click', (e) => { this.noClick() })
    this.$drag.on('mousedown', (e) => { this.dragStart() })
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

    $('body').off('mouseover').on('mouseover', (e) => { // if iframe is not hovered anymore
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

  changeRes (res) {
    changeScreenSize.changeResolution(res)
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

  allowHover: true,
  hover (e) { // any element hover
    if (this.allowHover) {
      this.showRectAroundElement(e, 'hover')
    }
  },

  noHover () { // remover hover state
    this.hideRectAroundElement('hover')
  },

  copy () { // copy element in real and virtual clipboard
    if (!this.currentElement) {
      alert('nothing selected')
      return
    }

    let x = $(this.currentElement).wrap('<p/>').parent().html()
    let $temp = $('<input>')
    $('body').append($temp)
    $temp.val(x).select()
    document.execCommand('copy')
    this.clipboard = x
    $temp.remove()
    $(this.currentElement).unwrap()
  },

  cut () { // copy the element and delete it afterwards
    if (!this.currentElement) {
      alert('nothing selected to cut')
      return
    }
    this.copy()
    this.delete()
    this.change()
  },

  delete () { // remove element
    if (!this.currentElement) {
      alert('nothing selected to delete')
      return
    }

    $(this.currentElement).remove()
    this.noClick()
    this.change()
  },

  // how to append - what to append, where to append
  /*
    @input appendStyle = how to append the items
    @input data = what to appendStyle
    @input whereDom = where to append in the dom */
  paste (appendStyle = 'in', data, whereDom) { // places the virtual copied element under the selected
    let insertHTML = data || this.clipboard
    let insertDom = whereDom || this.currentElement
    if (!insertHTML || !insertDom) {
      alert('no selected element or nothing in clipboard')
      return
    }
    switch (appendStyle) {
      case 'after':
        $(insertHTML).insertAfter(insertDom)
        break
      case 'before':
        $(insertHTML).insertBefore(insertDom)
        break
      case 'in':
        $(insertDom).append(insertHTML)
        break
    }

    this.change()
  },

  duplicate () { // duplicates the selected element under the selected
    if (!this.currentElement) {
      alert('nothing selected to duplicate')
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
  },

  // the following is all bout dragging an element
  draggedElement: null, // dragged element
  pasteDraggedAs: null,
  dragStart () {
    if (!this.currentElement) {
      alert('nothing selected to drag')
      return
    }
    let x = $(this.currentElement).wrap('<p/>').parent().html() // clicked element
    this.draggedElement = x // save element
    this.delete() // remove element from dom

    this.allowHover = false // remove currenthoverEvent
    this.hoveredElement = null
    this.noHover() // "

    $('#simulated')
      .contents()
      .off('mousemove')
      .on('mousemove.dragHover', '*', (e) => { // hover events
        e.stopImmediatePropagation()
        this.dragHover(e)
      })

    $('#simulated')
      .contents()
      .off('mouseup')
      .on('mouseup.dragEnd', 'body', (e) => { // hover events
        e.stopImmediatePropagation()
        this.dragEnd()
      })

    $(document).on('mouseup.dragEndDocument', (e) => {
      this.dragEnd()
    })
  },

  dragHover (e) {
    this.hoveredElement = e.target // hovered item is now in this.hoveredElement
    // get position of mouse in item
    let parentOffset = e.currentTarget.parentElement.getBoundingClientRect()
    let rect = e.target.getBoundingClientRect()
    let x = (e.pageX - parentOffset.left)
    let y = (e.pageY - parentOffset.top)
    // set default values
    this.pasteDraggedAs = 'in' // insert in the target
    let closeTo = 8
    let customBorder = `: ${closeTo}px solid rgb(53, 130, 255);` // display closeTo
    // get wanted action
    if (x < closeTo) { // left
      customBorder = 'border-left' + customBorder
      this.pasteDraggedAs = 'before' // insert before target
    } else if (x > (rect.width - closeTo)) { // right
      customBorder = 'border-right' + customBorder
      this.pasteDraggedAs = 'after' // insert after target
    } else if (y < closeTo) { // top
      customBorder = 'border-top' + customBorder
      this.pasteDraggedAs = 'before'
    } else if (y > (rect.height - closeTo)) { // bottom
      customBorder = 'border-bottom' + customBorder
      this.pasteDraggedAs = 'after'
    } else { // center
      customBorder = ''
    }
    // display wanted action in dom
    rect.width = rect.width - 2 * closeTo
    rect.height = rect.height - 2 * closeTo
    $('.hover').attr('style', `
      display: block;
      width:${rect.width};
      height:${rect.height};
      top:${rect.top};
      left:${rect.left};
      ${rect.border};
      border: ${closeTo}px solid rgba(53, 130, 255, .60);
      ${customBorder}
    `)
  },

  dragEnd () {
    // paste  how to append - what to append, where to append
    this.paste(this.pasteDraggedAs, this.draggedElement, this.hoveredElement)
    // remove all not needed events
    $('#simulated').contents().off('mousemove.dragHover')
    $('#simulated').contents().off('mouseup.dragEnd')
    $(document).off('mouseup.dragEndDocument')
    // reset to previous
    this.allowHover = true
  }
}

module.exports = elementEvents
