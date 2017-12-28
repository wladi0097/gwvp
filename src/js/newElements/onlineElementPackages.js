/* global XMLHttpRequest */

/** get packages from the web and add them to the "online" section. */
const onlineElementPackages = {
  /** currently selected package */
  currentData: null,
  /** current selected URL */
  currentURL: null,
  /** a elementItems instance */
  elementItems: null,
  /** already inlcuded packages */
  alreadyIncludedPackages: [],

  /** Initialize by binding events and caching dom element */
  init (elementItems) {
    this.elementItems = elementItems
    this.cacheDomEvents()
    this.cacheDomResponse()
    this.bindEvents()
  },

  /** cache all the dom elements in the for the events */
  cacheDomEvents () {
    this.$openWindow = document.getElementById('newElementsAddOnline')
    this.$fullWindow = document.getElementById('onlineElementPackages')
    this.$input = document.getElementById('onlineElementPackagesInput')
    this.$search = document.getElementById('onlineElementPackagesButton')
    this.$response = document.getElementById('onlineElementPackagesResponse')
    this.$accept = document.getElementById('onlineElementPackagesAccept')
  },

  /** bind all required events for the window */
  bindEvents () {
    // open window
    this.$openWindow.addEventListener('mousedown', (e) => {
      this.show()
    })
    // hide window
    this.$fullWindow.addEventListener('mousedown', (e) => {
      this.hide(e)
    })
    // if enter got pressed in input
    this.$input.addEventListener('keydown', (e) => {
      e.stopImmediatePropagation()
      if (e.keyCode === 13) {
        this.showPackages()
      } else {
        this.showResponse()
      }
    })
    // the input has changed
    this.$input.addEventListener('change', (e) => {
      if (e.currentTarget.value.length <= 5) {
        this.showResponse()
      }
    })
    // search button got clicked
    this.$search.addEventListener('mousedown', (e) => {
      this.showPackages()
    })
    // accept button got clicked
    this.$accept.addEventListener('mousedown', (e) => {
      this.elementItems.addPackage('Online', this.currentData)
      this.alreadyIncludedPackages.push(this.currentURL) // include url to alreadyIncludedPackages
      this.hide(true)
    })
  },

  /** show the extra window  */
  show () {
    this.$fullWindow.classList.remove('hide')
    window.setTimeout(() => {
      this.$input.focus()
    }, 0)
  },

  /** hide the extra window  */
  hide (e) {
    if (e.target === this.$fullWindow || e === true) {
      this.reset()
      this.showResponse()
      this.$fullWindow.classList.add('hide')
    }
  },

  /** reset everything to default  */
  reset () {
    this.currentData = null
    this.currentURL = null
    this.$input.value = ''
  },

  /** check the response from the AJAX request and validate it,
   * meanwhile display a loading screen
   */
  showPackages () {
    let val = this.$input.value
    this.currentURL = val
    if (this.alreadyIncludedPackages.indexOf(val) !== -1) {
      this.showResponse('error', 'Package already inlcuded')
      return
    }
    this.showResponse('load')
    this.getPackagesFromURL(val, (data, errorcode) => {
      if (data) {
        if (this.validateResponse(data)) {
          this.currentData = data
          this.showResponse('found', data)
        } else {
          this.showResponse('error', 'Validation failed')
        }
      } else {
        this.showResponse('error', errorcode)
      }
    })
  },

  /** cache all needed dom elements  for the response */
  cacheDomResponse () {
    this.$elemFound = document.getElementById('onlineElementPackages-found')
    this.$elemLoad = document.getElementById('onlineElementPackages-load')
    this.$elemLoadImg = document.getElementById('onlineElementPackages-foundImg')
    this.$elemLoadHeader = document.getElementById('onlineElementPackages-foundHeader')
    this.$elemLoadText = document.getElementById('onlineElementPackages-foundText')
    this.$elemError = document.getElementById('onlineElementPackages-error')
  },

  /** Display the Ajax response in HTML
   * @param {String} type - type of response
   * @param {String} text - extra text from the response
   */
  showResponse (type, text) {
    if (!this.$elemFound.classList.contains('hide')) this.$elemFound.classList.add('hide')
    if (!this.$elemLoad.classList.contains('hide')) this.$elemLoad.classList.add('hide')
    if (!this.$elemError.classList.contains('hide')) this.$elemError.classList.add('hide')

    switch (type) {
      case 'error':
        this.$elemError.innerHTML = text
        this.$elemError.classList.remove('hide')
        break
      case 'load':
        this.$elemLoad.classList.remove('hide')
        break
      case 'found':
        this.$elemLoadImg.src = this.cleanData(text.icon)
        this.$elemLoadHeader.innerHTML = this.cleanData(text.name)
        this.$elemLoadText.innerHTML = this.cleanData(text.description)
        this.$elemFound.classList.remove('hide')
        break
    }
  },

  /** Very simple validation if all needed elements exist
   * @param {packages} data
   */
  validateResponse (data) {
    return (data.name &&
      data.description &&
      data.icon &&
      data.content)
  },

  /** remove unwanted html tags from text
   * @param {String} text - text to format
   * @return {String} formated text
   */
  cleanData (text) {
    return text.replace(new RegExp('<', 'g'), '&lt;')
      .replace(new RegExp('>', 'g'), '&gt;')
  },

  /** A get request to a destination url via ajax
   * @param {String} url - destination url
   * @param {Callback} clbk - callback
   * @return {Callback} {response, error}
   */
  getPackagesFromURL (url, clbk) {
    let request = new XMLHttpRequest()
    request.open('GET', url, true)

    request.onload = () => {
      if (request.status >= 200 && request.status < 400) {
        let data
        try {
          if (!request.response) {
            clbk(false, 'JSON empty')
          }
          data = JSON.parse(request.response)
          clbk(data)
        } catch (e) {
          clbk(false, 'JSON not valid')
        }
      } else {
        clbk(false, 'Could not load package: ' + request.status)
      }
    }

    request.onerror = (e) => {
      clbk(false, 'Could not load package: please check your url or your connection')
    }

    request.send()
  }
}
module.exports = onlineElementPackages
