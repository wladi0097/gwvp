const packageManager = require('./packageManager')
const elementEvents = require('../elementManipulation/elementEvents.js')
const newElementsHTML = require('./newElementsHTML')

/** Drag and drop elements into to the iframe.
  * The elements can be single files or packed into Packages
  */
const elementItems = {
  /** Initialize elementItems. */
  init () {
    this.cacheDom()
    this.bindEvents()
    packageManager.init()
  },

  /** Cache static dom elements.  */
  cacheDom () {
    this.$newElements = document.getElementById('newElements')
    this.$description = document.getElementById('newElementsDescription')
    this.$descriptionClose = document.getElementById('newElementsDescriptionClose')
    this.$descriptionName = document.getElementById('newElementsDescriptionName')
    this.$descriptionContent = document.getElementById('newElementsDescriptionContent')
    this.$search = document.getElementById('elementSearch')
  },

  /** Apply events to static content  */
  bindEvents () {
    this.$newElements.addEventListener('mousedown', (e) => {
      let describe = e.target.closest('.help-icon')
      if (describe) {
        this.showDescription(describe)
        return
      }

      let item = e.target.closest('.html-element')
      if (item) this.dragStart(item)
    })

    this.$descriptionClose.addEventListener('mousedown', () => {
      this.$description.classList.remove('active')
    })

    this.$search.addEventListener('keyup', this.search.bind(this))
  },

  /** Search and find elements by name / html and display them.
   * @param {Event} e
   */
  search (e) {
    let val = e.currentTarget.value
    if (val === '') {
      newElementsHTML.hideSearch()
    } else {
      let found = packageManager.find(val)
      newElementsHTML.displaySearch(found)
    }
  },

  /** run the drag function from elementEvents with the HTML of the clicked element
   * @param {HtmlElement} target
   */
  dragStart (target) {
    let item = packageManager.getElementById(target.getAttribute('item-id'))
    let html = item.html
    if (html) {
      elementEvents.dragStart(html)
    }
  },

  /** display description of the clicked item
   * @param {HtmlElement} element
   */
  showDescription (element) {
    let id = element.parentNode.getAttribute('item-id')
    let item = packageManager.getElementById(id)
    if (!this.$description.classList.contains('active')) {
      this.$description.classList.add('active')
    }
    this.$descriptionName.innerHTML = item.name
    let description = item.description || 'no description'
    this.$descriptionContent.innerHTML = description
  }
}
module.exports = elementItems
