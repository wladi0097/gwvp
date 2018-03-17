const idGen = require('../interaction/idGen')
const newElementsHTML = require('./newElementsHTML')

/** A JSON can be used to add new dom elements to the current project.
 * Examples can be found in the packages folder.
 * Its called a package and looks like this:
 * @typedef  {Object} elementPackage
 * @property {String} name - the shown name of the package
 * @property {String} description -  a simple description about the content
 * @property {String} icon - URL to a image which represents the package
 * @property {dependencyObject[]} cssDependency - css Dependency Object
 * @property {dependencyObject[]} jsDependency - js Dependency Object
 * @property {String} css - custom used CSS
 * @property {String} js - custom used js
 * @property {packageItems[]} content - all html items
 *
 * @example {
 * "name": "example",
 * "description": "simple description",
 * "icon": "http://example.com/image.jpg",
 * "cssDependency": [{"name":"google", "url": "www.google.com"}],
 * "jsDependency": [{"name":"bootstrap", "url": "www.google.com"}],
 * "content": [{
 *   "name": "Layout",
 *   "items": [
 *     {
 *       "name": "Container",
 *       "icon": "",
 *       "description": "",
 *       "html": "<div></div>"
 *     },
 *     {
 *       "name": "Colum",
 *       "icon": ""
 *     }
 *   ]}],
 * "css": "*{display:none}",
 * "js": "console.log('OH BOI')"
 *}
 */

/**
  * @typedef  {Object} dependencyObject
  * @property {String} name - short name of the dependency
  * @property {String} url - full url to the dependency
  */

/** @typedef {Object} packageCategory
  * @property {String} name - name of the category
  * @property {packageItems[]} items - the html items
  */

/** @typedef {Object} packageItems
  * @property {String} name - name of the html item
  * @property {String} icon - url image of the item
  * @property {String} description - short description for the item
  * @property {String} html - html code
  */

/** Add CSS, JS and HTML to the iframe via element packages.
 * and manage html dom items.
 */
const packageManager = {
  packages: [],
  currentItems: [],

  init () {
    this.bindEvents()
    this.addAll()
  },

  addAll () {
    this.add(require('./packages/basicItems'))
  },

  /** Add the package to html and the package array.
   * @param {elementPackage} elementPackage - a packages object with all data
   */
  add (elementPackage) {
    this.handOutIds(elementPackage)
    this.packages.push(elementPackage)
    newElementsHTML.addPackage(elementPackage)
    this.updateCurrentItems()
  },

  /** Giveout Ids for each package and its items.
   * @param {elementPackage} elementPackage - a packages object with all data
   */
  handOutIds (elementPackage) {
    elementPackage.id = idGen.new()
    elementPackage.content.forEach(category => {
      category.items.forEach(item => {
        item.id = idGen.new()
      })
    })
  },

  /** Add all elements into currentItems for easier search.  */
  updateCurrentItems () {
    this.currentItems = []
    this.packages.forEach(pack => {
      pack.content.forEach(cont => {
        cont.items.forEach(item => {
          this.currentItems.push(item)
        })
      })
    })
  },

  /** Return searched element by id.
   * @param {String} id - id of element
   */
  getElementById (id) {
    return this.currentItems.find(item => {
      return (item.id === id)
    })
  },

  /** Find items by name.
   * @param {String} string - regex string to find
   * @return {[packageItems]}
   */
  find (string) {
    return this.currentItems.filter(item => {
      if (item.name.match(new RegExp(string, 'i')) ||
          item.description.match(new RegExp(string, 'i'))) {
        return true
      }
    })
  },

  /** Create a big addEventListener and watch the clicked items,
   * because of that there is no need to bind multiple events after changes.
   * The sequence is very important, it goes from the smallest to the biggest
   * element and breks the chain if anything got found
   */
  bindEvents () {
    let all = document.getElementById('newPackages')
    all.addEventListener('mousedown', (e) => {
      // is the help icon clicked
      let help = e.target.closest('.help-icon')
      if (help) return

      // is a single item clicked
      let item = e.target.closest('.html-element')
      if (item) return

      // is a category item clicked
      let itemCategory = e.target.closest('.sidebar-visible-header')
      if (itemCategory) {
        itemCategory.classList.toggle('active')
        return
      }

      // is anything inside the packae clicked
      let contentContainer = e.target.closest('.new-elements-content')
      if (contentContainer) { return }

      // is package clicked
      let elementPackage = e.target.closest('.new-elements-item')
      if (elementPackage) {
        elementPackage.classList.toggle('active')
      }
    })
  }
}

module.exports = packageManager
