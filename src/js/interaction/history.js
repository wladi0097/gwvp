// save history for Undo and Redo

/** save states of any element and allow to revert them to previous states */
const history = {
  history: [],
  maxSaves: 20,
  pointer: 0,

  /**
  * Add an item to the history
  * @param item - any item
  */
  add (item) {
    this.history.push(item)
    this.pointer = this.history.length - 1
    this.checkOverflow()
    this.checkPossibilities()
  },

  /** Check if the history is full.
  * If it is remove the first element of the history to make space.
  */
  checkOverflow () {
    if (this.history.length > this.maxSaves) {
      this.history.shift()
    }
  },

  /** check if redo or undo are possible  */
  checkPossibilities () {
    this.undoPossible = (this.pointer > 0)
    this.redoPossible = (this.pointer < this.history.length - 1)
  },

  undoPossible: false,
  /** get previous value  */
  undo () {
    if (this.undoPossible) {
      this.pointer--
      return this.returnVal()
    }
  },

  redoPossible: false,
  /** get next value  */
  redo () {
    if (this.redoPossible) {
      this.pointer++
      return this.returnVal()
    }
  },

  /** get the value of the curent pointer */
  returnVal () {
    this.checkPossibilities()
    return this.history[this.pointer]
  }
}

module.exports = history
