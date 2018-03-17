/* global describe it expect jest */
const packageManager = require('../packageManager')
const newElementsHTML = require('../newElementsHTML')

describe('init', () => {
  it('should run bindEvents and add basic items', () => {
    let copy = {...packageManager}
    copy.bindEvents = jest.fn()
    copy.addAll = jest.fn()
    copy.init()
    expect(copy.bindEvents.mock.calls.length).toBe(1)
    expect(copy.addAll.mock.calls.length).toBe(1)
  })
})

describe('add', () => {
  it('should run handOutIds, addPackage and updateCurrentItems', () => {
    let copy = {...packageManager}
    copy.handOutIds = jest.fn()
    copy.updateCurrentItems = jest.fn()
    newElementsHTML.addPackage = jest.fn()
    copy.add()
    expect(copy.handOutIds.mock.calls.length).toBe(1)
    expect(copy.updateCurrentItems.mock.calls.length).toBe(1)
    expect(newElementsHTML.addPackage.mock.calls.length).toBe(1)
  })

  it('should fill packages array', () => {
    let copy = {...packageManager}
    copy.packages = []
    copy.handOutIds = jest.fn()
    copy.updateCurrentItems = jest.fn()
    newElementsHTML.addPackage = jest.fn()
    copy.add(123)
    expect(copy.packages[0]).toBe(123)
  })
})

describe('handOutIds', () => {
  it('should give each element an id', () => {
    let ePackage = {content: []}
    packageManager.handOutIds(ePackage)
    expect(ePackage.id).toBeDefined()
  })

  it('should give each item in content an id', () => {
    let ePackage = {content: [{ items: [{}] }]}
    packageManager.handOutIds(ePackage)
    expect(ePackage.content[0].items[0].id).toBeDefined()
  })
})

describe('updateCurrentItems', () => {
  it('should clear currentItems', () => {
    packageManager.currentItems = [123]
    packageManager.packages = []
    packageManager.updateCurrentItems()
    expect(packageManager.currentItems[0]).toBe()
  })

  it('should move each element from package and put it into currentItems', () => {
    packageManager.currentItems = []
    packageManager.packages = [{content: [{ items: [{id: 1}] }]}]
    packageManager.updateCurrentItems()
    expect(packageManager.currentItems[0]).toEqual({id: 1})
  })
})

describe('getElementById', () => {
  it('should return element by id', () => {
    packageManager.currentItems = [{id: 1}]
    expect(packageManager.getElementById(1)).toEqual({id: 1})
  })

  it('should return element by id', () => {
    packageManager.currentItems = [{id: 123, name: 'test'}]
    expect(packageManager.getElementById(123)).toEqual({id: 123, name: 'test'})
  })
})

describe('find', () => {
  it('should not find if not exist', () => {
    packageManager.currentItems = [{id: 123, name: 'test', description: '23'}]
    expect(packageManager.find('cannot find')).toEqual([])
  })

  it('should find by name', () => {
    packageManager.currentItems = [{id: 123, name: 'test', description: '23'}]
    expect(packageManager.find('te')).toEqual([{id: 123, name: 'test', description: '23'}])
  })

  it('should find by description', () => {
    packageManager.currentItems = [{id: 123, name: 'test', description: '23'}]
    expect(packageManager.find('23')).toEqual([{id: 123, name: 'test', description: '23'}])
  })
})

describe('bindEvents', () => {
  document.body.innerHTML = `
  <div id="newPackages">
    <p class="new-elements-item">
      <p class="new-elements-content">
        <p class="sidebar-visible-header">
          <p class="html-element">
            <p class="help-icon"></p>
          </p>
        </p>
      </p>
    </p>
  </div>`
  packageManager.bindEvents()
})
