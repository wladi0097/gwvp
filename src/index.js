require('./style/main.scss')

const elementEvents = require('./js/elementManipulation/elementEvents.js') // all element events
const elementItems = require('./js/newElements/elementItems.js') // all element events
const navigation = require('./js/navigation.js') // standalone navigation
const menu = require('./js/menu/buildMenu')

document.addEventListener('DOMContentLoaded', () => {
  elementEvents.init()
  menu.build(elementEvents)
  elementItems.init(elementEvents)
  navigation.init()

  // iframe ready
  document.getElementById('simulated').contentDocument.addEventListener('DOMContentLoaded', (event) => {
    elementEvents.initAfterFrame()
  })
})
