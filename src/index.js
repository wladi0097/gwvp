const $ = require('jquery')
window.$ = $
require('./style/main.scss')

const elementEvents = require('./js/elementManipulation/elementEvents.js') // all element events
const elementItems = require('./js/newElements/elementItems.js') // all element events
const navigation = require('./js/navigation.js') // standalone navigation
const menu = require('./js/menu/buildMenu')

$(document).ready(function ($) {
  elementEvents.init()
  menu.build(elementEvents)
  elementItems.init(elementEvents)
  navigation.init()

  $('iframe').ready(() => {
    elementEvents.initAfterFrame()
  })
})
