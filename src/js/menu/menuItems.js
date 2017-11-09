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
const eventList = require('../eventList')()

module.exports = function () {
  return [{
    name: 'File',
    components: [{
      id: 'newProject',
      icon: '',
      text: 'New Project',
      keycode: 'ALT + N',
      run: eventList.file.newProject
    },
    {
      icon: 'plus',
      text: 'Add',
      underItems: [{
        id: 'addElement',
        icon: 'circle',
        text: 'Element',
        run: eventList.file.addItemElement
      },
      {
        id: 'addSection',
        icon: 'bars',
        text: 'Section',
        run: eventList.file.addItemSection
      },
      {
        id: 'addFile',
        icon: 'file',
        text: 'Page',
        run: eventList.file.addItemPage
      }
      ]
    },
    {
      delimiter: true
    },
    {
      id: 'openProject',
      icon: '',
      text: 'Open Project',
      run: eventList.file.openProject
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
      run: eventList.edit.undo
    },
    {
      id: 'redo',
      icon: 'repeat',
      text: 'Redo',
      keycode: 'SHIFT + STRG + Z',
      run: eventList.edit.redo
    },
    {
      delimiter: true
    },
    {
      id: 'cut',
      icon: 'scissors',
      text: 'Cut',
      keycode: 'STRG + X',
      run: eventList.edit.cut
    },
    {
      id: 'clone',
      icon: 'clone',
      text: 'Copy',
      keycode: 'STRG + C',
      run: eventList.edit.copy
    },
    {
      id: 'duplicate',
      icon: 'clone',
      text: 'Duplicate',
      keycode: 'STRG + D',
      run: eventList.edit.duplicate
    },
    {
      id: 'clipboard',
      icon: 'clipboard',
      text: 'Paste',
      keycode: 'STRG + V',
      run: eventList.edit.paste
    },
    {
      id: 'trash',
      icon: 'trash',
      text: 'Delete',
      keycode: 'DEL',
      run: eventList.edit.delete
    }
    ]
  },
  {
    name: 'View',
    components: [{
      id: 'showLeftNav',
      icon: 'check',
      text: 'Show left Nav',
      run: eventList.view.leftNavBar
    },
    {
      id: 'showRightNav',
      icon: 'check',
      text: 'Show right Nav',
      run: eventList.view.rightNavBar
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
        run: eventList.view.screenSizeComputer
      },
      {
        id: 'resizeToLaptop',
        icon: 'laptop',
        text: 'Notebook',
        keycode: 'ALT + 2',
        run: eventList.view.screenSizeLaptop
      },
      {
        id: 'resizeToTablet',
        icon: 'tablet',
        text: 'Tablet',
        keycode: 'ALT + 3',
        run: eventList.view.screenSizeTablet
      },
      {
        id: 'resizeToMobile',
        icon: 'mobile',
        text: 'Phone',
        keycode: 'ALT + 4',
        run: eventList.view.screenSizePhone
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
      text: 'New Project',
      run: eventList.file.newProject
    }]
  }]
}
