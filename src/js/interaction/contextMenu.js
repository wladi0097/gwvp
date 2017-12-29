/**
 * The contextmenu (right click) displays a domItem at the location of the mouse.
 * The domItem hides after clicking something else.
 * It is standalone and can be used in other projects.
 */
const contextMenu = {
  /** Initialize the contextMenu to a domItem with a domItem
   * @param {HTMLElement} [location=document] - where the right click should trigger
   * @param {HTMLElement} domItem - which element should be shown. If already initialized it will take the existing one.
  */
  init (location = document, domItem) {
    this.$domItem = domItem || this.$domItem
    if (location && this.$domItem) {
      this.prepareElement(this.$domItem)
      this.bindContextMenu(location)
      this.bindCloseContextMenu(location)
    }
  },

  /** Hide the Element and give it a ID.
   * @param {HTMLElement} element - contextMenu dom item
  */
  prepareElement (element) {
    element.setAttribute('style', 'display: none;')
    element.setAttribute('id', 'contextMenu')
  },

  /** bind the right click to the former given location and domItem.
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
    location.addEventListener('mousedown', (e) => {
      if (e.force || !e.target.closest('#contextMenu')) {
        this.$domItem.setAttribute('style', 'display: none;')
      }
    })
  },

  /** get the stablest reasonable position for the domItem.
   * If the click is on the far left, show the domItem right from the mouse position.
   * If the click is on the far right, show the domItem left from the mouse position
   * and so on.
   * @param {Number} x - x coordinate
   * @param {Number} y - y coordinate
   * @todo replace hardcoded width and height
  */
  getBestPosition (x, y) {
    // block has to be visible to get width and height
    this.$domItem.setAttribute('style', `display: block;`)
    let position = {x: x, y: y}
    let tolerance = 25
    let width = this.$domItem.children[1].offsetWidth + tolerance
    let height = this.$domItem.children[1].offsetHeight + tolerance
    let fullwidth = window.innerWidth
    let fullheight = window.innerHeight

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
