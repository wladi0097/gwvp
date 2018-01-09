require('./style/main.scss')

const elementEvents = require('./js/elementManipulation/elementEvents.js') // all element events
const elementItems = require('./js/newElements/elementItems.js') // all element events
const navigation = require('./js/navigation.js') // standalone navigation
const menu = require('./js/menu/buildMenu')
const contextMenu = require('./js/interaction/contextMenu')
const keydown = require('./js/interaction/keydown')

document.addEventListener('DOMContentLoaded', () => {
  elementEvents.init()
  menu.build(elementEvents)
  contextMenu.init(document, document.getElementsByClassName('header-contextmenu')[0])
  keydown.addArray(menu.getKeyCodes())
  keydown.init(document)
  elementItems.init(elementEvents)
  navigation.init()

  // iframe ready
  document.getElementById('simulated').contentDocument.addEventListener('DOMContentLoaded', (event) => {
    elementEvents.initAfterFrame()
  })
  setTimeout(function () {
    elementEvents.initAfterFrame()
  }, 10)
})
