const basicElementItems = require('./packages/basicItems')
const idGen = require('../interaction/idGen')
const onlineElementPackages = require('./onlineElementPackages')
const addToUsingElementPackages = require('./addToUsingElementPackages')

/** A JSON can be used to add new dom elements to the current project.
 * Examples can be found in the packages folder.
 * Its called a package and looks like this:
 * @typedef  {Object} packages
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

/** Add CSS, JS and HTML to the iframe via element packages
 * and manage html dom items.
 */
const elementItems = {
  /** requires elementEvents to drag elements from elementEvents.js  */
  elementEvents: null,

  /** Initialize onlineElementPackages and addToUsingElementPackages also
   * bind events.
   * @param {Object} elementEvents - the elementEvents to drag elements
   */
  init (elementEvents) {
    this.elementEvents = elementEvents
    this.bindUsingEvents()
    this.bindAddToEvents()
    this.addBasicPackage()
    onlineElementPackages.init(this)
    addToUsingElementPackages.init(this)
  },

  /** Add the basic HTML package  */
  addBasicPackage () {
    basicElementItems.id = idGen.new()
    elementItemsHTML.addUsingPackage(basicElementItems)
  },

  /** Create a big addEventListener and watch the clicked items,
   * because of that there is no need to bind multiple events after changes.
   * The sequence is very important, it goes from the smallest to the biggest
   * element and breks the chain if anything got found
   */
  bindUsingEvents () {
    let all = document.getElementById('newElementsUsing')
    all.addEventListener('mousedown', (e) => {
      // is a single item clicked
      let item = e.target.closest('.html-element')
      if (item) {
        this.dragStart(item)
        return
      }

      // is a category item clicked
      let itemCategory = e.target.closest('.sidebar-visible-header')
      if (itemCategory) {
        this.toggleCategoryVisibility(itemCategory)
        return
      }

      // is anything inside the packae clicked
      let contentContainer = e.target.closest('.newElements-content')
      if (contentContainer) { return }

      // is package clicked
      let elementPackage = e.target.closest('.newElements-item')
      if (elementPackage) {
        this.showPackageDom(elementPackage)
      }
    })
  },

  /** A Index Table for Packages for faster search  */
  packagedIndexTable: [],
  /** all unused packages are stored here */
  packages: [],
  /** add a package to the packagedIndexTable and the packages arrays or inserts
   * it directly to the "using" dom element
   * @param {String} position - either using, official or online
   * @param {packages} elementPackage - a packages object with all data
   */
  addPackage (position, elementPackage) {
    elementPackage.id = idGen.new()
    if (position === 'using') {
      elementItemsHTML.addUsingPackage(elementPackage)
    } else {
      this.packages.push(elementPackage)
      this.packagedIndexTable.push(elementPackage.id)
      elementItemsHTML.addEmptyPackage(position, elementPackage)
    }
  },

  /** show the content of a package
  * @param {HTMLElement} $domPackage - the element to toggle
  */
  showPackageDom ($domPackage) {
    if ($domPackage.classList.contains('active')) {
      $domPackage.classList.remove('active')
    } else {
      this.hidePackageDom()
      $domPackage.classList.add('active')
    }
  },

  /** hide the content of a package */
  hidePackageDom () {
    Array.from(document.getElementsByClassName('newElements-item'))
      .forEach((element) => {
        if (element.classList.contains('active')) {
          element.classList.remove('active')
        }
      })
  },

  /** Hide or show the categories of a package
  * @param {HTMLElement} $category - the element to toggle
  */
  toggleCategoryVisibility ($category) {
    $category.classList.toggle('active')
  },

  /** run the drag function from elementEvents with the HTML of the clicked element  */
  dragStart (target) {
    let html = unescape(target.getAttribute('html'))
    this.elementEvents.dragStart(html)
  },

  /** Fire if a package from official or online gets clicked   */
  bindAddToEvents () {
    [document.getElementById('newElementsOfficial'),
      document.getElementById('newElementsOnline')].forEach((element) => {
      element.addEventListener('mousedown', (e) => {
        let elementPackage = e.target.closest('.newElements-item')
        if (elementPackage) {
          this.showAddToUsingWindow(elementPackage)
        }
      })
    })
  },

  /** cache of the currently clicked package  */
  currentlyWatchedPackageIndex: null,
  /** Show a custom window where the user can see all details about the package
   * @param {packages} elementPackage - a package
   */
  showAddToUsingWindow (elementPackage) {
    // get the already added package from the packages array
    let index = this.packagedIndexTable.indexOf(elementPackage.getAttribute('id'))
    if (index >= 0) {
      let fullPackage = this.packages[index]
      this.currentlyWatchedPackageIndex = index
      addToUsingElementPackages.show(fullPackage)
    }
  },

  /** get the ItemCategories HTML for a package
   * @param {packages} elementPackage - a package
   * @return {String} HTMl
   */
  getItemCategories (elementPackage) {
    return elementItemsHTML.templateItemCategories(elementPackage.id, elementPackage.content, false)
  },

  /** accept tha package and move it to using   */
  movePackageToUsing () {
    let data = this.packages[this.currentlyWatchedPackageIndex]
    let element = document.getElementById(data.id)
    elementItemsHTML.addUsingPackage(data, element)
  }
}
module.exports = elementItems

/** shift HTML creation from logic */
const elementItemsHTML = {
  $using: document.getElementById('newElementsUsing'),
  $official: document.getElementById('newElementsOfficial'),
  $online: document.getElementById('newElementsOnline'),

  /** Create an HTML Block with a single Package,
   * @param {String} id - a unique string sequence
   * @param {String} name - name of the package
   * @param {String} img - URL to a image of the package
   * @return {String} completed html
   */
  templatePackage (id, name, img) {
    return `
    <div class="newElements-item" id=${id}>
      <div class="img">
        <img src="${img}" alt="image of ${name}">
      </div>
      <p>${name}</p>
    </div>
    `
  },

  /** Create an HTML Block with all Categories and their items,
   * which can be used to add dom element to the current page
   * @param {String} id - a unique string sequence
   * @param {packages} data - a package
   * @param {Boolean} hidden - should it be hidden by default
   * @return {String} completed html
   */
  templateItemCategories (id, data, hidden = true) {
    let html = `<div class="newElements-content  ${(hidden) ? '' : 'active'}" id="content-${id}">`
    for (var i = 0; i < data.length; i++) {
      html += `
      <div class="sidebar-header sidebar-element">
        <div class="sidebar-visible-header">
          <i class="fa fa-caret-down" aria-hidden="true"></i>
          <p>${data[i].name}</p>
        </div>
        <div class="items hidden">`
      let items = data[i].items
      for (var k = 0; k < items.length; k++) {
        html += `
        <div class="item html-element" html=${escape(items[k].html)}>
          <p class="helpIcon">?</p>
          <div class="img">
            <img src="${items[k].icon}" alt="${items[k].name}">
          </div>
          <p class="name">${items[k].name}</p>
          <div class="helpText">
            <p>${items[k].description}</p>
            <button>Close</button>
          </div>
        </div>`
      }
      html += ` </div>
        </div>`
    }
    return html
  },

  /** Add or move a using package to the dom.
   * @param {packages} data - a package
   * @param {HTMLElement} existing - html which should be replaced
   */
  addUsingPackage (data, existing) {
    if (existing) {
      let old = existing.outerHTML
      this.addUsingContainer(old)
      existing.parentNode.removeChild(existing)
    } else {
      this.addUsingContainer(this.templatePackage(data.id, data.name, data.icon))
    }
    document.getElementById(data.id).innerHTML +=
      this.templateItemCategories(data.id, data.content)
  },

  /** For styling reasons only 3 packages are stored in one div.
   * This Method is to check how full the current div is
   * and to append the package to the right one.
   * @param {String} htmlData - raw html
   */
  addUsingContainer (htmlData) {
    let children = this.$using.children
    if (children.length === 0) {
      this.$using.innerHTML += `
      <div class="container-for-3">${htmlData}</div>
      `
      return
    }
    let usingElements = children[children.length - 1]
    if (usingElements.children.length < 3) {
      usingElements.innerHTML += htmlData
    } else {
      this.$using.innerHTML += `
      <div class="container-for-3">${htmlData}</div>
      `
    }
  },

  /** add a official or online package without implementation to the DOM
   * @param {String} position - either official or online
   * @param {packages} data - a package
   */
  addEmptyPackage (position, data) {
    let destination = (data === 'official') ? this.$official : this.$online
    destination.innerHTML +=
      this.templatePackage(data.id, data.name, data.icon)
  }
}
