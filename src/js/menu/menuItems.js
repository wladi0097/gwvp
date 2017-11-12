/* The menu and keycodes are creted by this object.
 * Every keycode must have a menu item. (User friendly)
 * To add a menu item, you have to add it to the exports array like:
 *  {
 *    name: '', // name of the menu item         !required
 *    components: [], // all components          !required
 *  }
 *
 * A menu item component looks like this:
 *  {
 *    id: '' // to run must be unique            !optional
 *    icon: '', // a fontawesome icon            !optional
 *    text: '', // displayed text                !required
 *    keycode: '', // a keycode                  !optional
 *    run: '', // a js funktion from eventList   !optional
 *    underItems: [] // same as normal items     !optional
 *  }
 *
 * To make things fancy, you an add a delimiter:
 * { delimiter: true }
 */
module.exports = function (elementEvents) {
  const runEvents = {
    elementEvents: {
      undo () {
        elementEvents.undo()
      },
      redo () {
        elementEvents.redo()
      },
      cut () {
        elementEvents.cut()
      },
      copy () {
        elementEvents.copy()
      },
      duplicate () {
        elementEvents.duplicate()
      },
      paste () {
        elementEvents.paste()
      },
      delete () {
        elementEvents.delete()
      },
      resizeToTv () {
        elementEvents.changeRes('TV')
      },
      resizeToLaptop () {
        elementEvents.changeRes('Computer')
      },
      resizeToTablet () {
        elementEvents.changeRes('Tablet')
      },
      resizeToMobile () {
        elementEvents.changeRes('Mobile')
      }
    }
  }
  return [{
    name: 'File',
    components: [{
      id: 'newProject',
      icon: '',
      text: 'New Project',
      keycode: 'ALT + N'
    },
    {
      icon: 'plus',
      text: 'Add',
      underItems: [{
        id: 'addElement',
        icon: 'circle',
        text: 'Element'
      },
      {
        id: 'addSection',
        icon: 'bars',
        text: 'Section'
      },
      {
        id: 'addFile',
        icon: 'file',
        text: 'Page'
      }
      ]
    },
    {
      delimiter: true
    },
    {
      id: 'openProject',
      icon: '',
      text: 'Open Project'
    }
    ]
  },
  {
    name: 'Edit',
    components: [{
      id: 'undo',
      icon: 'undo',
      text: 'Undo',
      keycode: 'STRG + Z',
      run: runEvents.elementEvents.undo
    },
    {
      id: 'redo',
      icon: 'repeat',
      text: 'Redo',
      keycode: 'SHIFT + STRG + Z',
      run: runEvents.elementEvents.redo
    },
    {
      delimiter: true
    },
    {
      id: 'cut',
      icon: 'scissors',
      text: 'Cut',
      keycode: 'STRG + X',
      run: runEvents.elementEvents.cut
    },
    {
      id: 'clone',
      icon: 'clone',
      text: 'Copy',
      keycode: 'STRG + C',
      run: runEvents.elementEvents.copy
    },
    {
      id: 'duplicate',
      icon: 'clone',
      text: 'Duplicate',
      keycode: 'STRG + D',
      run: runEvents.elementEvents.duplicate
    },
    {
      id: 'clipboard',
      icon: 'clipboard',
      text: 'Paste',
      keycode: 'STRG + V',
      run: runEvents.elementEvents.paste
    },
    {
      id: 'trash',
      icon: 'trash',
      text: 'Delete',
      keycode: 'DEL',
      run: runEvents.elementEvents.delete
    }
    ]
  },
  {
    name: 'View',
    components: [{
      id: 'showLeftNav',
      icon: 'check',
      text: 'Show left Nav'
    },
    {
      id: 'showRightNav',
      icon: 'check',
      text: 'Show right Nav'
    },
    {
      delimiter: true
    },
    {
      icon: 'resize',
      text: 'Screen Size',
      underItems: [{
        id: 'resizeToTv',
        icon: 'television',
        text: 'Monitor / TV',
        keycode: 'ALT + 1',
        run: runEvents.resizeToTv
      },
      {
        id: 'resizeToLaptop',
        icon: 'laptop',
        text: 'Notebook',
        keycode: 'ALT + 2',
        run: runEvents.resizeToLaptop
      },
      {
        id: 'resizeToTablet',
        icon: 'tablet',
        text: 'Tablet',
        keycode: 'ALT + 3',
        run: runEvents.resizeToTablet
      },
      {
        id: 'resizeToMobile',
        icon: 'mobile',
        text: 'Phone',
        keycode: 'ALT + 4',
        run: runEvents.resizeToMobile
      }
      ]
    }
    ]
  },

  {
    name: 'Help',
    components: [
      {
        icon: 'book',
        text: 'Read Docs',
        href: '#'
      },
      {
        icon: 'github',
        text: 'Code on Github',
        href: '#'
      },
      {
        icon: 'file-text',
        text: 'Whats New',
        href: '#'
      }
    ]
  },
  {
    // this one wont be seen in the menu because its a contextmenu
    id: 'contextmenu',
    components: [{
      id: 'CnewProject',
      icon: '',
      text: 'New Project'
    }]
  }]
}
