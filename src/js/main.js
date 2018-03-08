const displayMessage = require('./interaction/displayMessage')
const elementEvents = require('./elementManipulation/elementEvents')
const elementEditor = require('./elementManipulation/elementEditor')
const menu = require('./menu/buildMenu')
const keydown = require('./interaction/keydown')
const elementItems = require('./newElements/elementItems')
const navigation = require('./navigation')
const changeScreenSize = require('./elementManipulation/changeScreenSize')
const iframeContents = require('./iframeContents')

/** Initialize all application components */
const main = {
  /** Initialize main. */
  init () {
    this.bindEvents()
  },

  /** Cache dom elements. */
  cacheDom () {
    this.$displayMessage = document.getElementById('displayMessage')
  },

  /** Apply events to static content. */
  bindEvents () {
    document.addEventListener('DOMContentLoaded', this.pageLoaded.bind(this))
  },

  /** Initialize all application components. */
  pageLoaded () {
    this.cacheDom()
    this.removeLoadingScreen()
    this.loadDependencies()
  },

  loadDependencies () {
    displayMessage.init(this.$displayMessage)
    elementEvents.init()
    elementEditor.init()
    menu.build()
    keydown.addArray(menu.getKeyCodes())
    keydown.init(document)
    elementItems.init(elementEvents)
    navigation.init()
    changeScreenSize.init()

    iframeContents.init()
  },

  /** Delete the loadingScreen to show the content. */
  removeLoadingScreen () {
    document.getElementById('loadingScreen').remove()
  }
}

module.exports = main
