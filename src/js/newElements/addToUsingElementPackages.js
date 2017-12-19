/** Ask the user for permission to add a package to the project */
const addToUsingElementPackages = {
  /** a elementItems instance */
  elementItems: null,
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
    // close windiw
    this.$window.addEventListener('mousedown', (e) => {
      if (e.target === this.$window) {
        this.hide()
      }
    })

    // click accept
    this.$accept.addEventListener('mousedown', (e) => {
      this.elementItems.movePackageToUsing()
      this.hide()
    })
  },
  /** toggle Visibility from each points   */
  bindToggleItemVisibilityEvent () {
    Array.from(document.getElementsByClassName('addToUsingElementPackages-hide'))
      .forEach((element) => {
        element.addEventListener('mousedown', (e) => {
          if (element.classList.contains('active')) {
            element.classList.remove('active')
          } else {
            element.classList.add('active')
          }
        })
      })
  },

  /** show the extra window  */
  show (data) {
    this.insertToHtml(data)
    this.$window.classList.remove('hide')
  },
  /** hide the extra window  */
  hide () {
    this.$window.classList.add('hide')
  },
  /** insert package data to all dom elements
   * @param {packages} data
   */
  insertToHtml (data) {
    this.$name.innerHTML = 'Package : ' + data.name
    this.$img.src = data.icon
    this.$img.alt = data.name
    this.$description.innerHTML = data.description
    this.templateDependency(this.$cssdependency, data.cssDependency, data.id, 'css')
    this.templateDependency(this.$jsdependency, data.jsDependency, data.id, 'js')
    this.$cssCode.innerHTML = data.css
    this.$jsCode.innerHTML = data.js
    this.$content.innerHTML = this.elementItems.getItemCategories(data)
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
          <td>${dependency[i].name}</td>
          <td><a target"_blank" href="${dependency[i].name}">${dependency[i].url}</a></td>
          <td class="inlcudeAs"> <input type="radio" checked name="${nameText + i}IncludeAs-${id}" value="reference"> </td>
          <td class="inlcudeAs"> <input type="radio" name="${nameText + i}IncludeAs-${id}" value="text"> </td>
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
    </tr>`
  }
}
module.exports = addToUsingElementPackages
