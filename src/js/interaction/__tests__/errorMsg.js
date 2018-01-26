/* global describe expect it jest */
const displayMessage = require('../displayMessage.js')

document.body.innerHTML = `<div id="dElem"></div>`
let dElem = document.getElementById('dElem')

describe('init', () => {
  it('should accept params and save them', () => {
    displayMessage.init(dElem)
    expect(displayMessage.displayElem).toBe(dElem)
  })
})

describe('htmlTemplate', () => {
  it('should return html with text', () => {
    let should = `
      <div class="close">

      </div>
      <div class="text">
        <p>This is a test</p>
      </div>`
    expect(displayMessage.htmlTemplate('This is a test').replace(/ /g, '')).toBe(should.replace(/ /g, ''))
  })

  it('should return html with exit', () => {
    let should = `
      <div class="close">
        <i class="fa fa-times deleteMessage" aria-hidden="true"></i>
      </div>
      <div class="text">
        <p></p>
      </div>`
    expect(displayMessage.htmlTemplate('', true).replace(/ /g, '')).toBe(should.replace(/ /g, ''))
  })
})

describe('show', () => {
  it('should not allow usage if text is not given', () => {
    displayMessage.displayElem = dElem
    expect(displayMessage.show()).toBe(false)
  })

  it('should not allow usage if displayElem was not initialized', () => {
    displayMessage.displayElem = null
    expect(displayMessage.show('test')).toBe(false)
  })

  it('should not allow usage if lenght is shorter than 500ms', () => {
    displayMessage.displayElem = dElem
    expect(displayMessage.show('test', 200)).toBe(false)
  })

  it('should create and run delete after time', () => {
    let copy = {...displayMessage}
    copy.htmlTemplate = jest.fn()
    copy.show('test', 600)
    expect(copy.htmlTemplate.mock.calls.length).toBe(1)
  })
})

describe('createElem', () => {
  it('should create a html element with an given class', () => {
    let el = displayMessage.createElem('test', '')
    expect(el.classList.contains('test')).toBe(true)
  })

  it('should fill with custom innerHTML', () => {
    let el = displayMessage.createElem(undefined, 'test me')
    expect(el.innerHTML).toBe('test me')
  })
})

describe('delete', () => {
  it('should delete if there is something to delete', () => {
    document.body.innerHTML = '<div id="parent"><p id="child"></p></div>'
    let elem = document.getElementById('child')
    displayMessage.delete(elem)
    expect(elem.classList.contains('hide-message')).toBe(true)
  })
})
