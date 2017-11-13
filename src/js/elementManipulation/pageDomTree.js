/* global $ */
// show full page dom
const pageDomTree = {
  $simulatedDomTree: $('#simulatedDomTree'),
  SimulatetAndTreeReleation: [],
  tree: [],

  build () {
    this.$simulated = $('#simulated').contents().find('body')
    let tree = []
    this.createTree(this.$simulated, tree)
    this.$simulatedDomTree.html('')
    this.createHTML(tree, 0, this.$simulatedDomTree)
    this.tree = tree
  },

  createTree (node, tree) {
    let children = node.children()
    for (var i = 0; i < children.length; i++) {
      let furtherchild = $(children[i]).children()

      if (furtherchild.length > 0) {
        tree.push('Start')
        tree.push(children[i])
        this.createTree($(children[i]), tree)
        tree.push('End')
        continue
      }

      tree.push(children[i])
    }
  },

  createHTML (tree, i, $htmlDom) {
    if (tree[i]) {
      if (tree[i] === 'Start') {
        i++
        $htmlDom.append(`<ul class="hidden">
        <i class="fa fa-caret-right" aria-hidden="true"></i>
        <p>${tree[i].nodeName}</p>
        </ul>`)
        this.addOpenCloseEvents($htmlDom.children().last().children('i'))
        this.addEvents($htmlDom.children().last(), tree[i])
        i++
        this.createHTML(tree, i, $htmlDom.children().last())
      } else if (tree[i] === 'End') {
        i++
        this.createHTML(tree, i, $htmlDom.parent())
      } else {
        $htmlDom.append(`<li>
          <i class="fa fa-angle-right" aria-hidden="true"></i>
          ${tree[i].nodeName}
          </li>`)
        this.addEvents($htmlDom.children().last(), tree[i])
        i++
        this.createHTML(tree, i, $htmlDom)
      }
    }
  },

  addEvents (treePart, simulated) {
    treePart.on('click', (e) => {
      e.stopImmediatePropagation()
      $(simulated).trigger('click')
    })
    treePart.on('mouseover', (e) => {
      e.stopImmediatePropagation()
      $(simulated).trigger('mouseover')
    })
  },

  addOpenCloseEvents (item) {
    $(item).on('click', (e) => {
      let ul = item.parent()
      if (ul.hasClass('hidden')) {
        item.attr('class', 'fa fa-caret-down')
        ul.removeClass('hidden')
      } else {
        item.attr('class', 'fa fa-caret-right')
        ul.addClass('hidden')
      }
    })
  }
}
module.exports = pageDomTree
