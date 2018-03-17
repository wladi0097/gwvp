/** shift HTML creation from logic */
const newElementsHTML = {
  $packages: document.getElementById('newPackages'),
  $singleElements: document.getElementById('newSingleElements'),
  $searchElements: document.getElementById('searchElements'),

  /** Add or a package to the dom.
   * @param {elementPackage} data - a package
   * @param {HTMLElement} existing - html which should be replaced
   */
  addPackage (data) {
    this.addContainer(this.templatePackage(data.id, data.name, data.icon,
      this.templateItemCategories(data.id, data.content)))
  },

  /** Create an HTML Block with a single Package,
   * @param {String} id - a unique string sequence
   * @param {String} name - name of the package
   * @param {String} img - URL to a image of the package
   * @return {String} completed html
   */
  templatePackage (id, name, img, itemCategories) {
    return `
    <div class="new-elements-item" id=${id}>
      <div class="img">
        <img src="${img}" alt="image of ${name}">
      </div>
      <p>${name}</p>
      ${itemCategories}
    </div>
    `
  },

  /** Create an HTML Block with all Categories and their items,
   * which can be used to add dom element to the current page
   * @param {String} id - a unique string sequence
   * @param {elementPackage} data - a package
   * @param {Boolean} hidden - should it be hidden by default
   * @return {String} completed html
   */
  templateItemCategories (id, data, hidden = true) {
    let html = `<div class="new-elements-content  ${(hidden) ? '' : 'active'}" id="content-${id}">`
    for (var i = 0; i < data.length; i++) {
      html += `
      <div class="sidebar-header sidebar-element">
        <div class="sidebar-visible-header">
          <i class="fa fa-caret-down" aria-hidden="true"></i>
          <p>${data[i].name}</p>
        </div>
        <div class="items hidden">`
      let items = data[i].items
      for (var k = 0; k < items.length; k++) {
        html += this.templateItem(items[k])
      }
      html += ` </div>
        </div>`
    }
    return html
  },

  templateItem (item) {
    return `
    <div class="item html-element" item-id=${item.id}>
      <p class="help-icon">?</p>
      <div class="img">
        <img src="${item.icon}" alt="${item.name}">
      </div>
      <p class="name">${item.name}</p>
    </div>`
  },

  /** For styling reasons only 3 packages are stored in one div.
   * This Method is to check how full the current div is
   * and to append the package to the right one.
   * @param {String} htmlData - raw html
   */
  addContainer (htmlData) {
    let children = this.$packages.children
    if (children.length === 0) {
      this.$packages.innerHTML += `
      <div class="container-for-3">${htmlData}</div>
      `
      return false
    }
    let usingElements = children[children.length - 1]
    if (usingElements.children.length < 3) {
      usingElements.innerHTML += htmlData
    } else {
      this.$packages.innerHTML += `
      <div class="container-for-3">${htmlData}</div>
      `
    }
  },

  /** Display array of found items
   * @param {packageItems} items - array out of package items
   */
  displaySearch (items) {
    if (!this.$packages.parentNode.classList.contains('hide')) {
      this.$packages.parentNode.classList.add('hide')
      this.$singleElements.parentNode.classList.add('hide')
    }
    let html = ''
    items.forEach(item => {
      html += this.templateItem(item)
    })
    this.$searchElements.innerHTML = html
  },

  /** Hide the search results */
  hideSearch () {
    this.$packages.parentNode.classList.remove('hide')
    this.$singleElements.parentNode.classList.remove('hide')
    this.$searchElements.innerHTML = ''
  }
}

module.exports = newElementsHTML
