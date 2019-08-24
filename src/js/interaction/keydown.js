/**
 * Catch single or multiple keydowns from a user and run a given function.
 * The keydown object can be used at multiple locations with the same keycodes (if you pass it by reference, which is default).
 */
const keydown = {
  /**
   * All keydowns are saved as a keycode in a array.
   * @example [{
   *  keycode: [1, 2, 3],
   *  run: f doStuff()
   * }...]
  */
  keycodes: [],
  /**
   * All pressed keydowns are saved as a keycode in a array.
   * @example [[0, 1]...]
  */
  pressed: [],

  /** Bind keydown and keyup events to the window.
   * On keydown add the key to pressed-array.
   * On keyup remove it from the pressed-array.
   * @param {HTMLElement} location - bind all events to the given dom element
  */
  init (location) {
    location.addEventListener('keydown', (e) => {
      if (this.pressed.indexOf(e.keyCode) === -1) {
        this.pressed.push(e.keyCode)
        if (!this.checkPressed()) {
          e.preventDefault()
        }
      }
    })
    location.addEventListener('keyup', (e) => {
      var index = this.pressed.indexOf(e.keyCode)
      this.pressed.splice(index, 1)
    })
  },

  /** Compares the keycodes[] and the pressed[] arrays.
   * If a match was found, run the code from the matching keycode.
   * @return {Boolean} false if found, because it is going to overwrite the default action
  */
  checkPressed () {
    for (var i = 0; i < this.keycodes.length; i++) {
      let len = this.keycodes[i].keycode.length
      if (this.pressed.length === len) {
        let found = true
        for (var k = 0; k < this.pressed.length; k++) {
          if (this.keycodes[i].keycode.indexOf(this.pressed[k]) === -1) {
            found = false
          }
        }
        if (found) {
          this.runPressed(this.keycodes[i])
          return false // overwrite default keydown action
        }
      }
    }
    return true
  },

  /** Run the .run() method from the keyCode.
   * @param {Object} found - a object with a run method
   * @param {Function} found.run - fuction which should be runned
  */
  runPressed (found) {
    found.run()
  },

  /** Check if the keycodes already exists in the this.keycodes.
   * @param {Object} obj - an object with informations about a keycode and a run method
   * @param {Number[]} obj.keycode - the converted keycode of the object
   * @param {Function} obj.run - function which should be runned
  */
  exists (obj) {
    for (var i = 0; i < this.keycodes.length; i++) {
      let keyCodeLen = this.keycodes[i].keycode.length
      let checklen = 0
      for (var k = 0; k < keyCodeLen; k++) {
        if (obj.keycode.indexOf(this.keycodes[i].keycode[k]) !== -1) {
          checklen++
        }
      }
      if (keyCodeLen === checklen &&
        this.keycodes[i].run === obj.run) {
        return true
      }
    }
    return false
  },

  /** Add a keyevent to the keycodes array.
   * But first split the string and translate the names to a keycode.
   * @param {Object} obj - a object with informations about a keycode and a run method
   * @param {Number[]} obj.keycode - the unconverted keycode of the object
   * @param {Function} obj.run - function which should be runned
  */
  add (event) {
    event.keycode = event.keycode.split(' + ')
    event.keycode = event.keycode
      .map(this.toUpperCase)
      .map(this.translate)
    if (!this.exists(event)) {
      this.keycodes.push(event)
    }
  },

  addArray (array) {
    array.forEach((elem) => {
      this.add(elem)
    })
  },

  toUpperCase (item) {
    return item.toUpperCase()
  },

  /** Convert a key to a ascii keycode.
   * @see http://www.asciitable.com/
   * @param {?(Number|String)} item - unconverted keycode
   * @return {Number} converted keycode
  */
  translate (item) {
    switch (item) {
      case 'STRG':
        return 17
      case 'ALT':
        return 18
      case 'SHIFT':
        return 16
      case 'DEL':
        return 46
      case 'F11':
        return 122
      default:
        return item.charCodeAt(0)
    }
  }
}
module.exports = keydown
