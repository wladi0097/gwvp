/* global alert */
/* All globally usable events without a selection.
  These will be used by the menuitems, keydown and contextmenu (rightclick)
 */

const elementEvents = require('./elementManipulation/elementEvents')
const changeScreenSize = require('./elementManipulation/changeScreenSize')

module.exports = function () {
  const eventList = {
    file: {
      newProject () {
        alert('not implemented')
      },
      addItemElement () {
        alert('not implemented')
      },
      addItemSection () {
        alert('not implemented')
      },
      addItemPage () {
        alert('not implemented')
      },
      openProject () {
        alert('not implemented')
      }
    },

    edit: {
      undo () {
        alert('not implemented')
      },

      redo () {
        alert('not implemented')
      },

      cut () {
        elementEvents.cut()
      },

      copy () {
        elementEvents.copy()
      },

      paste () {
        elementEvents.paste()
      },

      delete () {
        elementEvents.delete()
      },

      duplicate () {
        elementEvents.duplicate()
      }
    },

    view: {
      leftNavBar () {
        alert('not implemented')
      },

      rightNavBar () {
        alert('not implemented')
      },

      screenSizePhone () {
        changeScreenSize.changeResolution('Mobile')
      },

      screenSizeTablet () {
        changeScreenSize.changeResolution('Tablet')
      },

      screenSizeLaptop () {
        changeScreenSize.changeResolution('Computer')
      },

      screenSizeComputer () {
        changeScreenSize.changeResolution('TV')
      }
    }

  }
  return eventList
}
