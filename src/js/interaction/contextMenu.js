/**
 * The contextmenu (right click) displays a domItem at the location of the mouse.
 * The domItem hides after clicking something else.
 */
const contextMenu = {
  $domItem: null,
  $docPosition: null,
  $location: null,

  /** Initialize the contextMenu to a domItem with a domItem
   * @param {HTMLElement} [location=document] - where the right click should trigger
   * @param {HTMLElement} domItem - which element should be shown. If already initialized it will take the existing one.
   * @param {HTMLElement} docPosition - if the given location is an iframe the you have to pass the original document too.
  */
  init (location, domItem, docPosition) {
    this.$domItem = domItem || this.$domItem
    this.$docPosition = docPosition || null
    this.$location = location || document
    if (location && this.$domItem) {
      this.prepareElement(this.$domItem)
      this.bindContextMenu(location)
      this.bindCloseContextMenu(location)
      if (docPosition) this.bindCloseContextMenu(docPosition)
    }
  },

  /** Hide the Element and give it a ID.
   * @param {HTMLElement} element - contextMenu dom item
  */
  prepareElement (element) {
    element.setAttribute('style', 'display: none;')
    element.setAttribute('id', 'contextMenu')
  },

  /** Bind the right click to the former given location and domItem.
   * The domItem will be shown after the right click to the stablest reasonable position.
   * @param {HTMLElement} location - dom element where right click should be triggered
  */
  bindContextMenu (location) {
    location.addEventListener('contextmenu', (e) => {
      let position = this.getBestPosition(e.clientX, e.clientY)
      this.$domItem.setAttribute('style', `display: block;top:${position.y}px; left:${position.x}px`)
      e.preventDefault()
    })
  },

  /** If anything but the contextmenu is clicked, hide it.
   * * @param {HTMLElement} location - dom element where left click should hide contextMenu
  */
  bindCloseContextMenu (location) {
    location.addEventListener('click', (e) => {
      this.$domItem.setAttribute('style', 'display: none;')
    })
  },

  /** Get the stablest reasonable position for the domItem.
   * If the click is on the far left, show the domItem right from the mouse position.
   * If the click is on the far right, show the domItem left from the mouse position
   * and so on.
   * @param {Number} x - x coordinate
   * @param {Number} y - y coordinate
  */
  getBestPosition (x, y) {
    // block has to be visible to get width and height
    this.$domItem.setAttribute('style', `display: block;`)
    let position = {x: x, y: y}
    let tolerance = 0
    let width = this.$domItem.offsetWidth + tolerance
    let height = this.$domItem.offsetHeight + tolerance
    let fullwidth = window.innerWidth
    let fullheight = window.innerHeight

    if (this.$docPosition) {
      let widthfix = 35
      let heightfix = 60
      x = ((fullwidth - this.$location.body.clientWidth) / 2) + x - widthfix
      position.x = x
      y = y + heightfix
      position.y = y
    }

    if ((x + width) > fullwidth) {
      position.x = x - width
    }

    if ((y + height) > fullheight) {
      position.y = y - height
    }
    return position
  }
}
module.exports = contextMenu
