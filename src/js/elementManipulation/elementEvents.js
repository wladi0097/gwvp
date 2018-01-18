/* global alert MouseEvent */
const elementEditor = require('./elementEditor')
const pageDomTree = require('./pageDomTree')
const textEditor = require('./textEditor')
const keydown = require('../interaction/keydown.js')
const contextMenu = require('../interaction/contextMenu.js')

/** Modify all Iframe Dom elements width elementEvents,
 * also highlight currently hovered and selected elements and save them for further use.
 * ! Styling is not made with elementEvents.
*/
const elementEvents = {
  /** Are you allowed to use elementEvents functions. */
  allowInteraction: false,
  /** After a click the element gets selected and saved here. */
  currentElement: null,
  /** After a hovering over an Element, it gets selected and saved here. */
  hoveredElement: null,
  /** The virtual Clipboard saves copied elements as an String. */
  clipboard: null,
  /** The main iframe */
  iframe: null,

  /** Initialize elementEvents.
  * @return this
  */
  init (externals = true) {
    this.cacheDom()
      .bindEvents()
    textEditor.init()
    return this
  },

  /** Initialize everything that requires the iframe to be loaded.
  * @return this
  */
  initAfterFrame (externals = true) {
    this.$iframe = document.getElementById('simulated').contentDocument
    this.bindFrameEvents()
    pageDomTree.build()
    textEditor.initWithFrame(this.$iframe)
    return this
  },

  /** Cache static dom elements.
  * @return this
  */
  cacheDom () {
    this.$close = document.getElementById('closeClick')
    this.$drag = document.getElementById('moveClick')
    this.$itemName = document.getElementById('itemName')
    return this
  },

  /** apply events to static content
  * @return this
  */
  bindEvents () {
    this.$close.addEventListener('mousedown', (e) => { this.noClick() })
    this.$drag.addEventListener('mousedown', (e) => { this.dragStart() })
    return this
  },

  /** apply events to the iframe content and run iframe specific methods
  * @return this
  */
  bindFrameEvents () {
    if (!this.$iframe.hasEvents) {
      this.$iframe.addEventListener('mouseover', this.hover.bind(this), false)
      this.$iframe.addEventListener('mousedown', this.click.bind(this), false)
      this.$iframe.addEventListener('dblclick', this.dblclick.bind(this), false)
      this.$iframe.addEventListener('scroll', this.onScroll.bind(this), true)
      document.body.addEventListener('mouseover', this.noHover.bind(this), false)
      contextMenu.init(this.$iframe)
      keydown.init(this.$iframe)
      this.$iframe.hasEvents = true
    }
    return this
  },

  /** Change gets triggered after the dom has changed.
  * @return this
  */
  change () {
    return this
  },

  /** This is a event and a method.
  * onScroll gets triggered after anything gets scrolled in the iframe.
  * @param {Event} e
  */
  onScroll (e) {
    this.redrawRect()
  },

  /** Is the click event allowed?  */
  allowClick: true,
  /** This is a Event and a method.
  * Click gets triggered after anything gets clicked in the iframe
  * @param {Event} e
  * @return this
  */
  click (e) {
    if (!this.allowClick || !e) {
      return
    }
    e.stopImmediatePropagation()
    this.noHover()
      .showRectAroundElement(e, 'click')
    this.allowInteraction = true
    this.currentElement = e.target
    this.$itemName.innerHTML = e.target.nodeName
    elementEditor.select(e.target)
    return this
  },

  /** Remove any effects from the click event.
  * @return this
  */
  noClick () {
    this.currentElement = null
    this.allowInteraction = false
    this.hideRectAroundElement('click')
    elementEditor.unselect()
    return this
  },

  /** This is a Event.
  * Dblclick gets triggered after anything gets double clicked in the iframe.
  * @param {Event} e
  * @return this
  */
  dblclick (e) {
    e.stopImmediatePropagation()
    if (textEditor.active) {
      this.leaveTexteditorMode()
    } else {
      this.enterTexteditorMode()
    }
  },

  enterTexteditorMode () {
    textEditor.enable()
    this.allowHover = false
    this.noHover()
    this.allowClick = false
    this.noClick()
  },

  leaveTexteditorMode () {
    textEditor.disable()
    this.allowHover = true
    this.allowClick = true
  },

  /** Is the hover event allowed? */
  allowHover: true,
  /** This is a Event and a method.
  * Hover gets triggered after anything gets hovered in the iframe.
  * @param {Event} e
  * @return this
  */
  hover (e) {
    if (e) {
      e.stopImmediatePropagation()
    }
    if (this.allowHover) {
      this.showRectAroundElement(e, 'hover')
    }
    return this
  },

  /** Remove any effects from the hover event.
  * @param {Event} e
  * @return this
  */
  noHover (e) {
    if (e) {
      e.stopImmediatePropagation()
    }
    let ignoreDomTree = document.getElementById('simulatedDomTree')
    if (e && ignoreDomTree.contains(e.target)) {
      return this
    }
    this.hideRectAroundElement('hover')
    return this
  },

  /** Copy a selected element to the virtual and the real clipboard
  * as a Html string.
  * @return this
  */
  copy () {
    if (!this.allowInteraction || !this.currentElement) {
      alert('nothing selected')
      return this
    }

    let value = this.currentElement.outerHTML
    this.clipboard = value

    let $temp = document.createElement('input')
    document.body.appendChild($temp)
    $temp.setAttribute('value', value)
    $temp.setAttribute('style', 'display:none')
    $temp.focus()
    $temp.select()
    document.execCommand('copy')
    $temp.remove()
    return this
  },

  /** Delete a selected element from the iframe.
  * @return this
  */
  delete () {
    if (!this.allowInteraction || !this.currentElement) {
      alert('nothing selected to delete')
      return this
    }
    let parent = this.currentElement.parentNode
    pageDomTree.removeNode(this.currentElement)
    parent.removeChild(this.currentElement)
    this.noClick()
      .change()
    pageDomTree.removeNodeFix(parent)
    return this
  },

  /** copy a selected element and delete it afterwards.
  * @return this
  */
  cut () {
    if (!this.allowInteraction || !this.currentElement) {
      alert('nothing selected to cut')
      return this
    }
    this.copy()
      .delete()
    return this
  },

  /** Appends the virtual clipboard to a specific
  * location ('after', 'in' or 'before' the selected element).
  *  @param {String} appendStyle - how to append the items
  *  @param {String} data - what to appendStyle
  *  @param {String} whereDom - where to append in the dom
  *  @return this
  */
  paste (appendStyle, data, whereDom) {
    let insertHTML = data || this.clipboard
    let insertDom = whereDom || this.currentElement
    appendStyle = appendStyle || 'in'
    if (!insertHTML || !insertDom) {
      alert('no selected element or nothing in clipboard')
      return this
    }
    switch (appendStyle) {
      case 'after':
        insertDom.insertAdjacentHTML('afterend',
          insertHTML)
        break
      case 'before':
        insertDom.insertAdjacentHTML('beforebegin',
          insertHTML)
        break
      case 'in':
        insertDom.innerHTML += insertHTML
        break
    }
    pageDomTree.addNode(appendStyle, insertDom)
    this.change()
    return this
  },

  /** Copies the selected element and appends it as a sibling below itslef.
  * @return this
  */
  duplicate () {
    if (!this.allowInteraction || !this.currentElement) {
      alert('nothing selected to duplicate')
      return this
    }
    let clone = this.currentElement.outerHTML
    this.paste('after', clone)
    return this
  },

  /** Redraw the currently displayed rectangles.
  * @return this
  */
  redrawRect () {
    if (this.currentElement) {
      let event = new MouseEvent('mousedown', {
        view: window,
        bubbles: true,
        cancelable: true
      })
      this.currentElement.dispatchEvent(event)
    }
    if (this.hoveredElement) {
      let event = new MouseEvent('mouseover', {
        view: window,
        bubbles: true,
        cancelable: true
      })
      this.hoveredElement.dispatchEvent(event)
    }
    return this
  },

  /** Display a rectangle around an element.
  * @param {Event} e - the event with taget
  * @param {String} type - click or hover
  * @return this
  */
  showRectAroundElement (e, type) {
    if (!e) {
      return this
    }
    let rect = e.target.getBoundingClientRect()
    let elem = document.getElementsByClassName(type)[0]
    if (elem && rect) {
      elem.setAttribute('style', `
        display: block;
        width:${rect.width}px;
        height:${rect.height}px;
        top:${rect.top}px;
        left:${rect.left}px;
        `)
    }
    return this
  },

  /** Hide the rectangle elements.
  * @param {String} type - click or hover
  * @return this
  */
  hideRectAroundElement (type) {
    let elem = document.getElementsByClassName(type)[0]
    if (elem) {
      elem.setAttribute('style', '')
    }
    return this
  },

  /** The dragged element. */
  draggedElement: null,
  /** How should the dragged element be appended? */
  pasteDraggedAs: null,
  /** Initialize the dragging.
  * @param {String} html - Html as string (not required)
  */
  dragStart (html) {
    if (!this.currentElement && !html) {
      alert('nothing selected to drag')
      return this
    }

    if (html) {
      this.draggedElement = html
    } else {
      let x = this.currentElement.outerHTML // clicked element
      this.draggedElement = x // save element
      this.delete() // remove element from dom
    }

    this.allowHover = false // remove currenthoverEvent
    this.hoveredElement = null
    this.noHover() // "

    this.dragHoverEvent = this.dragHover.bind(this)
    this.$iframe.addEventListener('mousemove', this.dragHoverEvent)

    this.dragEndEvent = this.dragEnd.bind(this)
    this.$iframe.addEventListener('mouseup', this.dragEndEvent)
    document.addEventListener('mouseup', this.dragEndEvent)

    this.allowInteraction = false
    return this
  },

  /** Display the appending possibilities.
  * @param {Event} e - event
  */
  dragHover (e) {
    e.stopImmediatePropagation()
    this.hoveredElement = e.target // hovered item is now in this.hoveredElement
    // get position of mouse in item
    let rect = e.target.getBoundingClientRect()
    let x = (e.pageX - rect.left)
    let y = (e.pageY - rect.top)
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
    let elem = document.getElementsByClassName('hover')[0]
    elem.setAttribute('style', `
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

  /** End the dragging process and remove all events.
  * @param {Event} e - event
  */
  dragEnd (e) {
    // paste  how to append - what to append, where to append
    this.paste(this.pasteDraggedAs, this.draggedElement, this.hoveredElement)
    // remove all not needed events
    this.$iframe.removeEventListener('mousemove', this.dragHoverEvent)
    this.$iframe.removeEventListener('mouseup', this.dragEndEvent)
    document.removeEventListener('mouseup', this.dragEndEvent)
    // reset to previous
    this.allowHover = true
    return this
  }
}
module.exports = elementEvents
