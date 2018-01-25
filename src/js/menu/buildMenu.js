const idGen = require('../interaction/idGen')
const menuItems = require('./menuItems')

/** build the whole menu and add events (click keydown) for every item.
* All functionality has to be parsed into build and then you can acces them over the menu.
* Initialize the menuItems.
*/
module.exports.build = function () {
  window.check = buildMenu.checkItemStates.bind(buildMenu)

  menuItems().forEach((menuItem) => {
    buildMenu.includeMenuItemStart(menuItem)
    menuItem.items.forEach((item) => {
      buildMenu.includeMenuComponent(item)
    })
    buildMenu.includeMenuItemEnd()
  })

  buildMenu.append()
  buildMenu.addAllEvents()
}

module.exports.getKeyCodes = function () {
  return buildMenu.keycodes
}

/** Creates a html menu item and binds click and keydown events
 * to the new items. The items can be modified in menuItems.js
 * and the events can be found in eventList.js.
 * The contextmenu is a menu item and can be found in menuItems.js.
 */
const buildMenu = {
  /** The final html to append. */
  html: '',
  keycodes: [],
  /** Position of the final Html */
  $headerItems: document.getElementsByClassName('header-items')[0],

  /** Add events to the already build menu.  */
  addAllEvents () {
    this.addClickEvents()
    this.addHoverEvents()
    this.checkItemStates()
  },

  /** Append the final result into the $headerItems. */
  append () {
    this.$headerItems.innerHTML = this.html
  },

  /** The start of the menu Html.
  * @param {Object} item - a menuItems item
  * @param {String} item.id - the id of the menuItem
  * @param {String} item.name - the name of the menuItem
  */
  includeMenuItemStart (item) {
    item.id = (item.id) ? 'header-' + item.id : ''
    this.html += `<div class="header-item ${item.id}">
      <p>${item.name}</p>
      <div class="header-item-options">
      <ul>`
  },

  /** Close all Tags for the Html menu. */
  includeMenuItemEnd () {
    this.html += `
        </ul>
      </div>
    </div>
    `
  },

  /** Builds the html and includes events (click and keydown) .
  * @param {Object} item - a menuItems item
  */
  includeMenuComponent (item) {
    item.id = item.id || idGen.new()
    this.includeMenuComponentHTML(item) // include html
    this.includeMenuComponentClick(item) // include click event
    this.includeMenuComponentKeycode(item) // include keydown event
    this.includeMenuComponentState(item)
  },

  /** Builds Html the fastest way by
  * pushing all into a html and appending the result.
  * @param {Object} item - a menuItems item
  * @param {String} item.name - the name of the menuItem
  * @param {String} item.keycode - the keycode of the menuItem
  * @param {String} item.delimiter - is the item a delmiter
  * @param {String} item.underItems - the underitems with the same structure as the item
  * @param {String} item.icon - a fontawesome icon
  * @param {String} item.href - if item is a anchor use this href
  */
  includeMenuComponentHTML (item) {
    item.icon = (item.icon) ? 'fa-' + item.icon : '' // is there a icon ?
    item.keycode = (item.keycode) ? item.keycode : '' // is there a keycode ?
    // is delimiter
    if (item.delimiter) {
      this.html += `<li class="option-delimiter"></li>`
    // is underitem
    } else if (item.underItems) {
      this.html += `
      <li class="option-item">
      <i class="fa ${item.icon}" aria-hidden="true"></i>
      <p>${item.text}</p>
      <p class="shortcut">
      <i class="fa fa-caret-right" aria-hidden="true"></i>
      </p>
      <ul class="option-underitem">`
      item.underItems.forEach((underitem) => {
        this.includeMenuComponent(underitem)
      })
      this.html += `
        </ul>
      </li>`
    // is default
    } else {
      this.html += `
      <li class="option-item" id="${item.id}">
        <i class="fa ${item.icon}" aria-hidden="true"></i>
        ${(item.href) ? `<a href="${item.href}">` : ''}
        <p>${item.text}</p>
        <p class="shortcut">${item.keycode}</p>
        ${(item.href) ? `</a>` : ''}
      </li>`
    }
  },

  /** A reference which id has which event. */
  clickEvents: {
    clickId: [],
    clickRun: []
  },

  /** Save the item into clickEvents for later use.
  * @param {Object} item - a menuItems item
  * @param {String} item.id - the id of the menuItem
  * @param {String} item.run - the function to run
  */
  includeMenuComponentClick (item) {
    if (!item.run || !item.id) return false // if there is no id or runable function, then break this function
    this.clickEvents.clickId.push(item.id)
    this.clickEvents.clickRun.push(item.run)
  },

  /** Registers click events to menu item
   * using the clickEvents.
  */
  addClickEvents () {
    this.clickEvents.clickId.forEach((cid, i) => {
      let id = document.getElementById(cid)
      id.run = this.clickEvents.clickRun[i]
      id.addEventListener('mousedown', (e) => {
        e.currentTarget.run()
        this.checkItemStates()
      })
    })
  },

  /** Registers hover events to menu items
   * using the clickEvents.
  */
  addHoverEvents () {
    Array.from(document.getElementsByClassName('header-item'))
      .forEach((element) => {
        element.addEventListener('mouseover', () => {
          this.checkItemStates()
        })
      })
  },

  /** Register keycode events.
  * @param {Object} item - a menuItems item
  * @param {String} item.keycode - the keycode of the menuItem
  * @param {String} item.run - the function to run
  */
  includeMenuComponentKeycode (item) {
    if (!item.run || !item.keycode) return false // if there is no keycode or runable function, then break this function
    this.keycodes.push({
      run: item.run,
      keycode: item.keycode
    })
  },

  /** All menu items which have an item state.  */
  itemsWithStates: [],

  /** If an items has an item state include it to the itemsWithStates array. */
  includeMenuComponentState (item) {
    if (item.clickable || item.active) this.itemsWithStates.push(item)
  },

  /** Check item states and append them to the item.  */
  checkItemStates () {
    this.itemsWithStates.forEach((item) => {
      let elem = document.getElementById(item.id)
      if (item.clickable) this.setItemStateCss(elem, 'disabled', item.clickable())
      if (item.active) this.setItemStateCss(elem, 'in-active', item.active())
    })
  },

  /** Remove the css class and add one if it is active
   * @param {HTMLElement} elem - li to set css
   * @param {String} cssClass - classname to set
   * @param {Boolen} active - should set
   */
  setItemStateCss (elem, cssClass, active) {
    elem.classList.remove(cssClass)
    if (!active) elem.classList.add(cssClass)
  }
}
module.exports.buildMenu = buildMenu
