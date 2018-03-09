/* global XMLHttpRequest */

/** Send an ajax request and get the requested file or an error.  */
const ajax = {

  /** get the ajax data via callback.
   * @param {String} url - the data to download
   * @param {Function} clbk - callback with data or error
   * @param {HTMLElement} progress - sets the width to the progress
   */
  get (url, clbk, progress, mime) {
    if (!url) {
      clbk(false, 'Url empty')
      return
    }
    clbk = clbk || this.noCallback
    let request = new XMLHttpRequest()
    request.open('GET', url, true)
    if (mime) {
      request.overrideMimeType(mime)
    }

    request.onload = () => {
      this.onload(request, clbk)
    }

    request.onerror = (e) => {
      clbk(false, 'Could not load: please check your url or your connection. \n Is the <a target="_blank" href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Origin">"Access-Control-Allow-Origin"<a> header present ?')
    }

    if (progress) {
      request.onprogress = (e) => {
        this.onProgress(e, progress)
      }
    }

    request.send()
  },

  /** display the progress.
   * @param {Object} e - XMLHttpRequest progress
   * @param {HTMLElement} elem - sets the width to the progress
   */
  onProgress (e, elem) {
    if (e.lengthComputable) {
      var percent = (e.loaded / e.total) * 100
      elem.style.width = percent + '%'
      if (percent === 100) {
        elem.style.width = 0
      }
    }
  },

  /** display the progress.
   * @param {Object} request - XMLHttpRequest data
   * @param {Function} clbk - callback with data or error
   */
  onload (request, clbk) {
    if (request.status >= 200 && request.status < 400) {
      if (!request.response) {
        clbk(false, 'Answer empty')
      }
      clbk(request.response)
    } else {
      clbk(false, 'Could not load: ' + request.status)
    }
  },

  /** do nothing if callback was never given */
  noCallback () {
    // i should be empty
  }
}

module.exports = ajax
