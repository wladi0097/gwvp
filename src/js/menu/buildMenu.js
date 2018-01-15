/** Creates a html menu item and binds click and keydown events
 * to the new items. The items can be modified in menuItems.js
 * and the events can be found in eventList.js.
 * The contextmenu is a menu item and can also be found in menuItems.js.
 * gets the menuItems JSON and translates it into a menu, keydown and contextmenu
 */
const idGen = require('../interaction/idGen')
const menuItems = require('./menuItems')

/** build the whole menu and add click and keydown events for every item.
* All functionality has to be parsed into build and then you can acces them over the menu.
* Initialize the menuItems.
*/
module.exports.build = function () {
  window.check = buildMenu.checkItemStates.bind(buildMenu)
  this.menuItems = menuItems()

  for (var i = 0; i < this.menuItems.length; i++) {
    buildMenu.includeMenuItemStart(this.menuItems[i])
    let items = this.menuItems[i].items
    for (var k = 0; k < items.length; k++) {
      buildMenu.includeMenuComponent(items[k])
    }
    buildMenu.includeMenuItemEnd()
  }

  buildMenu.append()
  buildMenu.addAllEvents()
}

module.exports.getKeyCodes = function () {
  return buildMenu.keycodes
}

/**
  Builds the HTML for the menu and the contextmenu by the menuItems.js
*/
const buildMenu = {
  /** The final html to append */
  html: '',
  keycodes: [],
  /** position of the final Html */
  $headerItems: document.getElementsByClassName('header-items')[0],

  /** add external and interlan events to the already build menu  */
  addAllEvents () {
    this.addClickEvents()
    this.addHoverEvents()
    this.checkItemStates()
  },

  /** append the final result into the $headerItems */
  append () {
    this.$headerItems.innerHTML = this.html
  },

  /** the start of the menu HTML
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

  /** Close all Tags of the menu HTML */
  includeMenuItemEnd () {
    this.html += `
        </ul>
      </div>
    </div>
    `
  },

  /** builds the html and includes the click and keydown events
  * @param {Object} item - a menuItems item
  */
  includeMenuComponent (item) {
    item.id = item.id || idGen.new()
    this.includeMenuComponentHTML(item) // include html
    this.includeMenuComponentClick(item) // include click event
    this.includeMenuComponentKeycode(item) // include keydown event
    this.includeMenuComponentState(item)
  },

  /** builds HTML the fastest way by
  * pushing all into a html and appending the result
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
      for (var i = 0; i < item.underItems.length; i++) {
        // recursive for underItems
        this.includeMenuComponent(item.underItems[i])
      }
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

  /** a reference which id has which event */
  clickEvents: {
    clickId: [],
    clickRun: []
  },
  /** save the item into clickEvents for later use
  * @param {Object} item - a menuItems item
  * @param {String} item.id - the id of the menuItem
  * @param {String} item.run - the function to run
  */
  includeMenuComponentClick (item) {
    if (!item.run || !item.id) {
      return false // if there is no id or runable function, then break this function
    }
    this.clickEvents.clickId.push(item.id)
    this.clickEvents.clickRun.push(item.run)
  },
  /** registrer click event on the menu item
   * using the clickEvents
  */
  addClickEvents () {
    for (var i = 0; i < this.clickEvents.clickId.length; i++) {
      let id = document.getElementById(this.clickEvents.clickId[i])
      id.run = this.clickEvents.clickRun[i]
      id.addEventListener('mousedown', (e) => {
        e.currentTarget.run()
        this.checkItemStates()
      })
    }
  },

  /** registrer hover event on the menu item
   * using the clickEvents
  */
  addHoverEvents () {
    Array.from(document.getElementsByClassName('header-item'))
      .forEach((element) => {
        element.addEventListener('mouseover', () => {
          this.checkItemStates()
        })
      })
  },

  /** register the keycode events
  * @param {Object} item - a menuItems item
  * @param {String} item.keycode - the keycode of the menuItem
  * @param {String} item.run - the function to run
  */
  includeMenuComponentKeycode (item) {
    if (!item.run || !item.keycode) {
      // if there is no keycode or runable function, then break this function
      return false
    }

    this.keycodes.push({
      run: item.run,
      keycode: item.keycode
    })
  },

  /** all menu items which have an item state  */
  itemsWithStates: [],
  /** if an items has an item state include it to the itemsWithStates array */
  includeMenuComponentState (item) {
    if (item.clickable || item.active) {
      this.itemsWithStates.push(item)
    }
  },

  /** check item states and append them to the item  */
  checkItemStates () {
    this.itemsWithStates.forEach((item) => {
      let elem = document.getElementById(item.id)
      if (item.clickable) {
        this.setItemStateCss(elem, 'disabled', item.clickable())
      }

      if (item.active) {
        this.setItemStateCss(elem, 'in-active', item.active())
      }
    })
  },

  /** remove the css class and add one if it is active
   * @param {HTMLElement} elem - li to set css
   * @param {String} cssClass - classname to set
   * @param {Boolen} active - should set
   */
  setItemStateCss (elem, cssClass, active) {
    elem.classList.remove(cssClass)
    if (!active) {
      elem.classList.add(cssClass)
    }
  }
}
module.exports.buildMenu = buildMenu
