/* global MouseEvent */

/** Create a Html tree out of a Html elements. */
const pageDomTree = {
  /**
  * The current Domtree state.
  * @typedef  {Object} treeData
  * @property {String} html - html to append
  * @property {HTMLElement[]} ids -  all iframe dom Elements
  * @property {Number} counter - id counter
  * @example {
  *   html: '',
  *   ids: [],
  *   counter: 0
  */
  treeData: null,
  /** Are the domTree Events initialized?  */
  hasEvents: false,

  /** Reset the current domTree and build a new.
  * @param {HTMLElement} iframe - Build domTree out of this Element
  * @param {HTMLElement} domTree - Element to display the domTree
  */
  build (iframe, domTree) {
    this.$iframe = iframe
    this.$domTree = domTree || document.getElementById('simulatedDomTree')
    if (!this.$iframe || !this.$domTree) return false

    this.reset()
      .createTree(this.$iframe.body)
      .$domTree.innerHTML = this.treeData.html

    this.bindEvents()
  },

  /** Add Domtree Events */
  bindEvents () {
    if (!this.hasEvents) {
      this.addOpenCloseEvents()
        .addRelationEvents()
        .addReloadEvent()
      this.hasEvents = true
    }
  },

  /** Resets the domTree to the default state.
  * @return this
  */
  reset () {
    this.treeData = {html: '', ids: [], counter: 0}
    this.$domTree.innerHTML = ''
    return this
  },

  /** Remove a domTree node.
   * @param {HTMLElement} element - an iframe element
   */
  removeNode (element) {
    let id = 'tree-' + element.domTree
    let elem = document.getElementById(id)
    if (elem) {
      elem.parentNode.removeChild(elem)
    } else { // hard reset
      this.build()
    }
  },

  /** Change ul to li if the node is now empty.
   * @param {HTMLElement} element - an iframe element
   */
  removeNodeFix (parent) {
    if (parent.children.length === 0) {
      let id = 'tree-' + parent.domTree
      let elem = document.getElementById(id)
      this.treeData.html = ''
      this.createTree(this.wrapElement(parent))
      elem.outerHTML = this.treeData.html
      this.unwrapElement(parent)
    }
  },

  /** Add a new node to the domTree.
   * @param {String} appendStyle - append style (after, before, in)
   * @param {HTMLElement} element - an iframe element
   */
  addNode (appendStyle, element) {
    if (!element.domTree) {
      this.build()
    }
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

  /** Thanks to http://codeblog.cz/vanilla/around.html#wrap.
   * Wrap element into a div.
   * @param {HTMLElement} element - the element to wrap
   * @return wrapped element
   */
  wrapElement (element, elem = 'div') {
    var wrapper = document.createElement(elem)
    element.before(wrapper)
    wrapper.append(element)
    return wrapper
  },

  /** Thanks to http://codeblog.cz/vanilla/around.html#unwrap.
   * Unwrap a wrapped element.
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
  * CreateTree is using the whole treeData object.
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
  * Add click and mouseover events to appended dom items.
  * @return this
  */
  addRelationEvents () {
    this.$domTree.addEventListener('mousedown', this.addRelationClickEvents.bind(this), false)
    this.$domTree.addEventListener('mouseover', this.addRelationHoverEvents.bind(this), false)
    this.$iframe.body.addEventListener('mousedown', this.domTreeScrollToElement.bind(this), false)

    return this
  },

  /** This is an Event.
  * If an element in the domTree gets hovered, hover over the same element in the iframe.
  */
  addRelationHoverEvents (e) {
    if (e.isTrusted) {
      let el = e.target.closest('li, ul')
      if (el) {
        let event = new MouseEvent('mouseover', {
          view: window,
          bubbles: true,
          cancelable: true
        })
        this.treeData.ids[el.getAttribute('id').split('-')[1]].dispatchEvent(event)
      }
    }
  },

  /** This is an Event.
  * If an element in the domTree gets clicked, click the same element in the iframe.
  */
  addRelationClickEvents (e) {
    if (e.isTrusted) {
      let el = e.target.closest('li, ul')
      if (el) {
        let event = new MouseEvent('mousedown', {
          view: window,
          bubbles: true,
          cancelable: true
        })
        this.treeData.ids[el.getAttribute('id').split('-')[1]].dispatchEvent(event)
        this.iframeScrollToElement(this.treeData.ids[el.getAttribute('id').split('-')[1]])
      }
    }
  },

  allowScrollToElement: true,
  toggleAllowScrollToElement () {
    this.allowScrollToElement = !this.allowScrollToElement
  },

  /** Scroll to the clicked element.
  * @param {HTMLElement} elem - element to sctoll to.
  */
  iframeScrollToElement (elem) {
    if (this.allowScrollToElement) {
      if (elem.scrollIntoViewIfNeeded) {
        elem.scrollIntoViewIfNeeded()
      } else {
        elem.scrollIntoView()
      }
    }
  },

  /** Open all ul parent elements of the dom tree item and scroll to it.
  * @param {Event} e
  */
  domTreeScrollToElement (e) {
    if (e.isTrusted && this.allowScrollToElement) {
      let elem = document.getElementById('tree-' + e.target.domTree)
      let parent = elem
      while (parent.nodeName !== 'DIV') {
        if (parent.nodeName === 'UL' && !parent.classList.contains('active')) {
          parent.classList.add('active')
        }
        parent = parent.parentNode
      }
      let offsetTop = 20
      this.$domTree.scrollTop = elem.getBoundingClientRect().top - this.$domTree.getBoundingClientRect().top + this.$domTree.scrollTop - offsetTop
    }
  },

  /** Add caret icons for better navigation.
  * All ul items can be expanded with a click.
  * @return this
  */
  addOpenCloseEvents () {
    this.$domTree.removeEventListener('mousedown', this.addOpenCloseEvent)
    this.$domTree.addEventListener('mousedown', this.addOpenCloseEvent)
    return this
  },

  /** This is an Event.
  * Show or hide elements with the class 'hidden', it also hides all children elements.
  * The 'fa' is for the fontawesome icons, which display the current state of the element.
  */
  addOpenCloseEvent (e) {
    let el = e.target.closest('p, i')
    if (el) {
      let ul = el.parentNode
      ul.classList.toggle('active')
    }
  },

  /** Reload whole domtree on click.  */
  addReloadEvent () {
    document.getElementById('domTree-Reload')
      .addEventListener('mousedown', () => {
        this.build()
      })
  }
}
module.exports = pageDomTree
