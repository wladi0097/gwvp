// save history for Undo and Redo

/** Save states of any element and allow to revert them to previous states */
const history = {
  history: [],
  maxSaves: 20,
  pointer: 0,

  /** reset the history to default  */
  reset () {
    let empty = {}
    empty.done = () => {}
    empty.undo = () => {}
    empty.this = this
    empty.doneArgs = []
    empty.undoArgs = []
    this.history = [empty]
    this.pointer = 0
    this.checkPossibilities()
  },

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
      let val = this.returnVal()
      if (val) val.undo.apply(val._this, val.undoArgs)
      this.pointer--
      this.checkPossibilities()
    }
  },

  redoPossible: false,
  /** get next value  */
  redo () {
    if (this.redoPossible) {
      this.pointer++
      let val = this.returnVal()
      if (val) val.done.apply(val._this, val.doneArgs)
      this.checkPossibilities()
    }
  },

  /** get the value of the curent pointer */
  returnVal () {
    return this.history[this.pointer]
  }
}

module.exports = history
