/* global describe it expect jest Event */
const packageManager = require('../packageManager')
const elementItems = require('../elementItems')
const newElementsHTML = require('../newElementsHTML')
const elementEvents = require('../../elementManipulation/elementEvents.js')

document.body.innerHTML = `
<div id="newElements"></div>
<div id="newElementsDescription"></div>
<div id="newElementsDescriptionClose"></div>
<div id="newElementsDescriptionName"></div>
<div id="newElementsDescriptionContent"></div>
<input id="elementSearch">
`

describe('init', () => {
  it('should run cacheDom, bindEvents and packageManager.init', () => {
    let copy = {...elementItems}
    copy.cacheDom = jest.fn()
    copy.bindEvents = jest.fn()
    packageManager.init = jest.fn()
    copy.init()
    expect(copy.cacheDom.mock.calls.length).toBe(1)
    expect(copy.bindEvents.mock.calls.length).toBe(1)
    expect(packageManager.init.mock.calls.length).toBe(1)
  })
})

describe('cacheDom', () => {
  it('should cache dom elements', () => {
    elementItems.cacheDom()
    expect(elementItems.$newElements).toBeDefined()
    expect(elementItems.$description).toBeDefined()
    expect(elementItems.$descriptionClose).toBeDefined()
    expect(elementItems.$descriptionName).toBeDefined()
    expect(elementItems.$descriptionContent).toBeDefined()
    expect(elementItems.$search).toBeDefined()
  })
})

describe('bindEvents', () => {
  it('should save events', () => {
    elementItems.bindEvents()
    let event = new Event('mousedown')
    elementItems.$newElements.dispatchEvent(event)
  })

  it('should catch descriptionClose', () => {
    elementItems.$description.classList.add('active')
    let event = new Event('mousedown')
    elementItems.$descriptionClose.dispatchEvent(event)
    expect(elementItems.$description.classList.contains('active')).toBe(false)
  })
})

describe('search', () => {
  it('should hide search if input empty', () => {
    newElementsHTML.hideSearch = jest.fn()
    let e = {currentTarget: {value: ''}}
    elementItems.search(e)
    expect(newElementsHTML.hideSearch.mock.calls.length).toBe(1)
  })

  it('should find and display input', () => {
    newElementsHTML.displaySearch = jest.fn()
    packageManager.find = jest.fn()
    let e = {currentTarget: {value: '1234'}}
    elementItems.search(e)
    expect(newElementsHTML.displaySearch.mock.calls.length).toBe(1)
    expect(packageManager.find.mock.calls.length).toBe(1)
  })
})

describe('dragStart', () => {
  it('should not start if html is empty', () => {
    let mock = jest.fn().mockReturnValueOnce({html: ''})
    let target = {getAttribute () { return '' }}
    packageManager.getElementById = mock
    elementEvents.dragStart = jest.fn()
    elementItems.dragStart(target)
    expect(packageManager.getElementById.mock.calls.length).toBe(1)
    expect(elementEvents.dragStart.mock.calls.length).toBe(0)
  })

  it('should run dragStart if html not empty', () => {
    let mock = jest.fn().mockReturnValueOnce({html: '123'})
    let target = {getAttribute () { return '' }}
    packageManager.getElementById = mock
    elementEvents.dragStart = jest.fn()
    elementItems.dragStart(target)
    expect(packageManager.getElementById.mock.calls.length).toBe(1)
    expect(elementEvents.dragStart.mock.calls.length).toBe(1)
  })
})

describe('showDescription', () => {
  it('should replace description info and show it', () => {
    let element = {parentNode: {getAttribute () {}}}
    let mock = jest.fn().mockReturnValueOnce({name: '123', description: 'test'})
    packageManager.getElementById = mock
    elementItems.showDescription(element)
    expect(elementItems.$descriptionName.innerHTML).toBe('123')
    expect(elementItems.$descriptionContent.innerHTML).toBe('test')
  })

  it('should display without description', () => {
    let element = {parentNode: {getAttribute () {}}}
    let mock = jest.fn().mockReturnValueOnce({name: '123'})
    packageManager.getElementById = mock
    elementItems.showDescription(element)
    expect(elementItems.$descriptionName.innerHTML).toBe('123')
    expect(elementItems.$descriptionContent.innerHTML).toBe('no description')
  })
})
