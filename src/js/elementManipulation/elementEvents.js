const elementEditor = require('./elementEditor')
const pageDomTree = require('./pageDomTree')
const textEditor = require('./textEditor')
const keydown = require('../interaction/keydown.js')
const contextMenu = require('../interaction/contextMenu.js')
const history = require('../interaction/history.js')
const idGen = require('../interaction/idGen.js')
const displayMessage = require('../interaction/displayMessage.js')

/** Modify all Iframe Dom elements with elementEvents,
 * also highlight currently hovered and selected elements and save them for further use.
 * ! Styling is not made with elementEvents.
*/
const elementEvents = {
  /** Are you allowed to use elementEvents functions? */
  allowInteraction: false,
  /** After a click the element gets selected and saved here. */
  currentElement: null,
  /** After a hovering over an Element, it gets selected and saved here. */
  hoveredElement: null,
  /** The virtual Clipboard saves copied elements as an String. */
  clipboard: null,
  /** The main iframe */
  $iframe: null,

  /** Initialize elementEvents.
  * @return this
  */
  init (externals = true) {
    this.cacheDom()
    this.bindEvents()
    textEditor.init()
    return this
  },

  /** Initialize everything that requires the iframe to be loaded.
  * @return this
  */
  initAfterFrame (iframe) {
    if (!iframe) return
    this.$iframe = iframe.contentDocument
    this.bindFrameEvents()
    pageDomTree.build(this.$iframe)
    textEditor.initWithFrame(this.$iframe)
    this.change()
    this.noClick()
    this.noHover()
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

  /** Apply events to static content
  * @return this
  */
  bindEvents () {
    this.$close.addEventListener('mousedown', (e) => { this.noClick() })
    this.$drag.addEventListener('mousedown', (e) => { this.dragStart() })
    return this
  },

  /** Apply events to the iframe content and run iframe specific methods
  * @return this
  */
  bindFrameEvents () {
    if (!this.$iframe.hasEvents) {
      this.$iframe.addEventListener('mouseover', this.hover.bind(this), false)
      this.$iframe.addEventListener('mousedown', this.click.bind(this), false)
      this.$iframe.addEventListener('dblclick', this.dblclick.bind(this), false)
      this.$iframe.addEventListener('scroll', this.onScroll.bind(this), true)
      document.body.addEventListener('mouseover', this.noHover.bind(this), false)
      contextMenu.init(this.$iframe, document.getElementsByClassName('header-contextmenu')[0], document)
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

  /** Undo last dom change.
  * @return this
  */
  undo () {
    if (!history.undoPossible) {
      displayMessage.show('Undo not possible', 2000, 'warning', false)
      return this
    }
    history.undo()
  },

  /** Redo last dom change.
  * @return this
  */
  redo () {
    if (!history.redoPossible) {
      displayMessage.show('Redo not possible', 2000, 'warning', false)
      return this
    }
    history.redo()
  },

  /** This is a event and a method.
  * OnScroll gets triggered after anything gets scrolled in the iframe.
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

  textEditorActive: false,
  /** This is a Event.
  * Dblclick gets triggered after anything gets double clicked in the iframe.
  * @param {Event} e
  * @return this
  */
  dblclick (e) {
    if (e) e.stopImmediatePropagation()
    if (textEditor.active) {
      this.textEditorActive = false
      this.leaveTexteditorMode()
    } else {
      this.textEditorActive = true
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
      this.hoveredElement = e.target
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
      displayMessage.show('No element selected to copy', 2000, 'warning', false)
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
  * @param {Boolean} noChange - true if it should not count as dom change
  * @return this
  */
  delete (noChange = false, historyItem) {
    if (historyItem) {
      let historyElem = this.$iframe.querySelector(`[history="${historyItem}"]`)
      if (!historyElem) return
      this.currentElement = historyElem
      this.allowInteraction = true
    }
    if (!this.allowInteraction || !this.currentElement) {
      displayMessage.show('No element selected to delete', 2000, 'warning', false)
      return this
    }
    let parent = this.currentElement.parentNode
    if (!historyItem) this.deleteFHistory(parent)
    pageDomTree.removeNode(this.currentElement)
    parent.removeChild(this.currentElement)
    this.noClick()
    if (!noChange) this.change()
    pageDomTree.removeNodeFix(parent)
    return this
  },

  /** Add delete to History (to undo or redo it)  */
  deleteFHistory () {
    // undo
    let idUndo = idGen.new()
    let idUndoExist = null
    let parent = this.currentElement.parentNode
    let appendStyle = 'in'
    if (parent.children.length > 1) {
      let c = Array.from(parent.children).indexOf(this.currentElement)
      if (c === 0) {
        idUndoExist = this.currentElement.nextElementSibling.getAttribute('history')
        if (!idUndoExist) this.currentElement.nextElementSibling.setAttribute('history', idUndo)
        appendStyle = 'before'
      } else {
        idUndoExist = this.currentElement.previousElementSibling.getAttribute('history')
        if (!idUndoExist) this.currentElement.previousElementSibling.setAttribute('history', idUndo)
        appendStyle = 'after'
      }
    } else {
      idUndoExist = parent.getAttribute('history')
      if (!idUndoExist) parent.setAttribute('history', idUndo)
    }
    idUndo = idUndoExist || idUndo

    // redo
    let idRedo = idGen.new()
    let idRedoExists = this.currentElement.getAttribute('history')
    if (!idRedoExists) {
      this.currentElement.setAttribute('history', idRedo)
    } else {
      idRedo = idRedoExists
    }

    history.add({
      done: this.delete,
      doneArgs: [false, idRedo],
      undo: this.paste,
      undoArgs: [appendStyle, this.currentElement.outerHTML, null, false, idUndo],
      _this: this
    })
  },

  /** copy a selected element and delete it afterwards.
  /** Copy a selected element and delete it afterwards.
  * @return this
  */
  cut () {
    if (!this.allowInteraction || !this.currentElement) {
      displayMessage.show('No element selected to cut', 2000, 'warning', false)
      return this
    }
    this.copy()
      .delete(true)
    this.change()
    return this
  },

  /** Appends the virtual clipboard to a specific
  * location ('after', 'in' or 'before') an selected element.
  *  @param {String} appendStyle - how to append the items
  *  @param {String} data - what to append
  *  @param {String} whereDom - where to append in the dom
    * @param {Boolean} noChange - true if it should not count as dom change
  *  @return this
  */
  paste (appendStyle, data, whereDom, noChange = false, historyItem) {
    if (historyItem) {
      let historyElem = this.$iframe.querySelector(`[history="${historyItem}"]`)
      if (!historyElem) return
      this.currentElement = historyElem
    }
    let insertHTML = data || this.clipboard
    let insertDom = whereDom || this.currentElement
    appendStyle = appendStyle || 'in'
    if (!insertHTML || !insertDom) {
      displayMessage.show('No element selected to paste or your clipboard is empty', 2500, 'warning', false)
      return this
    }
    let newElement = null
    switch (appendStyle) {
      case 'after':
        insertDom.insertAdjacentHTML('afterend',
          insertHTML)
        newElement = insertDom.nextSibling
        break
      case 'before':
        insertDom.insertAdjacentHTML('beforebegin',
          insertHTML)
        newElement = insertDom.previousSibling
        break
      case 'in':
        insertDom.innerHTML += insertHTML
        newElement = insertDom.children[insertDom.children.length - 1]
        break
    }
    pageDomTree.addNode(appendStyle, insertDom)
    if (!historyItem) this.pasteFHistory(appendStyle, insertHTML, insertDom, newElement)
    if (!noChange) this.change()
    return this
  },

  /** Add paste to History (to undo or redo it)
  *  @param {String} appendStyle - how to append the items
  *  @param {String} insertHTML - what to append
  *  @param {String} insertDom - current element
    * @param {Boolean} newElement - new created element
  */
  pasteFHistory (appendStyle, insertHTML, insertDom, newElement) {
    // undo
    let idUndo = idGen.new()
    let idUndoExists = newElement.getAttribute('history')
    if (!idUndoExists) {
      newElement.setAttribute('history', idUndo)
    } else {
      idUndo = idUndoExists
    }

    // redo
    let idRedo = idGen.new()
    let idRedoExists = insertDom.getAttribute('history')
    if (!idRedoExists) {
      insertDom.setAttribute('history', idRedo)
    } else {
      idRedo = idRedoExists
    }

    history.add({
      done: this.paste,
      doneArgs: [appendStyle, insertHTML, null, false, idRedo],
      undo: this.delete,
      undoArgs: [false, idUndo],
      _this: this
    })
  },

  /** Copies the selected element and appends it as a sibling below itslef.
  /** Copies the selected element and append it as a sibling below itself.
  * @return this
  */
  duplicate () {
    if (!this.allowInteraction || !this.currentElement) {
      displayMessage.show('No element selected to duplicate', 2000, 'warning', false)
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
      let e = {}
      e.target = this.currentElement
      this.showRectAroundElement(e, 'click')
    }
    if (this.hoveredElement) {
      let e = {}
      e.target = this.hoveredElement
      this.showRectAroundElement(e, 'hover')
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
      displayMessage.show('No element selected to drag', 2000, 'warning', false)
      return this
    }

    if (html) {
      this.draggedElement = html
    } else {
      let x = this.currentElement.outerHTML // clicked element
      this.draggedElement = x // save element
      this.delete(true) // remove element from dom
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
