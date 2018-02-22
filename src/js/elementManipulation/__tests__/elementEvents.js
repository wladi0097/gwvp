/* global describe it expect jest MouseEvent getComputedStyle */
const elementEvents = require('../elementEvents')
const pageDomTree = require('../pageDomTree')
const textEditor = require('../textEditor')

document.body.innerHTML = `<iframe src="/public" id="simulated"></iframe><div class="items">
<div class="hover-wrapper">
  <div class="hover"> </div>
</div>
<div class="click-wrapper">
  <div class="click">
    <div class="items">
      <ul>
        <li id="closeClick"><i class="fa fa-times" aria-hidden="true"></i></li>
        <li id="moveClick"><i class="fa fa-arrows-alt" aria-hidden="true"></i></li>
        <li class="item-name" id="itemName"></li>
      </ul>
    </div>
  </div>
</div>
</div>
<p id="test">hi</p>`

describe('init', () => {
  textEditor.init = () => {}

  it('should run cacheDom and bindEvents', () => {
    let copy = {...elementEvents}
    let mockCache = jest.fn().mockReturnValue(copy)
    copy.cacheDom = mockCache
    copy.bindEvents = jest.fn()
    copy.init()
    expect(copy.cacheDom.mock.calls.length).toBe(1)
    expect(copy.bindEvents.mock.calls.length).toBe(1)
  })
})

describe('initAfterFrame', () => {
  textEditor.initWithFrame = () => {}
  pageDomTree.build = () => {}
  let copy = {...elementEvents}
  copy.bindFrameEvents = jest.fn()
  copy.initAfterFrame()

  it('should save the iframe', () => {
    expect(copy.$iframe).not.toBe(undefined)
  })

  it('should run bindFrameEvents', () => {
    expect(copy.bindFrameEvents.mock.calls.length).toBe(1)
  })
})

describe('cacheDom', () => {
  let copy = {...elementEvents}

  it('should cache all dom items', () => {
    copy.cacheDom()
    expect(copy.$close).not.toBe(undefined)
    expect(copy.$drag).not.toBe(undefined)
    expect(copy.$itemName).not.toBe(undefined)
  })
})

describe('bindEvents', () => {
  let copy = {...elementEvents}
  copy.cacheDom()
  copy.bindEvents()

  it('should fire event on click', () => {
    copy.noClick = jest.fn()
    copy.dragStart = jest.fn()
    let event = new MouseEvent('mousedown')
    copy.$close.dispatchEvent(event)
    expect(copy.noClick.mock.calls.length).toBe(1)
    copy.$drag.dispatchEvent(event)
    expect(copy.dragStart.mock.calls.length).toBe(1)
  })
})

describe('bindFrameEvents', () => {
  let copy = {...elementEvents}
  copy.$iframe = document.getElementById('simulated')
  copy.click = jest.fn()
  copy.hover = jest.fn()
  copy.dblclick = jest.fn()
  copy.onScroll = jest.fn()
  copy.noHover = jest.fn()
  copy.bindFrameEvents()

  it('should fire event on click', () => {
    copy.$iframe.dispatchEvent(new MouseEvent('mousedown'))
    expect(copy.click.mock.calls.length).toBe(1)
  })

  it('should fire event on hover', () => {
    copy.$iframe.dispatchEvent(new MouseEvent('mouseover'))
    expect(copy.hover.mock.calls.length).toBe(1)
  })

  it('should fire event on double click', () => {
    copy.$iframe.dispatchEvent(new MouseEvent('dblclick'))
    expect(copy.dblclick.mock.calls.length).toBe(1)
  })

  it('should fire event on scroll', () => {
    copy.$iframe.dispatchEvent(new MouseEvent('scroll'))
    expect(copy.onScroll.mock.calls.length).toBe(1)
  })

  it('should fire event on mouseover', () => {
    document.body.dispatchEvent(new MouseEvent('mouseover'))
    expect(copy.noHover.mock.calls.length).toBe(1)
  })

  it('should set the iframe hasEvents to true', () => {
    expect(copy.$iframe.hasEvents).toBe(true)
  })

  it('should only Initialize once', () => {
    let newcopy = {...elementEvents}
    newcopy.$iframe = document.getElementById('simulated')
    newcopy.$iframe.hasEvents = false
    newcopy.bindFrameEvents()
    expect(newcopy.$iframe.hasEvents).toBe(true)
  })
})

describe('change', () => {

})

describe('onScroll', () => {
  let copy = {...elementEvents}
  it('should run redrawRect', () => {
    copy.redrawRect = jest.fn()
    copy.onScroll()
    expect(copy.redrawRect.mock.calls.length).toBe(1)
  })
})

describe('click', () => {
  let testelem = document.getElementById('test')
  testelem.addEventListener('mousedown', (e) => {
    elementEvents.click(e)
  })
  // click sets allowInteraction to true
  elementEvents.allowInteraction = false

  it('should not execute when allowClick is false', () => {
    elementEvents.allowClick = false
    elementEvents.click(new MouseEvent('mousedown'))
    expect(elementEvents.allowInteraction).toBe(false)
  })

  it('should not execute without an event', () => {
    elementEvents.allowClick = true
    elementEvents.click()
    expect(elementEvents.allowInteraction).toBe(false)
  })

  it('should allow inteaction with the element', () => {
    elementEvents.allowInteraction = false
    testelem.dispatchEvent(new MouseEvent('mousedown'))
    expect(elementEvents.allowInteraction).toBe(true)
  })

  it('should save the clicked element for futher interaction', () => {
    elementEvents.currentElement = null
    testelem.dispatchEvent(new MouseEvent('mousedown'))
    expect(elementEvents.currentElement).not.toBe(null)
  })

  it('should display the clicked nodename', () => {
    let elem = document.getElementById('itemName')
    elementEvents.$itemName = elem
    elem.innerHTML = ''
    testelem.dispatchEvent(new MouseEvent('mousedown'))
    expect(elem.innerHTML).toBe('P')
  })
})

describe('noClick', () => {
  it('should reset the currentElement', () => {
    elementEvents.currentElement = 'hi'
    elementEvents.allowInteraction = true
    elementEvents.noClick()
    expect(elementEvents.currentElement).toBe(null)
  })

  it('should disallow interaction', () => {
    elementEvents.currentElement = 'hi'
    elementEvents.allowInteraction = true
    elementEvents.noClick()
    expect(elementEvents.allowInteraction).toBe(false)
  })
})

describe('hover', () => {
  let copy = {...elementEvents}
  copy.showRectAroundElement = jest.fn()
  let e = {stopImmediatePropagation: () => {}}

  it('should not run when allowHover is false', () => {
    copy.allowHover = false
    copy.hover(e)
    expect(copy.showRectAroundElement.mock.calls.length).toBe(0)
  })

  it('should not run when allowHover is true', () => {
    copy.allowHover = true
    copy.hover(e)
    expect(copy.showRectAroundElement.mock.calls.length).toBe(1)
  })
})

describe('noHover', () => {
  let copy = {...elementEvents}
  copy.hideRectAroundElement = jest.fn()
  document.body.innerHTML += `<div id="simulatedDomTree"><p id="domtreeHover"><p></div>`

  it('should not run when hovered over domtree', () => {
    let elem = document.getElementById('domtreeHover')
    elem.addEventListener('mouseover', (e) => {
      copy.noHover(e)
    })
    elem.dispatchEvent(new MouseEvent('mouseover'))
    expect(copy.hideRectAroundElement.mock.calls.length).toBe(0)
  })

  it('should run hideRectAroundElement when not hovered on domtree', () => {
    copy.noHover()
    expect(copy.hideRectAroundElement.mock.calls.length).toBe(1)
  })
})

describe('copy', () => {
  document.execCommand = jest.fn()

  it('should do nothing if no currentElement exists', () => {
    elementEvents.currentElement = null
    elementEvents.allowInteraction = true
    elementEvents.copy()
    expect(elementEvents.clipboard).toBe(null)
  })

  it('should do nothing if interaction is not allowed', () => {
    elementEvents.currentElement = document.getElementById('test')
    elementEvents.allowInteraction = false
    elementEvents.copy()
    expect(elementEvents.clipboard).toBe(null)
  })

  it('should copy the outerhtml of the element and save it in the real clipboard', () => {
    elementEvents.currentElement = document.getElementById('test')
    elementEvents.allowInteraction = true
    elementEvents.copy()
    expect(document.execCommand.mock.calls.length).toBe(1)
  })

  it('should copy the outerhtml of the element and save it in the virtual clipboard', () => {
    elementEvents.currentElement = document.getElementById('test')
    elementEvents.allowInteraction = true
    elementEvents.copy()
    expect(elementEvents.clipboard).toBe('<p id="test">hi</p>')
  })
})

describe('delete', () => {
  pageDomTree.removeNode = () => {}
  pageDomTree.removeNodeFix = () => {}
  document.body.innerHTML += `<p id="deleteMe"></p>`

  it('should do nothing if no currentElement exists', () => {
    elementEvents.currentElement = null
    elementEvents.allowInteraction = true
    elementEvents.delete()
    expect(document.getElementById('deleteMe')).not.toBe(null)
  })

  it('should do nothing if interaction is not allowed', () => {
    elementEvents.currentElement = document.getElementById('deleteMe')
    elementEvents.allowInteraction = false
    elementEvents.delete()
    expect(document.getElementById('deleteMe')).not.toBe(null)
  })

  it('should remove the whole element from dom', () => {
    elementEvents.currentElement = document.getElementById('deleteMe')
    elementEvents.allowInteraction = true
    elementEvents.delete()
    expect(document.getElementById('deleteMe')).toBe(null)
  })

  it('should call noClick and reset currentElement, allowInteraction', () => {
    let copy = {...elementEvents}
    let mockNoClick = jest.fn().mockReturnValue(copy)
    copy.noClick = mockNoClick
    document.body.innerHTML += `<p id="deleteMe"></p>`
    copy.currentElement = document.getElementById('deleteMe')
    copy.allowInteraction = true
    copy.delete()
    expect(copy.noClick.mock.calls.length).toBe(1)
  })
})

describe('cut', () => {
  document.body.innerHTML += `<p id="cutMe"></p>`

  it('should do nothing if no currentElement exists', () => {
    elementEvents.currentElement = null
    elementEvents.allowInteraction = true
    elementEvents.cut()
    expect(document.getElementById('cutMe')).not.toBe(null)
  })

  it('should do nothing if interaction is not allowed', () => {
    elementEvents.currentElement = document.getElementById('cutMe')
    elementEvents.allowInteraction = false
    elementEvents.cut()
    expect(document.getElementById('cutMe')).not.toBe(null)
  })

  it('should execute copy and then delete', () => {
    let copy = {...elementEvents}
    copy.currentElement = document.getElementById('cutMe')
    copy.allowInteraction = true
    let mockCopy = jest.fn().mockReturnValue(copy)
    copy.copy = mockCopy
    copy.delete = jest.fn()
    copy.cut()
    expect(copy.copy.mock.calls.length).toBe(1)
    expect(copy.delete.mock.calls.length).toBe(1)
  })
})

describe('paste', () => {
  document.body.innerHTML += `<div id="pasteMe"></div>`
  let elem = document.getElementById('pasteMe')

  it('should do nothing if data is null and clipboard is empty', () => {
    pageDomTree.addNode = jest.fn()
    elementEvents.clipboard = null
    elementEvents.paste('in', null, elem)
    expect(pageDomTree.addNode.mock.calls.length).toBe(0)
  })

  it('should run paste if clipboard is filled but data is null', () => {
    pageDomTree.addNode = jest.fn()
    elementEvents.clipboard = '<p></p>'
    elementEvents.paste('in', null, elem)
    expect(pageDomTree.addNode.mock.calls.length).toBe(1)
  })

  it('should run paste if clipboard is null but data is filled', () => {
    pageDomTree.addNode = jest.fn()
    elementEvents.clipboard = null
    elementEvents.paste('in', '<p></p>', elem)
    expect(pageDomTree.addNode.mock.calls.length).toBe(1)
  })

  it('should do nothing if whereDom is null and currentElement is empty', () => {
    pageDomTree.addNode = jest.fn()
    elementEvents.currentElement = null
    elementEvents.paste('in', '<p></p>', null)
    expect(pageDomTree.addNode.mock.calls.length).toBe(0)
  })

  it('should run paste if currentElement is filled but whereDom is null', () => {
    pageDomTree.addNode = jest.fn()
    elementEvents.currentElement = elem
    elementEvents.paste('in', '<p></p>', null)
    expect(pageDomTree.addNode.mock.calls.length).toBe(1)
  })

  it('should run paste if currentElement is null but whereDom is filled', () => {
    pageDomTree.addNode = jest.fn()
    elementEvents.currentElement = null
    elementEvents.paste('in', '<p></p>', elem)
    expect(pageDomTree.addNode.mock.calls.length).toBe(1)
  })

  it('should work with appendStyle "in"', () => {
    elem = document.getElementById('pasteMe')
    pageDomTree.addNode = () => {}
    elementEvents.currentElement = null
    elem.innerHTML = ''
    elementEvents.paste('in', '<p></p>', elem)
    expect(elem.innerHTML).toBe('<p></p>')
  })

  it('should use "in" as defaul appendStyle', () => {
    elem = document.getElementById('pasteMe')
    pageDomTree.addNode = () => {}
    elementEvents.currentElement = null
    elem.innerHTML = ''
    elementEvents.paste(null, '<p></p>', elem)
    expect(elem.innerHTML).toBe('<p></p>')
  })

  it('should work with appendStyle "before"', () => {
    elem = document.getElementById('pasteMe')
    elem.innerHTML = '<p id="before"></p>'
    pageDomTree.addNode = () => {}
    elementEvents.currentElement = null
    let before = document.getElementById('before')
    elementEvents.paste('before', '<p></p>', before)
    expect(elem.innerHTML).toBe('<p></p><p id="before"></p>')
  })

  it('should work with appendStyle "after"', () => {
    elem = document.getElementById('pasteMe')
    elem.innerHTML = '<p id="after"></p>'
    pageDomTree.addNode = () => {}
    elementEvents.currentElement = null
    let after = document.getElementById('after')
    elementEvents.paste('after', '<p></p>', after)
    expect(elem.innerHTML).toBe('<p id="after"></p><p></p>')
  })
})

describe('duplicate', () => {
  let copy = {...elementEvents}
  copy.paste = jest.fn()
  document.body.innerHTML += `<p id="duplicateMe"></p>`

  it('should do nothing if no currentElement exists', () => {
    copy.currentElement = null
    copy.allowInteraction = true
    copy.duplicate()
    expect(copy.paste.mock.calls.length).toBe(0)
  })

  it('should do nothing if interaction is not allowed', () => {
    copy.currentElement = document.getElementById('duplicateMe')
    copy.allowInteraction = false
    copy.duplicate()
    expect(copy.paste.mock.calls.length).toBe(0)
  })

  it('should run paste with outerHTML', () => {
    copy.currentElement = document.getElementById('duplicateMe')
    copy.allowInteraction = true
    copy.duplicate()
    expect(copy.paste.mock.calls[0][1]).toBe('<p id="duplicateMe"></p>')
  })
})

describe('redrawRect', () => {
  document.body.innerHTML += `<p id="redrawMe"></p>`
  let elem = document.getElementById('redrawMe')
  elem.addEventListener('mousedown', () => {
    elem.clicked = true
  })
  elem.addEventListener('mouseover', () => {
    elem.hovered = true
  })

  it('should do nothing if currentElement or hoveredElement are not provided', () => {
    elementEvents.currentElement = null
    elementEvents.hoveredElement = null
    elementEvents.redrawRect()
    expect(elem.clicked).toBe(undefined)
    expect(elem.hovered).toBe(undefined)
  })
})

describe('showRectAroundElement', () => {
  let elem = document.getElementsByClassName('hover')[0]
  document.body.innerHTML += '<p id="drawrect" style="width: 200px; height: 200px;"></p>'
  let item = document.getElementById('drawrect')

  it('should do noting if event is not given', () => {
    elementEvents.showRectAroundElement(null, 'hover')
    expect(elem.getAttribute('style')).toBe(null)
  })

  it('should do nothing if element is not found', () => {
    elementEvents.showRectAroundElement(null, 'h')
    expect(elem.getAttribute('style')).toBe(null)
  })

  it('should place a rect around the element', () => {
    item.addEventListener('mouseover', (e) => {
      elementEvents.showRectAroundElement(e, 'hover')
    })
    item.dispatchEvent(new MouseEvent('mouseover'))
    expect(getComputedStyle(document.getElementsByClassName('hover')[0]).display).toBe('block')
  })
})

describe('hideRectAroundElement', () => {
  let elem = document.getElementsByClassName('hover')[0]
  elem.setAttribute('style', '1')

  it('should do nothing if element does not exist', () => {
    let non = document.getElementById('nothing')
    elementEvents.hideRectAroundElement(non)
    expect(non).toBe(null)
  })

  it('should remove the css from the element', () => {
    elementEvents.hideRectAroundElement(elem)
    expect(elem.getAttribute('style')).toBe('')
  })
})

describe('dragStart', () => {
  it('should not work when currentElement and html are not provided', () => {
    elementEvents.draggedElement = null
    elementEvents.currentElement = undefined
    elementEvents.dragStart(undefined)
    expect(elementEvents.draggedElement).toBe(null)
  })

  it('should copy the html into draggedElement', () => {
    elementEvents.$iframe = document.getElementById('simulated')
    elementEvents.draggedElement = null
    elementEvents.currentElement = undefined
    elementEvents.dragStart('<p></p>')
    expect(elementEvents.draggedElement).toBe('<p></p>')
  })

  it('should copy the outerHTML from currentElement into draggedElement and delete original', () => {
    document.body.innerHTML += '<p id="dragStart"></p>'
    elementEvents.allowInteraction = true
    elementEvents.$iframe = document.getElementById('simulated')
    elementEvents.draggedElement = null
    elementEvents.currentElement = document.getElementById('dragStart')
    elementEvents.dragStart()
    expect(elementEvents.draggedElement).toBe('<p id="dragStart"></p>')
    expect(document.getElementById('dragStart')).toBe(null)
  })

  it('should save eventlisteners for later use', () => {
    elementEvents.dragHoverEvent = null
    elementEvents.dragEndEvent = null
    elementEvents.dragStart('<p></p>')
    expect(elementEvents.dragHoverEvent).not.toBe(null)
    expect(elementEvents.dragEndEvent).not.toBe(null)
  })

  it('should disallow all hover effects', () => {
    this.allowHover = true
    this.hoveredElement = 'b'
    elementEvents.dragStart('<p></p>')
    expect(elementEvents.allowHover).toBe(false)
    expect(elementEvents.hoveredElement).toBe(null)
  })
})

describe('dragHover', () => {
  // TODO: complete test
})

describe('dragEnd', () => {
  let copy = {...elementEvents}
  copy.$iframe = document.createElement('p')
  it('should remove eventlisteners', () => {
    copy.dragHover = jest.fn()
    copy.dragStart('<p></p>')
    copy.dragEnd()
    copy.$iframe.dispatchEvent(new MouseEvent('mouseover'))
    expect(copy.dragHover.mock.calls.length).toBe(0)
  })

  it('should run paste', () => {
    copy.paste = jest.fn()
    copy.dragStart('<p></p>')
    copy.dragEnd()
    expect(copy.paste.mock.calls.length).toBe(1)
  })
})
