const elementEvents = require('./elementManipulation/elementEvents')
const changeScreenSize = require('./elementManipulation/changeScreenSize')
const elementEditor = require('./elementManipulation/elementEditor')
const idGen = require('./interaction/idGen')
const history = require('./interaction/history')
const navigation = require('./navigation')

const iframeContents = {
  init () {
    this.cacheDom()
    this.bindEvents()
    this.displayNewProjects()
  },

  cacheDom () {
    this.$center = document.getElementById('applicationCenter')
    this.$newProject = document.getElementById('newProject')
    this.$fromTemplate = document.getElementById('fromTemplate')
    this.$mainMenu = document.getElementById('mainMenu')
    this.$continueProject = document.getElementById('continueProject')
  },

  bindEvents () {
    this.$newProject.addEventListener('mousedown', (e) => {
      let target = e.target.closest('.item')
      if (target) {
        this.listingSelected(target.getAttribute('projectId'))
      }
    })
    this.$continueProject.addEventListener('mousedown', this.hideMainMenu.bind(this))
  },

  hideMainMenu () {
    this.$mainMenu.classList.add('hidden')
    this.$continueProject.classList.remove('hidden') // after the menu is invisible add continue option
  },

  showMainMenu (stage) {
    if (stage) {
      navigation.simulateNavBarSelection(stage)
    }
    this.$mainMenu.classList.remove('hidden')
  },

  insertIntoIframe (iframe, html) {
    iframe.contentDocument.documentElement.innerHTML = html
    this.iframeLoaded(iframe)
  },

  resetIframe () {
    let iframe = document.getElementById('simulated')
    if (iframe) iframe.remove()
    let newIframe = document.createElement('iframe')
    newIframe.id = 'simulated'
    this.$center.appendChild(newIframe)
    return document.getElementById('simulated')
  },

  /** Initialize all components which need the iframe. */
  iframeLoaded (iframe) {
    changeScreenSize.initAfterFrame(iframe)
    elementEvents.initAfterFrame(iframe)
    elementEditor.initAfterFrame(iframe)
    history.reset()
    this.hideMainMenu()
  },

  exportFromIframe () {

  },

  listingSelected (id) {
    let proj = newProject.find((elem) => {
      return elem.id === id
    })
    this.insertIntoIframe(this.resetIframe(), proj.html)
  },

  displayNewProjects () {
    let html = ''
    newProject.forEach(item => {
      item.id = idGen.new()
      html += this.getHTMLListing(item)
    })
    this.$newProject.innerHTML = html
  },

  getHTMLListing (data) {
    return `
    <div class="item" projectId="${data.id}">
      <div class="img">
        <img src="${data.img}" alt="${data.name}">
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
  img: require('../img/basicElements/Container.svg'),
  html: `<html><head></head><body><h1>I am empty</h1></body></html>`
},
{
  name: 'Second Option',
  description: 'test Webpage',
  img: require('../img/basicElements/Container.svg'),
  html: `<html><head></head><body><h1>I am empty TOOO WHOOOO</h1></body></html>`
}]

module.exports = iframeContents
