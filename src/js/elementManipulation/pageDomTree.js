/* global $ */
/* show full page dom
  building the tree almost takes no time (after the change to append the whole tree in one append command),
  because of that it gets rebuild after every action
*/
const pageDomTree = {
  idCounter: 0,
  SimulatetAndTreeReleation: [], // releation between the dom tree and the real one
  tree: [], // done tree
  openedTree: [],
  hasEvents: false,
  iconShow: 'fa fa-caret-down',
  iconHide: 'fa fa-caret-right',
  iconNoChildren: 'fa fa-angle-right',

  // build whole tree with reset
  build (iframe, domTree) {
    this.$simulated = iframe || $('#simulated').contents().find('body')
    this.$simulatedDomTree = domTree || $('#simulatedDomTree')
    let tree = []
    let html = {val: ''}

    this.reset()
      .createTree(this.$simulated, tree, html)
      .$simulatedDomTree.html(html.val)

    this.tree = tree

    if (!this.hasEvents) { // add events if not exist
      this.addOpenCloseEvents()
        .addEvents()
      this.hasEvents = true
    }
  },

  // reset to default state
  reset () {
    this.idCounter = 0
    this.$simulatedDomTree.html('')
    this.tree = []
    return this
  },

  isTreeNodeParent (node) {
    return ($(node).children().length > 0)
  },

  // create a dom tree with a recursive function
  // the completed tree will be saved in this.tree[]
  // tests made 30 times and getting min to max
  // append html after done = 6ms ~ 12ms
  // append each element itself = 260ms ~ 340ms
  createTree (node, tree, html) {
    let children = node.children()
    for (var i = 0; i < children.length; i++) {
      if (this.isTreeNodeParent(children[i])) {
        tree.push(children[i])
        html.val += `<ul class="hidden" class="tree-item" id="tree-${this.idCounter++}">
          <i class="${this.iconHide}" aria-hidden="true"></i>
          <p>${children[i].nodeName}  <span class="classes">${$(children[i]).attr('class') || ''}<span></p>`
        this.createTree($(children[i]), tree, html)
        html.val += `</ul>`
        continue
      }

      tree.push(children[i])
      html.val += `<li id="tree-${this.idCounter++}" class="tree-item">
        <i class="${this.iconNoChildren}" aria-hidden="true"></i>
        ${children[i].nodeName}  <span class="classes">${$(children[i]).attr('class') || ''}<span>
        </li>`
    }
    return this
  },

  // add click and mouseover events to appended dom items
  addEvents () {
    this.$simulatedDomTree.off('click.domtreeSimulate').on('click.domtreeSimulate', 'ul, li', (e) => {
      e.stopImmediatePropagation()
      let treeNode = $(e.currentTarget).attr('id').split('-')[1]
      $(this.tree[treeNode]).trigger('click')
    })

    this.$simulatedDomTree.off('mouseover.domtreeSimulate').on('mouseover.domtreeSimulate', 'ul, li', (e) => {
      e.stopImmediatePropagation()
      let treeNode = $(e.currentTarget).attr('id').split('-')[1]
      $(this.tree[treeNode]).trigger('mouseover')
    })
    return this
  },

  // add caret icons for better navigation
  // all ul items can be expanded with a click
  addOpenCloseEvents () {
    this.$simulatedDomTree.off('click.domtree').on('click.domtree', 'i', (e) => {
      let ul = $(e.target).parent()
      let item = $(e.target)
      if (ul.hasClass('hidden')) { // if not visible, show it
        item.attr('class', this.iconShow)
        ul.removeClass('hidden')
      } else { // if visivle, hide it
        item.attr('class', this.iconHide)
        ul.addClass('hidden')
      }
    })
    return this
  }
}
module.exports = pageDomTree

// TODO: remove test
window.a = pageDomTree
