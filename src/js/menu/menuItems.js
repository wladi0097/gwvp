const elementEvents = require('../elementManipulation/elementEvents.js')
const pageDomTree = require('../elementManipulation/pageDomTree.js')
const changeScreenSize = require('../elementManipulation/changeScreenSize.js')
const history = require('../interaction/history.js')

/** The menu and keycodes are created by this object.
 * Every keycode must have a menu item. (user friendly)
 * To add a menu item, you have to add it to the exports array like:
 * @example
 *  {
 *    name: '', // name of the menu item         !required
 *    items: [], // all items          !required
 *  }
 *
 * @example
 * A menu item component looks like this:
 * {
 *    id: '' // to run must be unique            !optional
 *    icon: '', // a fontawesome icon            !optional
 *    text: '', // displayed text                !required
 *    keycode: '', // a keycode                  !optional
 *    run: '', // a js funktion from eventList   !optional
 *    underItems: [] // same as normal items     !optional
 *  }
 *
 * @example
 * To make things fancy, you an add a delimiter:
 * { delimiter: true }
 */
module.exports = function () {
  return [{
    name: 'File',
    items: [{
      icon: '',
      text: 'New Project',
      keycode: 'ALT + N'
    },
    {
      delimiter: true
    },
    {
      icon: '',
      text: 'Open Project'
    }
    ]
  },
  {
    name: 'Edit',
    items: [{
      icon: 'undo',
      text: 'Undo',
      keycode: 'STRG + Z',
      clickable () { return history.undoPossible },
      run () { elementEvents.undo() }
    },
    {
      icon: 'repeat',
      text: 'Redo',
      keycode: 'STRG + Y',
      clickable () { return history.redoPossible },
      run () { elementEvents.redo() }
    },
    {
      delimiter: true
    },
    {
      icon: 'scissors',
      text: 'Cut',
      keycode: 'STRG + X',
      clickable () { return elementEvents.allowInteraction },
      run () { elementEvents.cut() }
    },
    {
      icon: 'clone',
      text: 'Copy',
      keycode: 'STRG + C',
      clickable () { return elementEvents.allowInteraction },
      run () { elementEvents.copy() }
    },
    {
      icon: 'clone',
      text: 'Duplicate',
      keycode: 'STRG + D',
      clickable () { return elementEvents.allowInteraction },
      run () { elementEvents.duplicate() }
    },
    {
      icon: 'clipboard',
      text: 'Paste',
      keycode: 'STRG + V',
      clickable () { return elementEvents.allowInteraction },
      run () { elementEvents.paste() }
    },
    {
      icon: 'trash',
      text: 'Delete',
      keycode: 'DEL',
      clickable () { return elementEvents.allowInteraction },
      run () { elementEvents.delete() }
    }
    ]
  },
  {
    name: 'View',
    items: [{
      delimiter: true
    },
    {
      icon: 'resize',
      text: 'Screen Size',
      underItems: [{
        icon: 'television',
        text: 'Monitor / TV',
        keycode: 'ALT + 1',
        run () { changeScreenSize.changeResolution('Tv') }
      },
      {
        icon: 'laptop',
        text: 'Notebook',
        keycode: 'ALT + 2',
        run () { changeScreenSize.changeResolution('Computer') }
      },
      {
        icon: 'tablet',
        text: 'Tablet',
        keycode: 'ALT + 3',
        run () { changeScreenSize.changeResolution('Tablet') }
      },
      {
        icon: 'mobile',
        text: 'Phone',
        keycode: 'ALT + 4',
        run () { changeScreenSize.changeResolution('Mobile') }
      }
      ]
    },
    {
      delimiter: true
    },
    {
      icon: 'refresh',
      text: 'Tree Rebuild',
      run () { pageDomTree.build() }
    },
    {
      icon: 'check',
      text: 'Tree Autoscroll',
      active () { return pageDomTree.allowScrollToElement },
      run () { pageDomTree.toggleAllowScrollToElement() }
    }
    ]
  },

  {
    name: 'Help',
    items: [
      {
        icon: 'book',
        text: 'Read Docs',
        href: 'https://gwvp.glvp.de/docs/'
      },
      {
        icon: 'github',
        text: 'Code on Github',
        href: 'https://github.com/wladi0097/gwvp'
      },
      {
        icon: 'exclamation-triangle',
        text: 'Report a problem',
        href: 'https://github.com/wladi0097/gwvp/issues'
      }
    ]
  },
  {
    // this one wont be seen in the menu because its a contextmenu
    id: 'contextmenu',
    name: 'contextmenu',
    items: [{
      icon: '',
      text: 'New Project'
    }]
  }]
}
