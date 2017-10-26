/* The menu and keycodes are creted by this object.
 * Every keycode must have a menu item. (User friendly)
 * To add a menu item, you have to add it to the exports array like:
 *  {
 *    name: '', // name of the menu item         !required
 *    components: [], // all components          !required
 *  }
 *
 * A menu items looks like this:
 *  {
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

import eventList from 'eventList'
module.exports = [
  {
    name: 'File',
    components: [
      {
        icon: '',
        text: 'New Project',
        keycode: 'ALT + N',
        run: eventList.file.newProject()
      },
      {
        icon: 'plus',
        text: 'Add',
        underItems: [
          {
            icon: 'circle',
            text: 'Element',
            run: eventList.file.addItemElement()
          },
          {
            icon: 'bars',
            text: 'Section',
            run: eventList.file.addItemSection()
          },
          {
            icon: 'file',
            text: 'Page',
            run: eventList.file.addItemPage()
          }
        ]
      },
      {
        delimiter: true
      },
      {
        icon: '',
        text: 'Open Project',
        run: eventList.file.openProject()
      }
    ]
  },

  {
    name: 'Edit',
    components: [
      {
        icon: 'undo',
        text: 'Undo',
        keycode: 'STRG + Z',
        run: eventList.edit.undo()
      },
      {
        icon: 'repeat',
        text: 'Repeat',
        keycode: 'SHIFT + STRG + Z',
        run: eventList.edit.redo()
      },
      {
        delimiter: true
      },
      {
        icon: 'scissors',
        text: 'Cut',
        keycode: 'STRG + X',
        run: eventList.edit.cut()
      },
      {
        icon: 'clone',
        text: 'Copy',
        keycode: 'STRG + C',
        run: eventList.edit.copy()
      },
      {
        icon: 'clipboard',
        text: 'Paste',
        keycode: 'STRG + V',
        run: eventList.edit.paste()
      },
      {
        icon: 'trash',
        text: 'Delete',
        keycode: 'DEL',
        run: eventList.edit.delete()
      }
    ]
  },

  {
    name: 'View',
    components: [
      {
        icon: 'check',
        text: 'Show left Nav',
        run: eventList.view.leftNavBar()
      },
      {
        icon: 'check',
        text: 'Delete',
        run: eventList.view.rightNavBar()
      },
      {
        delimiter: true
      },
      {
        icon: 'resize',
        text: 'Screen Size',
        underItems: [
          {
            icon: 'television',
            text: 'Monitor / TV',
            keycode: 'ALT + 1',
            run: eventList.view.screenSizePhone()
          },
          {
            icon: 'laptop',
            text: 'Notebook',
            keycode: 'ALT + 2',
            run: eventList.view.screenSizeTablett()
          },
          {
            icon: 'tablet',
            text: 'Tablet',
            keycode: 'ALT + 3',
            run: eventList.view.screenSizeLaptop()
          },
          {
            icon: 'mobile',
            text: 'Phone',
            keycode: 'ALT + 4',
            run: eventList.view.screenSizeComputer()
          }
        ]
      }
    ]
  },

  {
    name: 'Help',
    components: [

    ]
  }
]
