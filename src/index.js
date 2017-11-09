const $ = require('jquery')
window.$ = $
require('./style/main.scss')

const elementEvents = require('./js/elementManipulation/elementEvents.js') // all element events
const changeScreenSize = require('./js/elementManipulation/changeScreenSize.js') // all element events
const pageDomTree = require('./js/elementManipulation/pageDomTree.js') // all element events
const navigation = require('./js/navigation.js') // standalone navigation
const menu = require('./js/menu/buildMenu')

$(document).ready(function ($) {
  menu.build()
  elementEvents.init()
  changeScreenSize.init()

  $('iframe').ready(() => {
    navigation.init()
    elementEvents.bindFrameEvents()
    pageDomTree.build()
  })
})
