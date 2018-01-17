/* global describe it jest expect */
const history = require('../history')

describe('add', () => {
  let copy = {...history}
  copy.checkOverflow = () => {}
  copy.checkPossibilities = () => {}

  it('should add an item to the history array', () => {
    copy.add('hi')
    expect(copy.history[0]).toBe('hi')
  })

  it('should set pointer to the last array part', () => {
    copy.history = []
    copy.add('1')
    copy.add('2')
    copy.add('3')
    expect(copy.pointer).toBe(2)
  })

  it('should run checkOverflow and checkPossibilities', () => {
    copy.checkOverflow = jest.fn()
    copy.checkPossibilities = jest.fn()
    copy.add('1')
    expect(copy.checkOverflow.mock.calls.length).toBe(1)
    expect(copy.checkPossibilities.mock.calls.length).toBe(1)
  })
})

describe('checkOverflow', () => {
  it('should do nothing if history is not full', () => {
    history.maxSaves = 3
    history.history = ['1', '2', '3']
    history.checkOverflow()
    expect(history.history).toEqual(['1', '2', '3'])
  })

  it('should delete first element if history is full', () => {
    history.maxSaves = 3
    history.history = ['1', '2', '3', '4']
    history.checkOverflow()
    expect(history.history).toEqual(['2', '3', '4'])
  })
})

describe('checkPossibilities', () => {
  it('should not allow redo if pointer is on top of history', () => {
    history.redoPossible = true
    history.maxSaves = 10
    history.pointer = 10
    history.checkPossibilities()
    expect(history.redoPossible).toBe(false)
  })

  it('should allow redo if pointer is not on top of history', () => {
    history.redoPossible = false
    history.maxSaves = 10
    history.pointer = 2
    history.checkPossibilities()
    expect(history.redoPossible).toBe(true)
  })

  it('should not allow undo if pointer is on bottom of history', () => {
    history.undoPossible = true
    history.pointer = 0
    history.checkPossibilities()
    expect(history.undoPossible).toBe(false)
  })

  it('should allow undo if pointer is not on bottom of history', () => {
    history.undoPossible = false
    history.pointer = 2
    history.checkPossibilities()
    expect(history.undoPossible).toBe(true)
  })
})

describe('undo', () => {
  let copy = {...history}
  copy.pointer = 2
  copy.returnVal = () => {}

  it('should not work if undoPossible is false', () => {
    copy.undoPossible = false
    copy.undo()
    expect(copy.pointer).toBe(2)
  })

  it('should reduce pointer by one', () => {
    copy.undoPossible = true
    copy.undo()
    expect(copy.pointer).toBe(1)
  })
})

describe('redo', () => {
  let copy = {...history}
  copy.pointer = 2
  copy.returnVal = () => {}

  it('should not work if redoPossible is false', () => {
    copy.redoPossible = false
    copy.redo()
    expect(copy.pointer).toBe(2)
  })

  it('should increase pointer by one', () => {
    copy.undoPossible = true
    copy.undo()
    expect(copy.pointer).toBe(1)
  })
})

describe('returnVal', () => {
  let copy = {...history}
  copy.checkPossibilities = jest.fn()

  it('should run checkPossibilities', () => {
    copy.returnVal()
    expect(copy.checkPossibilities.mock.calls.length).toBe(1)
  })

  it('should return the current history item', () => {
    copy.history = ['1', '2', '3', '4']
    copy.pointer = 1
    expect(copy.returnVal()).toBe('2')
  })
})
