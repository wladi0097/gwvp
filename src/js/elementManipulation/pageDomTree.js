/* global MouseEvent */
/** show full page dom
  * building the tree almost takes no time,
  * because of that it gets rebuild after every action
  * It is standalone and can be used in other projects.
*/
const pageDomTree = {
  /**
  * @example {
  *   html: '',
  *   ids: [],
  *   counter: 0
  *}
  * {String} treeData.html - html to append
  * {HTMLElement[]} treeData.ids - all iframe dom Elements
  * {Number} treeData.counter - id counter
  */
  treeData: null,
  /**
   * true if events are attached
  */
  hasEvents: false,

  /** build whole tree with reset
  @param {HTMLElement} iframe - build domtree of that
  @param {HTMLElement} domTree - place domTree there
  */
  build (iframe, domTree) {
    this.$iframe = iframe || document.getElementById('simulated').contentDocument.body
    this.$domTree = domTree || document.getElementById('simulatedDomTree')
    this.treeData = {html: '', ids: [], counter: 0}

    if (!this.$iframe && !this.$domTree) {
      return false
    }

    this.reset()
      .createTree(this.$iframe)
      .$domTree.innerHTML = this.treeData.html

    if (!this.hasEvents) { // add events if not exist
      this.addOpenCloseEvents()
        .addRelationEvents()
        .addReloadEvent()
      this.hasEvents = true
    }
  },

  /** reset to default state
  * @return this
  */
  reset () {
    this.$domTree.innerHTML = ''
    return this
  },

  /** remove a DomTree Node
   * @param {HTMLElement} element - an iframe element
   */
  removeNode (element) {
    let id = 'tree-' + element.domTree
    let elem = document.getElementById(id)
    elem.parentNode.removeChild(elem)
  },

  /** change ul to li if the node is now empty
   * @param {HTMLElement} element - an iframe element
   */
  removeNodeFix (parent) {
    if (parent.children.length === 0) { // empty
      let id = 'tree-' + parent.domTree
      let elem = document.getElementById(id)

      this.treeData.html = ''
      this.createTree(this.wrapElement(parent))
      elem.outerHTML = this.treeData.html
      this.unwrapElement(parent)
    }
  },

  /** add a new Node to the DomTree
   * @param {String} appendStyle - how to append (after, before, in)
   * @param {HTMLElement} element - an iframe element
   */
  addNode (appendStyle, element) {
    this.treeData.html = ''
    let id = 'tree-' + element.domTree
    let elem = document.getElementById(id)
    let finalElement = null
    switch (appendStyle) {
      case 'after':
        finalElement = element.nextSibling
        this.createTree(this.wrapElement(finalElement))
        elem.insertAdjacentHTML('afterend',
          this.treeData.html)
        this.unwrapElement(finalElement)
        break
      case 'before':
        finalElement = element.previousSibling
        this.createTree(this.wrapElement(finalElement))
        elem.insertAdjacentHTML('beforebegin',
          this.treeData.html)
        this.unwrapElement(finalElement)
        break
      case 'in':
        this.createTree(this.wrapElement(element))
        elem.outerHTML = this.treeData.html
        this.unwrapElement(element)
        break
    }
    return this
  },

  /** Thanks to http://codeblog.cz/vanilla/around.html#wrap
   * wrap element into a div
   * @param {HTMLElement} element - the element to wrap
   * @return wrapped element
   */
  wrapElement (element, elem = 'div') {
    var wrapper = document.createElement(elem)
    element.before(wrapper)
    wrapper.append(element)
    return wrapper
  },

  /** Thanks to http://codeblog.cz/vanilla/around.html#unwrap
   * unwrap a wrapped element
   * @param {HTMLElement} element - the element to unwrap
   */
  unwrapElement (element) {
    var wrapper = element.parentElement
    while (wrapper.firstChild) {
      wrapper.before(wrapper.firstChild)
    }
    wrapper.remove()
  },

  /** Create a dom tree with a recursive function.
  * Append html after done = ~ 5ms.
  * Append each element itself = ~ 300ms.
  * This is using the whole treeData object, please check it out before
  * reading the following.
  * @param {HTMLElement} node - html node
  * @return this
  */
  createTree (node) {
    let children = node.children
    for (var i = 0; i < children.length; i++) {
      if (children[i].children.length > 0) {
        this.treeData.ids.push(children[i])
        children[i].domTree = this.treeData.counter
        this.treeData.html += `<ul class="tree-item" id="tree-${this.treeData.counter++}">
          <i class="fa fa-caret-right" aria-hidden="true"></i>
          <p>${children[i].nodeName}
           <span class="classes">${children[i].getAttribute('class') || ''}</span>
          </p>`
        this.createTree(children[i])
        this.treeData.html += `</ul>`
      } else {
        this.treeData.ids.push(children[i])
        children[i].domTree = this.treeData.counter
        this.treeData.html += `<li class="tree-item" id="tree-${this.treeData.counter++}">
        <i class="fa fa-angle-right" aria-hidden="true"></i>
        ${children[i].nodeName}
        <span class="classes">${children[i].getAttribute('class') || ''}</span>
        </li>`
      }
    }
    return this
  },

  /**
  * add click and mouseover events to appended dom items
  * @return this
  */
  addRelationEvents () {
    this.$domTree.removeEventListener('mousedown', this.addRelationClickEvents)
    this.$domTree.addEventListener('mousedown', this.addRelationClickEvents.bind(this), false)
    // --
    this.$domTree.removeEventListener('mouseover', this.addRelationHoverEvents)
    this.$domTree.addEventListener('mouseover', this.addRelationHoverEvents.bind(this), false)
    return this
  },

  /** This is an Event.
  * If an element in the domTree gets hovered, hover over the same element in the iframe
  */
  addRelationHoverEvents (e) {
    let el = e.target.closest('li, ul')
    if (el) {
      let event = new MouseEvent('mouseover', {
        view: window,
        bubbles: true,
        cancelable: true
      })
      this.treeData.ids[el.getAttribute('id').split('-')[1]].dispatchEvent(event)
    }
  },

  /** This is an Event.
  * If an element in the domTree gets clicked, click over the same element in the iframe
  */
  addRelationClickEvents (e) {
    let el = e.target.closest('li, ul')
    if (el) {
      let event = new MouseEvent('mousedown', {
        view: window,
        bubbles: true,
        cancelable: true
      })
      this.treeData.ids[el.getAttribute('id').split('-')[1]].dispatchEvent(event)
    }
  },

  /** add caret icons for better navigation
  * all ul items can be expanded with a click
  * @return this
  */
  addOpenCloseEvents () {
    this.$domTree.removeEventListener('mousedown', this.addOpenCloseEvent)
    this.$domTree.addEventListener('mousedown', this.addOpenCloseEvent)
    return this
  },

  /** This is a Event.
  * Show or hide elements with the class 'hidden', it also hides all children elements.
  * The 'fa' is for the fontawesome icons, which display the current state of the element
  */
  addOpenCloseEvent (e) {
    let el = e.target.closest('p, i')
    if (el) {
      let ul = el.parentNode
      if (ul.classList.contains('active')) {
        ul.classList.remove('active')
      } else {
        ul.classList.add('active')
      }
    }
  },

  /** reload whole domtree on click  */
  addReloadEvent () {
    document.getElementById('domTree-Reload')
      .addEventListener('mousedown', () => {
        this.build()
      })
  }
}
module.exports = pageDomTree
