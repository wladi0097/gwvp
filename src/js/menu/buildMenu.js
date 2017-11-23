/* global $ */
/* Creates a html menu item and binds click and keydown events
 * to the new items. The items can be modified in menuItems.js
 * and the events can be found in eventList.js
 */

const keydown = require('../interaction/keydown') // add keydown events to menu items
const contextMenu = require('../interaction/contextMenu') // a menu item is going to be a contextmenu
const menuItems = require('./menuItems')

// gets the menuItems JSON and translates it into a menu, keydown and contextmenu
module.exports = {
  build (elementEvents) {
    this.menuItems = menuItems(elementEvents)
    for (var i = 0; i < this.menuItems.length; i++) {
      buildMenu.includeMenuItemStart(this.menuItems[i])

      let components = this.menuItems[i].components
      for (var k = 0; k < components.length; k++) {
        buildMenu.includeMenuComponent(components[k])
      }

      buildMenu.includeMenuItemEnd()
    }
    buildMenu.append()

    keydown.init(document) // create keydown events
    contextMenu.init(document, $('.header-contextmenu')) // create contextmenu
  }
}

/*
  Builds the HTML for the menu and the contextmenu by the menuItems.js JSON
*/
const buildMenu = {
  html: '',

  $headerItems: $('.header-items'),

  append () {
    this.$headerItems.append(this.html)
  },

  // the start of the menu HTML
  includeMenuItemStart (item) {
    item.id = (item.id) ? 'header-' + item.id : ''
    this.html += `<div class="header-item ${item.id}">
      <p>${item.name}</p>
      <div class="header-item-options">
      <ul>`
  },

  // the end of the menu HTML
  includeMenuItemEnd () {
    this.html += `
        </ul>
      </div>
    </div>
    `
  },

  // builds the html and includes the click and keydown events
  includeMenuComponent (component) {
    this.includeMenuComponentHTML(component) // include html
    this.includeMenuComponentClick(component) // include click event
    this.includeMenuComponentKeycode(component) // include keydown event
  },

  // builds HTML the fastest way
  // pushing all into a html and appending the result
  includeMenuComponentHTML (component) {
    component.icon = (component.icon) ? component.icon : '' // is there a icon ?
    component.keycode = (component.keycode) ? component.keycode : '' // is there a keycode ?
    component.id = (component.id) ? 'event-' + component.id : '' // is there a Id ?
    // is delimiter
    if (component.delimiter) {
      this.html += `<li class="option-delimiter"></li>`
    // is underitem
    } else if (component.underItems) {
      this.html += `
      <li class="option-item">
      <i class="fa fa-${component.icon}" aria-hidden="true"></i>
      <p>${component.text}</p>
      <p class="shortcut">
      <i class="fa fa-caret-right" aria-hidden="true"></i>
      </p>
      <ul class="option-underitem">`
      for (var i = 0; i < component.underItems.length; i++) {
        this.includeMenuComponent(component.underItems[i]) // recursive for underItems
      }
      this.html += `
        </ul>
      </li>`
    // is default
    } else {
      this.html += `
      <li class="option-item ${component.id}">
        <i class="fa fa-${component.icon}" aria-hidden="true"></i>
        ${(component.href) ? `<a href="${component.href}">` : ''}
        <p>${component.text}</p>
        <p class="shortcut">${component.keycode}</p>
        ${(component.href) ? `</a>` : ''}
      </li>`
    }
  },

  // registrer click event on the menu item
  includeMenuComponentClick (component) {
    if (!component.run || !component.id) {
      return false // if there is no id or runable function, then break this function
    }
    this.$headerItems.on('click', `.${component.id}`, function () {
      component.run()
    })
  },

  // register the keycode events
  includeMenuComponentKeycode (component) {
    if (!component.run || !component.keycode) {
      return false // if there is no keycode or runable function, then break this function
    }

    keydown.add({
      run: component.run,
      keycode: component.keycode
    })
  }
}
