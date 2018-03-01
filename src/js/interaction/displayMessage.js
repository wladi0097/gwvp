/** Display a popup Message for the user and remove it after a given time or after close was clicked. */
const displayMessage = {
  displayElem: null,

  /** Initialize displayMessage. */
  init (dElem) {
    this.displayElem = dElem
    this.bindEvents()
  },

  /** Apply close events to single messages via global watch.  */
  bindEvents () {
    this.displayElem.addEventListener('mousedown', (e) => {
      let target = e.target.closest('.deleteMessage')
      if (target) {
        this.delete(target.parentNode.parentNode)
      }
    })
  },

  /** Create innerHTML for a single message.
  * @param {String} text - the text the message should show
  * @param {Boolean} closeable - can the user close the message?
  * @return valid Html string
  */
  htmlTemplate (text, closeable) {
    return `
      <div class="close">
        ${(closeable) ? '<i class="fa fa-times deleteMessage" aria-hidden="true"></i>' : ''}
      </div>
      <div class="text">
        <p>${text}</p>
      </div>`
  },

  /** Display a message and delete it after the given duration.
  * @param {String} text - the text the message should show
  * @param {Int} duration - how long the message should be visible
  * @param {String} type - a css class
  * @param {Boolean} closeable - can the user close the message?
  */
  show (text, duration, type, closeable) {
    if (!text || !this.displayElem || duration < 500) return false
    let el = this.createElem(type, this.htmlTemplate(text, closeable))
    this.displayElem.appendChild(el)
    setTimeout(() => {
      this.delete(el)
    }, duration)
  },

  /** Create a single passable Html element.
  * @param {String} innerHTML - the innerHTML of the element
  * @param {String} type - a css class
  * @return {HTMLElement}
  */
  createElem (type, innerHTML) {
    let el = document.createElement('div')
    el.classList.add('message', type)
    el.innerHTML = innerHTML
    return el
  },

  /** Deletes a element if it exists.
  * @param {HTMLElement} elem - element to delete
  */
  delete (elem) {
    let parent = elem.parentNode
    if (!parent) return
    elem.classList.add('hide-message')
    setTimeout(() => {
      parent.removeChild(elem)
    }, 900)
  }
}
module.exports = displayMessage
