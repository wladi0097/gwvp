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
    obj.forEach((o) => {
      expect(o.name).toBeDefined()
    })
  })

  it('each array point has items', () => {
    obj.forEach((o) => {
      expect(o.items).toBeDefined()
    })
  })
})
