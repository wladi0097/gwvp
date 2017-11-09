/* global $ */
// show full page dom
const pageDomTree = {
  $simulatedDomTree: $('simulatedDomTree'),
  build () {
    this.$simulated = $('#simulated').contents().find('body')
    this.createTree()
  },

  createTree () {
    // TODO:
  }
}
module.exports = pageDomTree
