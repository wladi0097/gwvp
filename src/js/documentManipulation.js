/* global $ */
const documentManipulation = {
  init () {
    this.bindFrameEvents()
  },
  bindFrameEvents () {
    $('iframe').ready(() => {
      $('#simulated').contents().off('mousemove').on('mousemove', '*', (e) => {
        e.stopImmediatePropagation()
        this.elementHover(e)
      })
      $('#simulated').contents().off('click').on('click', '*', (e) => {
        e.stopImmediatePropagation()
        this.elementClick(e)
      })
    })
  },
  elementHover (e) {
    let rect = e.target.getBoundingClientRect()
    console.log(rect)
    $('.hover').append(`
      <div style="
      width:${rect.width};
      background-color:red;
      height:${rect.height};
      position:absolute;
      top:${rect.top};
      right:${rect.right}>
      </div>`)
  },
  elementClick (e) {
    console.log(e.target.nodeName)
  }
}

module.exports = documentManipulation
