/* global XMLHttpRequest alert */
/** Ask the user for permission to add a package to the project */
const addToUsingElementPackages = {
  /** a elementItems instance */
  elementItems: null,
  /** package data   */
  currentPackage: null,
  /** Initialize by binding events and caching dom element */
  init (elementItems) {
    this.elementItems = elementItems
    this.cacheDom()
    this.bindEvents()
    this.bindToggleItemVisibilityEvent()
  },

  /** cache all needed dom elements */
  cacheDom () {
    this.$window = document.getElementById('addToUsingElementPackages')
    this.$loader = document.getElementById('addToUsingElementPackages-loading')
    this.$name = document.getElementById('addToUsingElementPackages-name')
    this.$img = document.getElementById('addToUsingElementPackages-img')
    this.$description = document.getElementById('addToUsingElementPackages-description')
    this.$cssdependency = document.getElementById('addToUsingElementPackages-cssdependency')
    this.$jsdependency = document.getElementById('addToUsingElementPackages-jsdependency')
    this.$cssCode = document.getElementById('addToUsingElementPackages-cssCode')
    this.$jsCode = document.getElementById('addToUsingElementPackages-jsCode')
    this.$content = document.getElementById('addToUsingElementPackages-content')
    this.$accept = document.getElementById('addToUsingElementPackages-accept')
  },

  /** bind all needed events */
  bindEvents () {
    // close window
    this.$window.addEventListener('mousedown', (e) => {
      if (e.target === this.$window) {
        this.hide()
        this.currentPackage = null
      }
    })

    // click accept
    this.$accept.addEventListener('mousedown', (e) => {
      this.acceptPackage()
    })
  },

  /** show the extra window  */
  show (data) {
    this.currentPackage = data
    this.insertToHtml()
    this.$window.classList.remove('hide')
  },
  /** hide the extra window  */
  hide () {
    this.$window.classList.add('hide')
  },

  showLoading () {
    this.$loader.classList.add('active')
  },

  hideLoading () {
    this.$loader.classList.remove('active')
  },

  /** If a user accepts the package load all dependencies and hide the window  */
  acceptPackage () {
    this.showLoading()
    let _this = this
    let headHtml, bodyHtml
    this.getDependencyHtml(this.currentPackage, 'css', this).then(html => {
      headHtml = html
      return this.getDependencyHtml(_this.currentPackage, 'js', _this)
    }).then(html => {
      bodyHtml = html
      _this.insertHtmlToIframe(headHtml, bodyHtml)
      _this.elementItems.movePackageToUsing()
      _this.hideLoading()
      _this.hide()
    }).catch(error => {
      _this.hideLoading()
      _this.hide()
      alert(error.message)
    })
  },

  /** Insert the html to the iframe  */
  insertHtmlToIframe (headHtml, bodyHtml) {
    let iframe = this.elementItems.elementEvents.$iframe
    iframe.head.innerHTML += (headHtml + this.inlcudeAsTextTemplate(this.currentPackage.id, 'main', 'css', this.currentPackage.css))
    iframe.body.innerHTML += (bodyHtml + this.inlcudeAsTextTemplate(this.currentPackage.id, 'main', 'js', this.currentPackage.js))
  },

  /** Adds the whole dependency to the iframe.
   * if the dependency gets added by text,
   * download it with a promise chain and return the whole HTML.
   * @param {elementPackage} packageData - the package to allow
   * @param {String} depType - either css or js
   * @param {this} _this - its this
   * @return {Promise} with html data
   */
  getDependencyHtml: (packageData, depType, _this) => new Promise((resolve, reject) => {
    let html = ''
    let promiseChain = []
    let dep = (depType === 'css') ? packageData.cssDependency : packageData.jsDependency
    for (var i = 0; i < dep.length; i++) {
      let val = document.querySelector(`input[name="${depType + i}IncludeAs-${packageData.id}"]:checked`).value
      switch (val) {
        case 'reference':
          html += _this.inlcudeAsReferenceTemplate(packageData.id, dep[i], depType)
          break
        case 'text':
          promiseChain.push(_this.downloadDependency(dep[i]))
          break
      }
    }
    if (promiseChain.length > 0) {
      Promise.all(promiseChain).then(data => {
        for (var i = 0; i < data.length; i++) {
          html += _this.inlcudeAsTextTemplate(packageData.id, data[i].dependency.name, depType, data[i].response)
        }
        resolve(html)
      }).catch(error => reject(error))
    } else {
      resolve(html)
    }
  }),

  /** Includes the dependency as simple url
   * @param {String} packageID - the package id
   * @param {dependencyObject} dependency - a single dependency
   * @param {String} depType - either css or js
   */
  inlcudeAsReferenceTemplate (packageID, dependency, depType) {
    if (depType === 'css') {
      return `<link packageID='${packageID}' depName='${dependency.name}' rel="stylesheet" href="${dependency.url}">`
    } else if (depType === 'js') {
      return `<script packageID='${packageID}' depName='${dependency.name}' src="${dependency.url}" charset="utf-8"></script>`
    }
  },

  /** Includes the dependency as downloaded text
   * @param {String} packageID - the package id
   * @param {dependencyObject} dependency - a single dependency
   * @param {String} depType - either css or js
   */
  inlcudeAsTextTemplate (packageID, depName, depType, data) {
    if (depType === 'css') {
      return `<style packageID='${packageID}' depName='${depName}'>${data}</style>`
    } else if (depType === 'js') {
      return `<script packageID='${packageID}' depName='${depName}'charset="utf-8">${data}</script>`
    }
  },

  /** Download dependency text
   * @param {String} url - url of dependency
   * @param {Callback} clbk - callback with the data as String
   * @return {Promise} with html data and dependency
   */
  downloadDependency: (dependency) => new Promise((resolve, reject) => {
    let request = new XMLHttpRequest()
    request.open('GET', dependency.url, true)
    request.onload = () => {
      if (request.status >= 200 && request.status < 400) {
        resolve({response: request.response, dependency: dependency})
      } else {
        reject(new Error('dependency bad request'))
      }
    }
    request.onerror = (e) => {
      reject(new Error('error downloading dependency'))
    }
    request.send()
  }),

  /** toggle Visibility from each points   */
  bindToggleItemVisibilityEvent () {
    Array.from(document.getElementsByClassName('addToUsingElementPackages-hide'))
      .forEach((element) => {
        element.addEventListener('mousedown', (e) => {
          element.classList.toggle('active')
        })
      })
  },

  /** insert package data to all dom elements
   * @param {elementPackage} data
   */
  insertToHtml () {
    let data = this.currentPackage
    this.$name.innerHTML = 'Package : ' + this.cleanData(data.name)
    this.$img.src = this.cleanData(data.icon)
    this.$img.alt = this.cleanData(data.name)
    this.$description.innerHTML = this.cleanData(data.description)
    this.templateDependency(this.$cssdependency, data.cssDependency, data.id, 'css')
    this.templateDependency(this.$jsdependency, data.jsDependency, data.id, 'js')
    this.$cssCode.innerHTML = this.cleanData(data.css)
    this.$jsCode.innerHTML = this.cleanData(data.js)
    this.$content.innerHTML = this.elementItems.getItemCategories(data)
  },

  /** remove unwanted html tags from text
   * @param {String} text - text to format
   * @return {String} formated text
   */
  cleanData (text) {
    return text.replace(new RegExp('<', 'g'), '&lt;')
      .replace(new RegExp('>', 'g'), '&gt;')
  },

  /**
   * create a table with the template dependencies
   * @param {HTMLElement} domElement - append the table to this
   * @param {dependencyObject} dependency - url and name of the dependency
   * @param {String} id - object id
   * @param {String} nameText - custom tect for radiobutton names
   */
  templateDependency (domElement, dependency, id, nameText) {
    domElement.innerHTML = '<td>none</td>'
    if (dependency.length > 0) {
      this.resetependency(domElement)
      for (var i = 0; i < dependency.length; i++) {
        domElement.innerHTML += `  <tr>
          <td>${this.cleanData(dependency[i].name)}</td>
          <td><a target"_blank" href="${this.cleanData(dependency[i].name)}">${this.cleanData(dependency[i].url)}</a></td>
          <td class="inlcudeAs"> <input type="radio" checked name="${nameText + i}IncludeAs-${id}" value="reference"> </td>
          <td class="inlcudeAs"> <input type="radio" name="${nameText + i}IncludeAs-${id}" value="text"> </td>
          <td class="inlcudeAs"> <input type="radio" name="${nameText + i}IncludeAs-${id}" value="none"> </td>
        </tr>`
      }
    }
  },

  /** Set the table header to default
   * @return {String} html
   */
  resetependency (domElement) {
    domElement.innerHTML = `<tr>
      <th>Name of dependency</th>
      <th>Url of dependency</th>
      <th>Inlcude as reference</th>
      <th>Inlcude as text</th>
      <th>Don't include</th>
    </tr>`
  }
}
module.exports = addToUsingElementPackages
