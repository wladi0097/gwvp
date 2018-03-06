const displayMessage = require('./interaction/displayMessage')
const elementEvents = require('./elementManipulation/elementEvents')
const elementEditor = require('./elementManipulation/elementEditor')
const menu = require('./menu/buildMenu')
const keydown = require('./interaction/keydown')
const elementItems = require('./newElements/elementItems')
const navigation = require('./navigation')
const changeScreenSize = require('./elementManipulation/changeScreenSize')

/** Initialize all application components */
const main = {
  /** Initialize main. */
  init () {
    this.bindEvents()
  },

  /** Cache dom elements. */
  cacheDom () {
    this.iframeElem = document.getElementById('simulated')
    this.$iframe = this.iframeElem.contentDocument
    this.$displayMessage = document.getElementById('displayMessage')
  },

  /** Apply events to static content. */
  bindEvents () {
    document.addEventListener('DOMContentLoaded', this.pageLoaded.bind(this))
  },

  /** Apply events to iframe content. */
  bindEventsAfterPageLoaded () {
    this.$iframe.addEventListener('load', this.iframeLoaded.bind(this))
  },

  /** Initialize all application components. */
  pageLoaded () {
    this.cacheDom()
    this.removeLoadingScreen()
    displayMessage.init(this.$displayMessage)
    elementEvents.init()
    elementEditor.init(this.$iframe)
    menu.build()
    keydown.addArray(menu.getKeyCodes())
    keydown.init(document)
    elementItems.init(elementEvents)
    navigation.init()
    changeScreenSize.init()
    this.bindEventsAfterPageLoaded()
  },

  /** Delete the loadingScreen to show the content. */
  removeLoadingScreen () {
    document.getElementById('loadingScreen').remove()
  },

  /** Initialize all components which need the iframe. */
  iframeLoaded () {
    elementEvents.initAfterFrame()
  }
}

module.exports = main
