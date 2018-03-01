require('./style/main.scss')

const elementEvents = require('./js/elementManipulation/elementEvents') // all element events
const elementItems = require('./js/newElements/elementItems') // all element events
const elementEditor = require('./js/elementManipulation/elementEditor') // all element events
const navigation = require('./js/navigation') // standalone navigation
const menu = require('./js/menu/buildMenu')
const contextMenu = require('./js/interaction/contextMenu')
const keydown = require('./js/interaction/keydown')
const displayMessage = require('./js/interaction/displayMessage')
const changeScreenSize = require('./js/elementManipulation/changeScreenSize')

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('loadingScreen').remove()
  let $iframe = document.getElementById('simulated').contentDocument
  displayMessage.init(document.getElementById('displayMessage'))
  elementEvents.init()
  elementEditor.init($iframe)
  menu.build()
  keydown.addArray(menu.getKeyCodes())
  keydown.init(document)
  elementItems.init(elementEvents)
  navigation.init()
  changeScreenSize.init()

  // iframe ready
  document.getElementById('simulated').contentDocument.addEventListener('DOMContentLoaded', (event) => {
    elementEvents.initAfterFrame()
  })
  setTimeout(function () {
    elementEvents.initAfterFrame()
  }, 10)
})
