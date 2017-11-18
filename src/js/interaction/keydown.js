/* global $ */
/* Single to multiple keydown checks */
const keydown = {
  keycodes: [], // all possible keydown combinations
  pressed: [], // currently pressed

  // bind keydown and keyup events to the window
  // on keydown add the key to pressed
  // on keyup remove it from the pressed
  init (location) {
    $(location).on('keydown', (e) => {
      if (this.pressed.indexOf(e.keyCode) === -1) {
        this.pressed.push(e.keyCode)
        this.checkPressed()
      }
      // return false
    })
    $(location).on('keyup', (e) => {
      var index = this.pressed.indexOf(e.keyCode)
      this.pressed.splice(index, 1)
      // return false
    })
  },

  // check if the pressed keys are aviable in the keycodes
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
        }
      }
    }
  },

  // run the function of the keycode combination
  runPressed (found) {
    found.run()
  },

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

  // add a keyevent to the keycodes
  // but first split the string and translate the names to a keycode
  add (event) {
    event.keycode = event.keycode.split(' + ')
    event.keycode = event.keycode
      .map(this.toUpperCase)
      .map(this.translate)
    if (!this.exists(event)) {
      this.keycodes.push(event)
    }
  },

  toUpperCase (item) {
    return item.toUpperCase()
  },

  // non one key values are translated to a keyCode
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
      default:
        return item.charCodeAt(0)
    }
  }
}
module.exports = keydown
