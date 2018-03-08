const elementEvents = require('./elementManipulation/elementEvents')
const changeScreenSize = require('./elementManipulation/changeScreenSize')
const elementEditor = require('./elementManipulation/elementEditor')
const idGen = require('./interaction/idGen')
const history = require('./interaction/history')
const downloadString = require('./interaction/downloadString')
const navigation = require('./navigation')

/** Control the full Iframe interaction. */
const iframeContents = {
  /** Initialize iframeContents. */
  init () {
    this.cacheDom()
    this.bindEvents()
    this.displayNewProjects()
  },

  /** Cache static dom elements. */
  cacheDom () {
    this.$center = document.getElementById('applicationCenter')
    this.$newProject = document.getElementById('newProject')
    this.$fromTemplate = document.getElementById('fromTemplate')
    this.$mainMenu = document.getElementById('mainMenu')
    this.$continueProject = document.getElementById('continueProject')
  },

  /** Apply events to static content. */
  bindEvents () {
    this.$newProject.addEventListener('mousedown', (e) => {
      let target = e.target.closest('.item')
      if (target) {
        this.listingSelected(target.getAttribute('projectId'))
      }
    })
    this.$continueProject.addEventListener('mousedown', this.hideMainMenu.bind(this))
  },

  /** Hide the main menu from Window. */
  hideMainMenu () {
    this.$mainMenu.classList.add('hidden')
    this.$continueProject.classList.remove('hidden') // after the menu is invisible add continue option
  },

  /** Show main menu with a given stage.
  * @param {String} stage - which tab should be open
  */
  showMainMenu (stage) {
    if (stage) {
      navigation.simulateNavBarSelection(stage)
    }
    this.$mainMenu.classList.remove('hidden')
  },

  /** Insert raw html into the iframe. The html should include <html>
   * @param {HTMLElement} iframe - the iframe to fill
   * @param {String} html - the page as html
   */
  insertIntoIframe (iframe, html) {
    iframe.contentDocument.documentElement.innerHTML = html
    this.iframeLoaded(iframe)
  },

  /** Delete current iframe and return a new one. */
  resetIframe () {
    let iframe = document.getElementById('simulated')
    if (iframe) iframe.remove()
    let newIframe = document.createElement('iframe')
    newIframe.id = 'simulated'
    this.$center.appendChild(newIframe)
    return document.getElementById('simulated')
  },

  /** Initialize all components which need the iframe.
   * @param {HTMLElement} iframe - the newly created iframe.
   */
  iframeLoaded (iframe) {
    changeScreenSize.initAfterFrame(iframe)
    elementEvents.initAfterFrame(iframe)
    elementEditor.initAfterFrame(iframe)
    history.reset()
    this.hideMainMenu()
  },

  /** Download the content of the iframe.
   * @param {String} type - Which iframe part to download
   * @param {String} element - has to used with the 'selection' type so you can download the element content.
   */
  exportIframe (type, element) {
    let iframe = document.getElementById('simulated')
    if (iframe) {
      switch (type) {
        case 'full':
          downloadString.download(iframe.contentDocument.documentElement.outerHTML, 'FullPage.html')
          break
        case 'body':
          downloadString.download(iframe.contentDocument.body.outerHTML, 'PageBody.html')
          break
        case 'head':
          downloadString.download(iframe.contentDocument.head.outerHTML, 'PageHead.html')
          break
        case 'selection':
          downloadString.download(element, 'Selection.html')
      }
    }
  },

  /** Display the content of clicked project listing.
   * @param {Integer} id - project id
   */
  listingSelected (id) {
    let proj = newProject.find((elem) => {
      return elem.id === id
    })
    this.insertIntoIframe(this.resetIframe(), proj.html)
  },

  /** Display all aviable projects */
  displayNewProjects () {
    let html = ''
    newProject.forEach(item => {
      item.id = idGen.new()
      html += this.getHTMLListing(item)
    })
    this.$newProject.innerHTML = html
  },

  /** Create HTML for the projects.
  * @param {Object} data - data from project
  * @param {String} data.id - unique project id
  * @param {String} data.description - short project description
  * @param {String} data.img - project image
  * @param {String} data.html - project html
  */
  getHTMLListing (data) { // TODO: change image
    return `
    <div class="item" projectId="${data.id}">
      <div class="img">
        <img src="${require('../img/basicElements/Container.svg')}" alt="${data.name}">
      </div>
      <h2>${data.name}</h2>
      <p>${data.description}</p>
    </div>
    `
  }
}

const newProject = [{
  name: 'Empty Page',
  description: 'default Webpage',
  html: `<html><head></head><body><h1>I am empty</h1></body></html>`
}]

module.exports = iframeContents
