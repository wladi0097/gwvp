/* global $ */
const basicElementItems = require('./basicItems')
const elementItems = {
  elementEvents: null,
  iconShow: 'fa fa-caret-down',
  iconHide: 'fa fa-caret-right',
  init (elementEvents) {
    this.elementEvents = elementEvents
    this.cacheDom()
    this.buildHtml()
    this.bindEvents()
  },
  cacheDom () {
    this.$basicDomElement = $('.sidebar-basic')
  },
  bindEvents () {
    $('.sidebar-visible-header').on('click', (e) => {
      let sibling = $(e.currentTarget).siblings()
      this.toggleClass(sibling, 'hidden')
    })
    $('.html-element').on('mousedown', (e) => {
      let html = unescape($(e.currentTarget).data('html'))
      this.elementEvents.dragStart(html)
    })
  },
  toggleClass (item, Class) {
    if (item.hasClass('hidden')) {
      item.removeClass('hidden')
    } else {
      item.addClass('hidden')
    }
  },
  buildHtml () {
    let html = ''
    for (var i = 0; i < basicElementItems.length; i++) {
      // header
      html += `
      <div class="sidebar-header sidebar-elements">
        <div class="sidebar-visible-header">
          <i class="${this.iconShow}" aria-hidden="true"></i>
          <p>${basicElementItems[i].name}</p>
        </div>
        <div class="items hidden">`
      let items = basicElementItems[i].items
      for (var k = 0; k < items.length; k++) {
        html += `
        <div class="item html-element" data-html=${escape(items[k].html)}>
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
      html += `</div>
      </div>`
    }
    this.$basicDomElement.append(html)
  }
}
module.exports = elementItems
