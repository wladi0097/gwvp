const idGen = require('../interaction/idGen')
const downloadString = require('../interaction/downloadString')

const contentExplorer = {
  $iframe: null,

  init () {
    this.cacheDom()
    this.bindEvents()
  },

  initAfterFrame (iframe) {
    this.$iframe = iframe.contentDocument
    this.build()
  },

  cacheDom () {
    this.$scripts = document.getElementById('contentExplorerScripts')
    this.$css = document.getElementById('contentExplorerCss')
    this.$addScript = document.getElementById('addContentScripts')
    this.$addCss = document.getElementById('addContentCss')
  },

  bindEvents () {
    this.$addScript.addEventListener('mousedown', this.addScript.bind(this))
    this.$addCss.addEventListener('mousedown', this.addCss.bind(this))
  },

  build () {
    this.display(this.getScripts, this.$scripts, 'yellow', 'code')
    this.display(this.getCss, this.$css, 'blue', 'css3')
  },

  display (find, element, color, icon) {
    let s = find(this.$iframe)
    if (!s || s.length < 1) return
    let html = ''
    Array.from(s).forEach(item => {
      let id = idGen.new()
      item.setAttribute('gwvp-cid', id)
      let name = item.getAttribute('gwvp-name') || 'no name'
      html += this.contentHtmlTemplate(id, color, icon, name)
    })
    element.innerHTML = html
  },

  getScripts (iframe) {
    return iframe.getElementsByTagName('script')
  },

  getCss (iframe) {
    return Array.from(iframe.getElementsByTagName('link'))
      .concat(Array.from(iframe.getElementsByTagName('style')))
  },

  addCss () {
    // TODO: finish
  },

  addScript () {
    // TODO: finish
  },

  /** Upload and insert html.
  * @param {Event} e
  */
  chooseFileFromComputer (e) {
    let file = e.target.files[0]
    if (file) {
      let reader = new window.FileReader()
      reader.onload = (e) => {
        // this.insertIntoIframe(this.resetIframe(), e.target.result)
      }
      reader.readAsText(file)
    }
  },

  contentHtmlTemplate (id, color, icon, name) {
    return `
      <div class="content-element" content-id="${id}">
         <i class="fa fa-${icon} ${color}" aria-hidden="true"></i>
         <p>${name}</p>
         <i class="fa fa-times red" aria-hidden="true"></i>
         <i class="fa fa-edit" aria-hidden="true"></i>
      </div>
    `
  }
}
module.exports = contentExplorer
window.c = contentExplorer
