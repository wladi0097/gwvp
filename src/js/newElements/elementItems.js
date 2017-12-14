const basicElementItems = require('./basicItems')
const elementItems = {
  /** requires elementEvents to drag elements */
  elementEvents: null,
  currentOpenTarget: null,

  init (elementEvents) {
    this.elementEvents = elementEvents
    elementItemsHTML.addUsingCategory(basicElementItems)
    this.bindUsingEvents()
  },

  bindUsingEvents () {
    let all = document.getElementById('sidebar-basic')
    all.addEventListener('mousedown', (e) => {
      let item = e.target.closest('.html-element')
      if (item) {
        this.dragStart(item)
      }

      let itemCategory = e.target.closest('.sidebar-visible-header')
      if (itemCategory) {
        this.toggleClass(itemCategory)
        return
      }

      let contentContainer = e.target.closest('.newElements-content')
      if (contentContainer) {
        return
      }

      let bigCategory = e.target.closest('.newElements-item')
      if (bigCategory) {
        this.showBigCategory(bigCategory)
      }
    })
  },

  showBigCategory (category) {
    this.hideBigCategories()
    if (this.currentOpenTarget === category) {
      this.currentOpenTarget = null
      return
    }
    let content = document.getElementById('content-' +
      category.getAttribute('id'))
    category.classList.add('active')
    content.classList.remove('hidden')

    this.currentOpenTarget = category
  },

  hideBigCategories () {
    Array.from(document.getElementsByClassName('newElements-item'))
      .forEach((element) => {
        if (element.classList.contains('active')) {
          element.classList.remove('active')
        }
      })
    Array.from(document.getElementsByClassName('newElements-content'))
      .forEach((element) => {
        if (!element.classList.contains('hidden')) {
          element.classList.add('hidden')
        }
      })
  },

  toggleClass (target) {
    let item = target.nextElementSibling
    if (item.classList.contains('hidden')) {
      item.classList.remove('hidden')
    } else {
      item.classList.add('hidden')
    }
  },

  dragStart (target) {
    let html = unescape(target.getAttribute('html'))
    this.elementEvents.dragStart(html)
  }
}
module.exports = elementItems

const elementItemsHTML = {
  $using: document.getElementById('newElementsUsing'),
  $official: document.getElementById('newElementsOfficial'),
  $online: document.getElementById('newElementsOnline'),

  templateBigCategory (id, name, img) {
    return `
    <div class="newElements-item" id=${id}>
      <div class="img">
        <img src="${img}" alt="image of ${name}">
      </div>
      <p>${name}</p>
    </div>
    `
  },

  templateItemCategories (id, data) {
    let html = `<div class="newElements-content hidden" id="content-${id}">`
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
        html += `
        <div class="item html-element" html=${escape(items[k].html)}>
          <p class="helpIcon">?</p>
          <div class="img">
            <img src="${items[k].icon}" alt="${items[k].name}">
          </div>
          <p class="name">${items[k].name}</p>
          <div class="helpText">
            <p>${items[k].info}</p>
            <button>Close</button>
          </div>
        </div>`
      }
      html += ` </div>
        </div>`
    }
    return html
  },

  addUsingCategory (data, existing) {
    if (existing) {
      let old = existing.outerhtml
      this.$using.innerHTML += old
      old = ''
    } else {
      this.$using.innerHTML +=
        this.templateBigCategory(data.id, data.name, data.icon)
    }
    document.getElementById(data.id).innerHTML +=
      this.templateItemCategories(data.id, data.content)
  },

  addOnlineCategory (data) {

  }
}
