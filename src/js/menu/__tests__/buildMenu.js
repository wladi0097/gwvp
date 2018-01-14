/* global describe it expect jest */
const $ = require('jquery')
window.$ = $
const buildMenu = require('../buildMenu.js')
const m = {
  simple: {
    id: '1',
    name: 'test',
    icon: 'a'
  },
  delimiter: {
    delimiter: true
  },
  noIcon: {
    id: '1',
    name: 'test'
  },
  noId: {
    name: 'test',
    icon: ''
  },
  underItem: {
    name: 'test',
    icon: '',
    underItems: [{
      name: 'test2'
    }]
  },
  itemWithclickTrue: {
    id: 'ict',
    name: 'test',
    icon: '',
    clickable () { return true }
  },
  itemWithclickFalse: {
    id: 'icf',
    name: 'test',
    icon: '',
    clickable () { return false }
  },
  itemWithactiveTrue: {
    id: 'iat',
    name: 'test',
    icon: '',
    clickable () { return true }
  },
  itemWithactiveFalse: {
    id: 'iaf',
    name: 'test',
    icon: '',
    clickable () { return false }
  }
}

$('body').html(`<div class="header">
  <div class="header-items"></div>
</div>`)

const bm = buildMenu.buildMenu
// ------------------------------

describe('includeMenuItemStart', () => {
  it('should fill the html', () => {
    let isHTML = bm.html
    bm.includeMenuItemStart(m.simple)
    expect(isHTML).not.toBe(bm.html)
  })

  it('html should be string', () => {
    expect(typeof bm.html).toBe('string')
  })
})

describe('includeMenuItemEnd', () => {
  it('should fill the html', () => {
    let isHTML = bm.html
    bm.includeMenuItemEnd(m.simple)
    expect(isHTML).not.toBe(bm.html)
  })

  it('html should be string', () => {
    bm.html = ''
    expect(typeof bm.html).toBe('string')
  })
})

describe('includeMenuComponent', () => {
  it('should run without errors', () => {
    bm.includeMenuComponent(m.simple)
    expect(bm.html).not.toBe('')
  })
})

describe('includeMenuComponentHTML', () => {
  it('should make a delimiter', () => {
    bm.html = ''
    bm.includeMenuComponentHTML(m.delimiter)
    expect(bm.html).toBe('<li class="option-delimiter"></li>')
  })

  it('should work without an icon', () => {
    bm.html = ''
    bm.includeMenuComponentHTML(m.noIcon)
    expect(bm.html).not.toMatch('fa-')
  })

  it('should work without an id', () => {
    bm.html = ''
    bm.includeMenuComponentHTML(m.noId)
    expect(bm.html).not.toMatch('id=""')
  })

  it('should work with an underItem', () => {
    bm.html = ''
    bm.includeMenuComponentHTML(m.underItem)
    expect(bm.html).toMatch('<ul')
  })
})

describe('append', () => {
  it('should fill the dom element with the html value', () => {
    bm.$headerItems = document.getElementsByClassName('header-items')[0]
    bm.html = '111'
    bm.append()
    expect(document.getElementsByClassName('header-items')[0].innerHTML).toBe('111')
  })
})

describe('build', () => {
  it('should build the whole json to the dom element', () => {
    // uses menuItems.js
    document.getElementsByClassName('header-items')[0].innerHTML = ''
    bm.html = ''
    buildMenu.build(null)
    expect(document.getElementsByClassName('header-items')[0].innerHTML).not.toBe(null)
  })
})

describe('states includeMenuComponentState', () => {
  it('should not fill the state array with an item without an state', () => {
    bm.itemsWithStates = []
    bm.includeMenuComponentState(m.simple)
    expect(bm.itemsWithStates.length).toBe(0)
  })
  it('should add an clickable and active state', () => {
    bm.itemsWithStates = []
    bm.includeMenuComponentState(m.itemWithclickTrue)
    bm.includeMenuComponentState(m.itemWithclickFalse)
    bm.includeMenuComponentState(m.itemWithactiveTrue)
    bm.includeMenuComponentState(m.itemWithactiveFalse)
    expect(bm.itemsWithStates.length).toBe(4)
  })
})

describe('states setItemStateCss', () => {
  it('should add css with false', () => {
    document.body.innerHTML = '<div id="test"></div>'
    let elem = document.getElementById('test')
    bm.setItemStateCss(elem, 'boi', false)
    expect(elem.classList.contains('boi')).toBe(true)
  })
  it('should remove css with true', () => {
    document.body.innerHTML = '<div id="test" class="boi"></div>'
    let elem = document.getElementById('test')
    bm.setItemStateCss(elem, 'boi', true)
    expect(elem.classList.contains('boi')).toBe(false)
  })
})

describe('states checkItemStates', () => {
  it('should run setItemState with disabled and inActive', () => {
    let copy = {...bm}
    copy.itemsWithStates = []
    copy.setItemStateCss = jest.fn()
    copy.includeMenuComponentState(m.itemWithclickTrue)
    copy.includeMenuComponentState(m.itemWithactiveTrue)
    copy.checkItemStates()
    expect(copy.setItemStateCss.mock.calls.length).toBe(2)
  })
})

describe('get keycodes', () => {
  it('should return an array with keycodes', () => {
    let keys = buildMenu.getKeyCodes()
    expect(keys).not.toBe(null)
  })
})
