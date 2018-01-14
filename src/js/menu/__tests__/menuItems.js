/* global describe it expect */
// this is just a validation of the file
const menuItems = require('../menuItems')
const obj = menuItems()

describe('menuuItems', () => {
  it('should be function', () => {
    expect(typeof menuItems).toBe('function')
  })

  it('return should be object', () => {
    expect(typeof obj).toBe('object')
  })
})

describe('object validation', () => {
  it('should be an array', () => {
    expect(Array.isArray(obj)).toBe(true)
  })

  it('each array point has name', () => {
    for (var i = 0; i < obj.length; i++) {
      expect(obj[i].name).toBeDefined()
    }
  })

  it('each array point has items', () => {
    for (var i = 0; i < obj.length; i++) {
      expect(obj[i].items).toBeDefined()
    }
  })
})
