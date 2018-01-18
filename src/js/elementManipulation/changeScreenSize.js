/** Scale the iframe and all overlays. <br>
* change width or scale. <br>
* A Overlay is the rectangle around a selected or hovered dom element.
*/
const changeScreenSize = {
  /** Screen width. */
  width: 1200,
  /** Screen scale. */
  scale: 1,
  /** Initialize changeScreenSize. */
  init () {
    this.cacheDom()
    this.bindEvents()
  },

  /** Cache dom elements. */
  cacheDom () {
    // dom to resize
    this.$hover = document.getElementsByClassName('hover-wrapper')[0]
    this.$click = document.getElementsByClassName('click-wrapper')[0]
    this.$simulated = document.getElementById('simulated')
    this.$buttons = document.getElementsByClassName('header-icons')[0]

    // custom buttons
    this.$tv = document.getElementById('screen-Tv')
    this.$computer = document.getElementById('screen-Computer')
    this.$tablet = document.getElementById('screen-Tablet')
    this.$mobile = document.getElementById('screen-Mobile')
  },

  /** Apply events to static content. */
  bindEvents () {
    this.$tv.addEventListener('mousedown', () => { this.changeResolution('Tv') })
    this.$computer.addEventListener('mousedown', () => { this.changeResolution('Computer') })
    this.$tablet.addEventListener('mousedown', () => { this.changeResolution('Tablet') })
    this.$mobile.addEventListener('mousedown', () => { this.changeResolution('Mobile') })
  },

  /** Apply styling to the iframe and the overlays.
   * the used values are stored in this object and edited by changeResolution and changeZoom.
   */
  applyStyle () {
    this.$hover.setAttribute('style', `width: ${this.width}px; min-width:${this.width}px; transform: scale(${this.scale})`)
    this.$click.setAttribute('style', `width: ${this.width}px; min-width:${this.width}px; transform: scale(${this.scale})`)
    this.$simulated.setAttribute('style', `width: ${this.width}px; min-width:${this.width}px; transform: scale(${this.scale})`)
  },

  /** Change the resolution to a device width and highlight the selected icon.
   * The width Values are from https://getbootstrap.com/.
   * @param {String} type - possible TV, Compuer, Tablet and Mobile
   */
  changeResolution (type) {
    if (this.$buttons.querySelectorAll('.selected')[0]) {
      this.$buttons.querySelectorAll('.selected')[0].classList.remove('selected')
    }
    let width = 1200
    switch (type) {
      case 'Tv':
        width = 1200
        this.$tv.classList.add('selected')
        break
      case 'Computer':
        width = 979
        this.$computer.classList.add('selected')
        break
      case 'Tablet':
        width = 767
        this.$tablet.classList.add('selected')
        break
      case 'Mobile':
        width = 480
        this.$mobile.classList.add('selected')
        break
    }
    this.width = width
    this.applyStyle()
  },

  /** Change the this.scale.
   * @param {Number} percent - default 0.9
   */
  changeZoom (percent) {
    if (percent > 2.0 || percent < 0.5) {
      return false
    }
    this.scale = percent
    this.applyStyle()
  }
}
module.exports = changeScreenSize
