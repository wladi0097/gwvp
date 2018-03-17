/* global describe it expect jest */
const newElementsHTML = require('../newElementsHTML')

document.body.innerHTML = '<div id="parent"><div id="newPackages"></div> <div id="newSingleElements"></div> <div id="searchElements"></div></div>'

describe('templateItemCategories', () => {
  it('should return empty with id', () => {
    expect(newElementsHTML.templateItemCategories(0, [])).toMatch(`id="content-0">`)
  })

  it('should create Categories', () => {
    let cat = [{name: 'test', items: []}]
    expect(newElementsHTML.templateItemCategories(0, cat)).toMatch(`<p>test</p>`)
  })

  it('should run templateItem when items are present', () => {
    let copy = {...newElementsHTML}
    copy.templateItem = jest.fn()
    let cat = [{name: 'test', items: [1, 2]}]
    copy.templateItemCategories(0, cat)
    expect(copy.templateItem.mock.calls.length).toBe(2)
  })

  it('should not hide Categories if hidden is false', () => {
    expect(newElementsHTML.templateItemCategories(0, [], false)).not.toMatch(`hidden`)
  })
})

describe('templateItem', () => {
  it('should return all values with undefined', () => {
    expect(newElementsHTML.templateItem({})).toMatch('undefined')
  })

  it('should not return all values with undefined', () => {
    expect(newElementsHTML.templateItem({id: 1, icon: 1, name: 1})).not.toMatch('undefined')
  })
})

describe('templatePackage', () => {
  it('should fill with wanted items', () => {
    expect(newElementsHTML.templatePackage('1', 'name', 'imgg', 'boi')).not.toMatch('undefined')
  })
})

describe('addContainer', () => {
  it('should create new div', () => {
    newElementsHTML.$packages = document.getElementById('newPackages')
    newElementsHTML.$packages.innerHTML = ''
    newElementsHTML.addContainer('<div>test</div>')
    expect(newElementsHTML.$packages.innerHTML).toMatch('<div>test</div>')
  })

  it('should insert into existing div', () => {
    newElementsHTML.$packages = document.getElementById('newPackages')
    newElementsHTML.$packages.innerHTML = ''
    newElementsHTML.addContainer('<div>test</div>')
    newElementsHTML.addContainer('<div>test</div>')
    expect(newElementsHTML.$packages.innerHTML).toMatch('<div>test</div><div>test</div>')
  })

  it('should created a new div if more then 3 elements are inside one already', () => {
    newElementsHTML.$packages = document.getElementById('newPackages')
    newElementsHTML.$packages.innerHTML = ''
    newElementsHTML.addContainer('<div>test</div>')
    newElementsHTML.addContainer('<div>test</div>')
    newElementsHTML.addContainer('<div>test</div>')
    newElementsHTML.addContainer('<div>test</div>')
    expect(newElementsHTML.$packages.innerHTML).toMatch('<div>test</div><div>test</div><div>test</div>')
    expect(newElementsHTML.$packages.innerHTML).not.toMatch('<div>test</div><div>test</div><div>test</div><div>test</div>')
  })
})

describe('displaySearch', () => {
  it('should hide packages and singleElements', () => {
    newElementsHTML.$packages = document.getElementById('newPackages')
    newElementsHTML.$singleElements = document.getElementById('newSingleElements')
    newElementsHTML.$searchElements = document.getElementById('searchElements')
    newElementsHTML.displaySearch([])
    expect(newElementsHTML.$packages.parentNode.classList.contains('hide')).toBe(true)
  })

  it('should fill search html', () => {
    newElementsHTML.displaySearch([{}])
    expect(newElementsHTML.$searchElements.innerHTML).not.toBe('')
  })
})

describe('hideSearch', () => {
  it('should show packages and singleElements', () => {
    newElementsHTML.hideSearch()
    expect(newElementsHTML.$singleElements.parentNode.classList.contains('hide')).toBe(false)
  })
  it('should clean searchElements innerHTML', () => {
    newElementsHTML.$searchElements.innerHTML = '123'
    newElementsHTML.hideSearch()
    expect(newElementsHTML.$searchElements.innerHTML).toBe('')
  })
})

describe('addPackage', () => {
  it('should run addContainer templatePackage templateItemCategories', () => {
    let copy = {...newElementsHTML}
    copy.addContainer = jest.fn()
    copy.templatePackage = jest.fn()
    copy.templateItemCategories = jest.fn()
    copy.addPackage({id: 1, name: 'test', icon: 'no', content: 'no'})
    expect(copy.addContainer.mock.calls.length).toBe(1)
    expect(copy.templatePackage.mock.calls.length).toBe(1)
    expect(copy.templateItemCategories.mock.calls.length).toBe(1)
  })
})
