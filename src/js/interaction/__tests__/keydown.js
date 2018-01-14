/* global describe expect it Event jest */
const keydown = require('../keydown.js')

// to ckeck if the keydown events are working
let toRun = jest.fn()

// simple one key keycode
const keycode1 = {
  keycode: 'A',
  run: toRun
}
// complex 2 key keycode
const keycode2 = {
  keycode: 'ALT + #',
  run: toRun
}

describe('adding new keycodes works', () => {
  it('should add a new keycode', () => {
    keydown.add({...keycode1})
    expect(keydown.keycodes.length).toBe(1)
  })

  it('should ignore adding existing keycode', () => {
    keydown.add({...keycode1})
    expect(keydown.keycodes.length).toBe(1)
  })

  it('should add multiple-key keycode', () => {
    keydown.add({...keycode2})
    expect(keydown.keycodes.length).toBe(2)
  })
})

describe('translate keys to charCode', () => {
  it('should return right charCode', () => {
    let charCode = keydown.translate('0') // number
    expect(charCode).toBe(48)
    charCode = keydown.translate('A') // upercase A
    expect(charCode).toBe(65)
    charCode = keydown.translate('#') // random char
    expect(charCode).toBe(35)
  })
  it('should convert letters to UpperCase', () => {
    let charCode = keydown.toUpperCase('a')
    charCode = keydown.translate(charCode)
    expect(charCode).toBe(65)
  })
  it('should return special charCodes', () => {
    let charCode = keydown.translate('STRG')
    expect(charCode).toBe(17)
    charCode = keydown.translate('ALT')
    expect(charCode).toBe(18)
    charCode = keydown.translate('SHIFT')
    expect(charCode).toBe(16)
    charCode = keydown.translate('DEL')
    expect(charCode).toBe(46)
  })
})

describe('fire new events', () => {
  keydown.init(document)
  it('should register a keydown and save it', () => {
    let e = new Event('keydown')
    e.keyCode = 65
    document.dispatchEvent(e)
    expect(keydown.pressed[0]).toBe(65) // key a is pressed
  })
  it('should register a keyup and save it', () => {
    let e = new Event('keyup')
    e.keyCode = 65
    document.dispatchEvent(e)
    expect(keydown.pressed[0]).toBe(undefined) // no key is pressed
  })
  it('should run provided function', () => {
    // got pressed above
    expect(toRun.mock.calls.length).toBe(1) // run event got fired
  })
  it('should ignore not registered keydowns', () => {
    // keydown
    let e = new Event('keydown')
    e.keyCode = 0
    document.dispatchEvent(e)
    // keyup
    e = new Event('keyup')
    e.keyCode = 0
    document.dispatchEvent(e)
    // test
    expect(toRun.mock.calls.length).toBe(1) // run event wasn't fired
  })
  it('should register and run multiple keydowns', () => {
    // keydown ALT
    let e = new Event('keydown')
    e.keyCode = 18
    document.dispatchEvent(e)
    // keydown #
    e = new Event('keydown')
    e.keyCode = 35
    document.dispatchEvent(e)

    expect(keydown.pressed[0]).toBe(18) // key ALT got pressed
    expect(keydown.pressed[1]).toBe(35) // key # got pressed
    expect(toRun.mock.calls.length).toBe(2) // run event got fired
  })
})

keydown.init(document)
