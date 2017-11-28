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
      .bindEvents()
    changeScreenSize.init()
    return this
  },

  initAfterFrame () {
    this.bindFrameEvents()
    pageDomTree.build()
    return this
  },

  cacheDom () {
    this.$close = $('#closeClick')
    this.$drag = $('#moveClick')
    this.$itemName = $('#itemName')
    return this
  },

  bindEvents () {
    this.$close.on('click', (e) => { this.noClick() })
    this.$drag.on('mousedown', (e) => { this.dragStart() })
    return this
  },

  bindFrameEvents () {
    $('#simulated').contents().off('mouseover.fullHover').on('mouseover.fullHover', '*', (e) => { // hover events
      e.stopImmediatePropagation()
      this.hover(e)
    })

    $('#simulated').contents().off('click.fullClick').on('click.fullClick', '*', (e) => { // click events
      e.stopImmediatePropagation()
      this.click(e)
    })

    $('body').off('mouseover').on('mouseover', (e) => { // if iframe is not hovered anymore
      e.stopImmediatePropagation()
      this.noHover(e)
    })

    // bind events to iframe
    contextMenu.init($('iframe').contents()[0])
    keydown.init($('iframe').contents()[0])

    // TODO: scroll
    return this
  },

  change () { // gets fired after something was changed
    pageDomTree.build()
    return this
  },

  changeRes (res) {
    changeScreenSize.changeResolution(res)
    this.redrawRect()
    return this
  },

  click (e) { // any element clicked
    this.noHover()
      .showRectAroundElement(e, 'click')
    this.currentElement = e.target
    this.$itemName.html(e.target.nodeName)
    elementEditor.select(e.target)
    return this
  },

  noClick () { // remove all click states
    this.currentElement = null
    this.hideRectAroundElement('click')
    elementEditor.unselect()
    return this
  },

  allowHover: true,
  hover (e) { // any element hover
    if (this.allowHover) {
      this.showRectAroundElement(e, 'hover')
    }
    return this
  },

  noHover () { // remover hover state
    this.hideRectAroundElement('hover')
    return this
  },

  copy () { // copy element in real and virtual clipboard
    if (!this.currentElement) {
      alert('nothing selected')
      return this
    }

    let x = $(this.currentElement).wrap('<p/>').parent().html()
    let $temp = $('<input>')
    $('body').append($temp)
    $temp.val(x).select()
    document.execCommand('copy')
    this.clipboard = x
    $temp.remove()
    $(this.currentElement).unwrap()
    return this
  },

  cut () { // copy the element and delete it afterwards
    if (!this.currentElement) {
      alert('nothing selected to cut')
      return this
    }
    this.copy()
      .delete()
      .change()
    return this
  },

  delete () { // remove element
    if (!this.currentElement) {
      alert('nothing selected to delete')
      return this
    }

    $(this.currentElement).remove()
    this.noClick()
      .change()
    return this
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
      return this
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
    return this
  },

  duplicate () { // duplicates the selected element under the selected
    if (!this.currentElement) {
      alert('nothing selected to duplicate')
      return this
    }
    $(this.currentElement).clone().insertAfter(this.currentElement)
    this.change()
    return this
  },

  redrawRect () {
    if (this.currentElement) {
      $(this.currentElement).trigger('click')
    }
    if (this.hoveredElement) {
      $(this.hoveredElement).trigger('mouseover')
    }
  },

  showRectAroundElement (e, type) { // display rectangle around choosen element
    let rect = e.target.getBoundingClientRect()
    $(`.${type}`).attr('style', `
      display: block;
      width:${rect.width}px;
      height:${rect.height}px;
      top:${rect.top}px;
      left:${rect.left}px;
      `)
    return this
  },

  hideRectAroundElement (type) { // hide rectangle
    $(`.${type}`).attr('style', '')
    return this
  },

  // the following is all bout dragging an element
  draggedElement: null, // dragged element
  pasteDraggedAs: null, // paste style
  dragStart (html) {
    if (!this.currentElement && !html) {
      alert('nothing selected to drag')
      return this
    }

    if (html) {
      this.draggedElement = html
    } else {
      let x = $(this.currentElement).wrap('<p/>').parent().html() // clicked element
      this.draggedElement = x // save element
      $(x).remove()
      this.delete() // remove element from dom
    }

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
    return this
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
    let customBorder = `: ${closeTo}px solid;` // display closeTo
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
    rect.width = rect.width
    rect.height = rect.height
    $('.hover').attr('style', `
      display: block;
      background-color: transparent;
      width:${rect.width}px;
      height:${rect.height + 4}px;
      top:${rect.top}px;
      left:${rect.left}px;
      ${rect.border};
      border: 2px dashed;
      ${customBorder}
    `)
    return this
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
    return this
  }
}

module.exports = elementEvents
