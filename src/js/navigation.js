/** All simple Navigation options. */
const navigation = {
  init () {
    this.navBarSelection()
    this.cacheDom()
  },

  cacheDom () {
    this.$leftSide = document.getElementsByClassName('left-sidebar')[0]
    this.$rightSide = document.getElementsByClassName('right-sidebar')[0]
    this.$center = document.getElementsByClassName('center')[0]
  },

  /** switch between the three tabs */
  navBarSelection () {
    let elements = document.getElementsByClassName('sidebar-navigator')
    Array.from(elements).forEach((element) => {
      element.addEventListener('mousedown', this.navBarSelectionEvent.bind(this))
    })
  },

  /** Its the event for leftNavBarSelection */
  navBarSelectionEvent (e) {
    let target = e.currentTarget
    Array.from(target.parentNode.children).forEach(item => {
      if (item.classList.contains('sidebar-navigator')) {
        let open = item.getAttribute('open')
        item.classList.remove('selected')
        document.getElementsByClassName(open)[0].classList.remove('selected')
      }
    })
    target.classList.add('selected')
    document.getElementsByClassName(target.getAttribute('open'))[0].classList.add('selected')
  },

  simulateNavBarSelection (open) {
    let elem = document.querySelector(`[open="${open}"]`)
    let e = {currentTarget: elem}
    this.navBarSelectionEvent(e)
  },

  leftSideVisible: true,
  rightSideVisible: true,

  toggleSidebarVisibility (side) {
    if (side === 'left') {
      this.leftSideVisible = !this.leftSideVisible
      this.$leftSide.classList.toggle('hide')
    } else if (side === 'right') {
      this.rightSideVisible = !this.rightSideVisible
      this.$rightSide.classList.toggle('hide')
    }
    let minus = this.$leftSide.offsetWidth + this.$rightSide.offsetWidth
    this.$center.setAttribute('style', 'width: calc(100% - ' + minus + 'px )')
  },

  isFullscreen () {
    if (document.fullScreen !== undefined) return document.fullScreen
    if (document.webkitIsFullScreen !== undefined) return document.webkitIsFullScreen
    if (document.mozFullScreen !== undefined) return document.mozFullScreen
  },

  toggleFullscreen (doc) {
    if (!doc) return
    if (this.isFullscreen()) {
      if (document.cancelFullScreen) document.cancelFullScreen()
      if (document.webkitCancelFullScreen) document.webkitCancelFullScreen()
      if (document.mozCancelFullScreen) document.mozCancelFullScreen()
    } else {
      if (doc.requestFullScreen) doc.requestFullScreen()
      if (doc.webkitRequestFullScreen) doc.webkitRequestFullScreen()
      if (doc.mozRequestFullScreen) doc.mozRequestFullScreen()
    }
  }
}

module.exports = navigation
