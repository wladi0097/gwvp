/* global describe expect it */
const idGen = require('../idGen.js')

describe('creating new ID', () => {
  it('should be a string', () => {
    expect(typeof idGen.new()).toBe('string')
  })

  it('should be unique', () => {
    // its not the best test but its enough
    let ids = []
    for (var i = 0; i < 100; i++) {
      ids.push(idGen.new())
    }
    function onlyUnique (value, index, self) {
      return self.indexOf(value) === index
    }
    expect(ids.filter(onlyUnique).length).toBe(100)
  })
})

describe('idGenerator', () => {
  it('should be a string', () => {
    expect(typeof idGen.idGenerator()).toBe('string')
  })

  it('should return a 4 char string', () => {
    expect(idGen.idGenerator().length).toBe(4)
  })
})
