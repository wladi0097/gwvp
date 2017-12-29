/* global describe it expect */
const $ = require('jquery')
window.$ = $
const buildMenu = require('../buildMenu.js')

$('body').html(`<div class="header">
  <div class="header-items"></div>
</div>`)

const simpleItem = {
  id: '1',
  name: 'test',
  icon: 'a'
}

describe('includeMenuItemStart', () => {
  let isHTML = buildMenu.buildMenu.html
  it('should fill the html', () => {
    buildMenu.buildMenu.includeMenuItemStart(simpleItem)
    expect(isHTML).not.toBe(buildMenu.buildMenu.html)
  })

  it('html should be string', () => {
    expect(typeof buildMenu.buildMenu.html).toBe('string')
  })
})

describe('includeMenuItemEnd', () => {
  buildMenu.buildMenu.html = ''
  let isHTML = buildMenu.buildMenu.html
  it('should fill the html', () => {
    buildMenu.buildMenu.includeMenuItemEnd(simpleItem)
    expect(isHTML).not.toBe(buildMenu.buildMenu.html)
  })

  it('html should be string', () => {
    buildMenu.buildMenu.html = ''
    expect(typeof buildMenu.buildMenu.html).toBe('string')
  })
})

describe('includeMenuComponent', () => {
  it('should run without errors', () => {
    buildMenu.buildMenu.includeMenuComponent(simpleItem)
  })
})

describe('includeMenuComponentHTML', () => {
  it('should make a delimiter', () => {
    const item1 = {
      delimiter: true
    }
    buildMenu.buildMenu.html = ''
    buildMenu.buildMenu.includeMenuComponentHTML(item1)
    expect(buildMenu.buildMenu.html).toBe('<li class="option-delimiter"></li>')
  })

  it('should work without an icon', () => {
    const item2 = {
      id: '1',
      name: 'test'
    }
    buildMenu.buildMenu.html = ''
    buildMenu.buildMenu.includeMenuComponentHTML(item2)
    expect(buildMenu.buildMenu.html).not.toMatch('fa-')
  })

  it('should work without an id', () => {
    const item2 = {
      name: 'test',
      icon: ''
    }
    buildMenu.buildMenu.html = ''
    buildMenu.buildMenu.includeMenuComponentHTML(item2)
    expect(buildMenu.buildMenu.html).toMatch('id=""')
  })

  it('should work with an underItem', () => {
    const item2 = {
      name: 'test',
      icon: '',
      underItems: [{
        name: 'test2'
      }]
    }
    buildMenu.buildMenu.html = ''
    buildMenu.buildMenu.includeMenuComponentHTML(item2)
    expect(buildMenu.buildMenu.html).toMatch('<ul')
  })
})

describe('append', () => {
  it('should fill the dom element with the html value', () => {
    buildMenu.buildMenu.$headerItems = document.getElementsByClassName('header-items')[0]
    buildMenu.buildMenu.html = '111'
    buildMenu.buildMenu.append()
    expect(document.getElementsByClassName('header-items')[0].innerHTML).toBe('111')
  })
})

describe('build', () => {
  it('should build the whole json to the dom element', () => {
    document.getElementsByClassName('header-items')[0].innerHTML = ''
    buildMenu.buildMenu.html = ''
    buildMenu.build(null)
    expect(document.getElementsByClassName('header-items')[0].innerHTML).not.toBe('')
  })
})
