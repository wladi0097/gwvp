/** Download any String as a File over the Browser. */
const downloadString = {

  /** Main function to dowload a file by given string.
   * @param {String} string - the file data
   * @param {String} filename - name of the file
   */
  download (string, filename) {
    let elem = this.createElement()
    elem.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(string))
    elem.setAttribute('download', filename)
    this.triggerEvent(elem)
    this.deleteElement(elem)
  },

  /** Trigger click event to start download.
   * @param {HTMLElement} elem - created element
   */
  triggerEvent (elem) {
    if (!elem) return
    elem.click()
  },

  /** Create a empty a element
   * @return {HTMLElement} elem
  */
  createElement () {
    let elem = document.createElement('a')
    elem.classList.add('hidden')
    document.body.appendChild(elem)
    return elem
  },

  /** Delete the created element, because there is no need to keep it.
   * @param {HTMLElement} elem - created element
   */
  deleteElement (elem) {
    if (elem) document.body.removeChild(elem)
  }
}

module.exports = downloadString
