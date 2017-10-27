const $ = require('jquery')
window.$ = $
require('./style/main.scss')
const navigation = require('./js/navigation.js')
const eventList = require('./js/EventHandler/eventList.js')
const menuItems = require('./js/EventHandler/menuItems.js')(eventList)
const buildMenu = require('./js/EventHandler/buildMenu.js')(menuItems)

$(document).ready(function ($) {
  navigation.init()
})
