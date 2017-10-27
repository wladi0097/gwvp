/* global $ */
/* Creates a html menu item and binds click and keydown events
 * to the new items. The items can be modified in menuItems.js
 * and the events can be found in eventList.js
 */

module.exports = function (menuItems) {
  for (var i = 0; i < menuItems.length; i++) {
    buildMenu.includeMenuItemStart(menuItems[i])

    let components = menuItems[i].components
    for (var k = 0; k < components.length; k++) {
      buildMenu.includeMenuComponent(components[k])
    }

    buildMenu.includeMenuItemEnd()
  }
  buildMenu.append()

  // init events
  keydown.init()
  contextMenu.init()
}

const buildMenu = {
  html: '',
  $headerItems: $('.header-items'),
  append () {
    this.$headerItems.append(this.html)
  },
  includeMenuItemStart (item) {
    item.id = (item.id) ? 'header-' + item.id : ''
    this.html += `<div class="header-item ${item.id}">
      <p>${item.name}</p>
      <div class="header-item-options">
      <ul>`
  },
  includeMenuItemEnd () {
    this.html += `
        </ul>
      </div>
    </div>
    `
  },
  includeMenuComponent (component) {
    this.includeMenuComponentHTML(component) // include html
    this.includeMenuComponentClick(component) // include click event
    this.includeMenuComponentKeycode(component) // include keydown event
  },

  includeMenuComponentHTML (component) {
    component.icon = (component.icon) ? component.icon : ''
    component.keycode = (component.keycode) ? component.keycode : ''
    component.id = (component.id) ? 'event-' + component.id : ''
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
        this.includeMenuComponent(component.underItems[i])
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

  includeMenuComponentClick (component) {
    if (!component.run || !component.id) {
      return false
    }
    this.$headerItems.on('click', `.${component.id}`, function () {
      component.run()
    })
  },

  includeMenuComponentKeycode (component) {
    if (!component.run || !component.keycode) {
      return false
    }

    keydown.add({
      run: component.run,
      keycode: component.keycode
    })
  }
}

const keydown = {
  keycodes: [],
  pressed: [],
  init () {
    $(document).on('keydown', (e) => {
      if (this.pressed.indexOf(e.keyCode) === -1) {
        this.pressed.push(e.keyCode)
        this.checkPressed()
      }
      return false
    })
    $(document).on('keyup', (e) => {
      var index = this.pressed.indexOf(e.keyCode)
      this.pressed.splice(index, 1)
      return false
    })
  },
  checkPressed () {
    for (var i = 0; i < this.keycodes.length; i++) {
      let len = this.keycodes[i].keycode.length
      if (this.pressed.length === len) {
        let found = true
        for (var k = 0; k < this.pressed.length; k++) {
          if (this.keycodes[i].keycode.indexOf(this.pressed[k]) === -1) {
            found = false
          }
        }
        if (found) {
          this.runPressed(this.keycodes[i])
        }
      }
    }
  },
  runPressed (found) {
    found.run()
  },
  add (event) {
    event.keycode = event.keycode.split(' + ')
    event.keycode = event.keycode.map(this.translate)
    this.keycodes.push(event)
  },
  translate (item) {
    switch (item) {
      case 'STRG':
        return 17
      case 'ALT':
        return 18
      case 'SHIFT':
        return 16
      default:
        return item.charCodeAt(0)
    }
  }
}

const contextMenu = {
  init () {
    this.$domItem = $('.header-contextmenu')
    this.$domItem.hide()
    this.bindContextMenu()
    this.bindCloseContextMenu()
  },
  bindContextMenu () {
    $(document).contextmenu((e) => {
      this.$domItem.show()
      let position = this.getBetPosition(e.clientX, e.clientY)
      this.$domItem.attr('style', `top:${position.y}; left:${position.x}`)
      return false
    })
  },
  bindCloseContextMenu () {
    $(document).on('click', (e) => {
      if (!$(e.target).closest('.header-contextmenu').length) {
        this.$domItem.hide()
      }
    })
  },
  getBetPosition (x, y) {
    y = y - 40
    let position = {x: x, y: y}
    let width = this.$domItem.children('div').width()
    let height = this.$domItem.children('div').height()
    let fullwidth = $(window).width()
    let fullheight = $(window).height()

    if ((x + width + 20) > fullwidth) {
      position.x = x - width
    }

    if ((y + height + 30) > fullheight) {
      position.y = y - height
    }
    return position
  }
}
