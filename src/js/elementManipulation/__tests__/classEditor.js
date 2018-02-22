/* global describe it expect jest Event */
const elementEditor = require('../elementEditor')
const classEditor = require('../elementEditor').classEditor
const styleManipulation = require('../styleManipulation')

document.body.innerHTML = `<div class="selector">
  <div class="mini-window active" id="classListings">
    <div class="allClasses" id="elementClasses"></div>
    <button type="button" name="button" id="addClass">Add Class</button>
  </div>
  <div class="mini-window" id="classSettings">
    <p id="selectedClassName">Classname</p>
    <button type="button" id="selectClass"></button>
    <button type="button" id="removeClass"></button>
    <button type="button" id="returnFromClass"></button>
  </div>
  <div class="mini-window front" id="addClassWindow">
    <p>Add Class by name</p>
    <br>
    <input placeholder="Classname" id="addClassInput">
  </div>
  <div class="mini-window front" id="usingClass">
    <p>Editing</p>
    <br>
    <p id="usingClassName">Classname</p>
  </div>
</div>`

describe('init', () => {
  it('should run cacheDom and bindEvents', () => {
    let copy = {...classEditor}
    copy.cacheDom = jest.fn()
    copy.bindEvents = jest.fn()
    copy.init()
    expect(copy.cacheDom.mock.calls.length).toBe(1)
    expect(copy.bindEvents.mock.calls.length).toBe(1)
  })
})

describe('cacheDom', () => {
  it('caches all elements', () => {
    classEditor.cacheDom()
    expect(classEditor.$classListings).toBeTruthy()
    expect(classEditor.$classes).toBeTruthy()
  })
})

describe('bindEvents', () => {
  // requires cacheDom
  it('should trigger mousedown', () => {
    let copy = {...classEditor}
    copy.cacheDom()
    let event = new Event('mousedown')

    copy.selectClassToEdit = jest.fn()
    copy.remove = jest.fn()
    copy.returnBack = jest.fn()
    copy.showAddClass = jest.fn()

    copy.bindEvents()
    copy.$selectClass.dispatchEvent(event)
    copy.$removeClass.dispatchEvent(event)
    copy.$returnFromClass.dispatchEvent(event)
    copy.$addClass.dispatchEvent(event)
    expect(copy.selectClassToEdit.mock.calls.length).toBe(1)
    expect(copy.remove.mock.calls.length).toBe(1)
    expect(copy.returnBack.mock.calls.length).toBe(1)
    expect(copy.showAddClass.mock.calls.length).toBe(1)
  })

  it('should trigger change', () => {
    let copy = {...classEditor}
    copy.cacheDom()
    let event = new Event('change')
    copy.addClass = jest.fn()
    copy.bindEvents()
    copy.$addClassInput.dispatchEvent(event)
    expect(copy.addClass.mock.calls.length).toBe(1)
  })
})

describe('select', () => {
  it('should reset cssClass', () => {
    let copy = {...classEditor}
    copy.cssClass = 'stuff'
    copy.hideAllandShow = jest.fn()
    copy.displayAviableClasses = jest.fn()
    copy.select()
    expect(copy.cssClass).toBe(null)
  })
})

describe('createClassStyle', () => {
  it('should create a div with the given class', () => {
    elementEditor.$iframe = document
    let copy = {...classEditor}
    copy.cssClass = 'test123'
    copy.createClassStyle()
    expect(copy.styleClass.classList.contains('test123')).toBe(true)
    copy.styleClass.remove()
  })
})

describe('getStyleClass', () => {
  it('should return the style from the created class', () => {
    styleManipulation.getStyle = jest.fn()
    classEditor.getStyleClass()
    expect(styleManipulation.getStyle.mock.calls.length).toBe(1)
  })
})

describe('removeStyleClass', () => {
  it('should remove the styleClass element', () => {
    let temp = document.createElement('div')
    classEditor.styleClass = temp
    classEditor.removeStyleClass()
    expect(classEditor.styleClass).toBe(null)
  })
})

describe('displayAviableClasses', () => {
  it('should fill $classes with elements named after classes', () => {
    let c = {getAttribute () { return 'test1 test2' }}
    classEditor.displayAviableClasses(c)
    expect(classEditor.$classes.innerHTML).toBe('<p class="item">test1</p><p class="item">test2</p>')
  })
})

describe('hideAllandShow', () => {
  it('should hide all expect the given param', () => {
    classEditor.hideAllandShow(classEditor.$classListings)
    expect(classEditor.$classListings.classList.contains('active')).toBe(true)
    expect(classEditor.$classSettings.classList.contains('active')).toBe(false)
    expect(classEditor.$addClassWindow.classList.contains('active')).toBe(false)
    expect(classEditor.$usingClass.classList.contains('active')).toBe(false)
  })
})

describe('returnBack', () => {
  it('should run hideAllandShow', () => {
    let copy = {...classEditor}
    copy.hideAllandShow = jest.fn()
    copy.returnBack()
    expect(copy.hideAllandShow.mock.calls.length).toBe(1)
  })
})

describe('clicked', () => {
  it('should save the clicked element', () => {
    let copy = {...classEditor}
    copy.hideAllandShow = jest.fn()
    copy.clicked({innerHTML: 'test'})
    expect(copy.clickedClass).toBe('test')
    expect(copy.$selectedClassName.innerHTML).toBe('test')
  })
})

describe('remove', () => {
  it('should remove a class', () => {
    document.body.innerHTML += '<div id="removeMe" class="test"></div>'
    let elem = document.getElementById('removeMe')
    let copy = {...classEditor}
    copy.clickedClass = 'test'
    copy.displayAviableClasses = jest.fn()
    copy.hideAllandShow = jest.fn()
    elementEditor.selectedItem = elem
    copy.remove()
    expect(elem.classList.contains('test')).toBe(false)
  })
})

describe('selectClassToEdit', () => {
  it('should save the classname and display it', () => {
    let copy = {...classEditor}
    copy.clickedClass = 'test'
    copy.hideAllandShow = jest.fn()
    elementEditor.setStyles = jest.fn()
    copy.selectClassToEdit()
    expect(copy.cssClass).toBe('test')
    expect(copy.$usingClassName.innerHTML).toBe('test')
  })
})

describe('showAddClass', () => {
  it('should run hideAllandShow', () => {
    let copy = {...classEditor}
    copy.hideAllandShow = jest.fn()
    copy.showAddClass()
    expect(copy.hideAllandShow.mock.calls.length).toBe(1)
  })
})

describe('addClass', () => {
  it('should add a class to the current element', () => {
    document.body.innerHTML += '<div id="gimmeClass" class=""></div>'
    let elem = document.getElementById('gimmeClass')
    let copy = {...classEditor}
    copy.displayAviableClasses = jest.fn()
    copy.hideAllandShow = jest.fn()
    elementEditor.selectedItem = elem
    let e = {currentTarget: {value: 'test'}}
    copy.addClass(e)
    expect(elem.classList.contains('test')).toBe(true)
  })
})
