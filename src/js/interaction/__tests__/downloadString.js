/* global describe expect it jest */
const downloadString = require('../downloadString')

describe('createElement', () => {
  it('should create a empty a element with the class hidden', () => {
    downloadString.createElement()
    expect(document.body.innerHTML).toBe('<a class="hidden"></a>')
  })
})

describe('deleteElement', () => {
  it('should delete the given element', () => {
    document.body.innerHTML = '<a id="test"></a>'
    let elem = document.getElementById('test')
    expect(elem).toBeDefined()
    downloadString.deleteElement(elem)
    expect(document.body.innerHTML).toBe('')
  })

  it('should do nothing if nothing is passed', () => {
    document.body.innerHTML = '<a id="test"></a>'
    downloadString.deleteElement()
    expect(document.body.innerHTML).toBe('<a id="test"></a>')
  })
})

describe('triggerEvent', () => {
  it('should trigger the given element', () => {
    document.body.innerHTML = '<a id="test"></a>'
    let elem = document.getElementById('test')
    let mock = jest.fn()
    elem.addEventListener('mousedown', mock)
    downloadString.triggerEvent(elem)
    expect(mock.mock.calls.length).toBe(1)
  })

  it('should do nothing if elem is not passed', () => {
    downloadString.triggerEvent()
  })
})

describe('download', () => {
  it('should fill element attributes', () => {
    document.body.innerHTML = '<a id="test"></a>'
    let elem = document.getElementById('test')
    let copy = {...downloadString}
    copy.createElement = jest.fn().mockReturnValueOnce(elem)
    copy.triggerEvent = jest.fn()
    copy.deleteElement = jest.fn()
    copy.download('test', 'fiile.json')
    expect(elem.getAttribute('href')).toBe('data:text/plain;charset=utf-8,test')
    expect(elem.getAttribute('download')).toBe('fiile.json')
  })
})
