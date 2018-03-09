/* global describe it expect jest MouseEvent */
const pageDomTree = require('../pageDomTree')

describe('build', () => {
  document.body.innerHTML = '<div id="testDom"></div><iframe id="frame"></iframe>'

  it('should not build if there is no iframe', () => {
    expect(pageDomTree.build(null, document.getElementById('testDom'))).toBe(false)
  })

  it('should not build if there is no domtree', () => {
    expect(pageDomTree.build(document.getElementById('frame'), null)).toBe(false)
  })

  it('should use default domTree name if not given', () => {
    document.body.innerHTML = '<div id="simulatedDomTree"></div>'
    expect(pageDomTree.build(null, null)).toBe(false)
    expect(pageDomTree.$domTree).toBe(document.getElementById('simulatedDomTree'))
  })

  it('should reset and create the whole tree', () => {
    document.body.innerHTML = '<div id="simulatedDomTree"></div><iframe id="simulated"></iframe>'
    document.getElementById('simulated').contentDocument.innerHTML = '<p></p>'
    let copy = {...pageDomTree}
    copy.treeData = {html: '', ids: [], counter: 0}
    copy.hasEvents = true
    let mock = jest.fn().mockReturnValue(copy)
    copy.reset = mock
    copy.createTree = mock
    copy.build(document.getElementById('simulated'))
    expect(mock.mock.calls.length).toBe(2)
  })
})

describe('bindEvents', () => {
  it('should add events if none are present', () => {
    document.body.innerHTML = '<div id="simulatedDomTree"></div><iframe id="simulated"></iframe>'
    document.getElementById('simulated').contentDocument.innerHTML = '<p></p>'
    let copy = {...pageDomTree}
    let mock = jest.fn().mockReturnValue(copy)
    copy.reset = () => { return copy }
    copy.createTree = () => { return copy }
    copy.treeData = {html: '', ids: [], counter: 0}
    copy.addOpenCloseEvents = mock
    copy.addRelationEvents = mock
    copy.addReloadEvent = mock
    copy.build(document.getElementById('simulated'))
    expect(mock.mock.calls.length).toBe(3)
    expect(copy.hasEvents).toBe(true)
  })
})

describe('reset', () => {
  it('should clear the innerHTML from the domtree', () => {
    document.body.innerHTML = '<p id="test">123</p>'
    pageDomTree.$domTree = document.getElementById('test')
    pageDomTree.reset()
    expect(document.getElementById('test').innerHTML).toBe('')
  })
})

describe('removeNode', () => {
  it('should rebuild whole domtree if node is not found', () => {
    document.body.innerHTML = '<p id="test"></p>'
    let copy = {...pageDomTree}
    copy.build = jest.fn()
    copy.removeNode(document.getElementById('test'))
    expect(copy.build.mock.calls.length).toBe(1)
  })

  it('should delete the tree node', () => {
    document.body.innerHTML = '<p id="test"></p> <p id="tree-1"></p>'
    document.getElementById('test').domTree = 1
    pageDomTree.removeNode(document.getElementById('test'))
    expect(document.getElementById('tree-1')).toBe(null)
  })
})

describe('removeNodeFix', () => {
  let copy = {...pageDomTree}
  copy.createTree = jest.fn()
  copy.unwrapElement = jest.fn()
  copy.wrapElement = jest.fn()
  copy.treeData = {html: '', ids: [], counter: 0}

  it('should not run if element has children', () => {
    document.body.innerHTML = '<p id="test"><b></b></p> <p id="tree-1"></p>'
    copy.removeNodeFix(document.getElementById('test'))
    expect(copy.createTree.mock.calls.length).toBe(0)
  })

  it('should rerun createTree and insert the return', () => {
    document.body.innerHTML = '<p id="test"></p> <p id="tree-1"></p>'
    copy.createTree = () => {
      copy.treeData.html = '11'
    }
    document.getElementById('test').domTree = 1
    copy.removeNodeFix(document.getElementById('test'))
    expect(document.body.innerHTML).toBe('<p id="test"></p> 11')
  })
})

describe('addNode', () => {
  let copy = {...pageDomTree}
  copy.treeData = {html: '', ids: [], counter: 0}
  copy.build = jest.fn(() => { document.getElementById('test').domTree = 1 })
  copy.createTree = jest.fn(() => { copy.treeData.html = 'findMe' })
  copy.wrapElement = jest.fn()
  copy.unwrapElement = jest.fn()

  it('should build if element has no domtree id', () => {
    document.body.innerHTML = '<p id="test"></p> <p id="tree-1"></p>'
    copy.addNode(null, document.getElementById('test'))
    expect(copy.build.mock.calls.length).toBe(1)
  })

  it('should do nothing if appendStyle is empty', () => {
    document.body.innerHTML = '<p id="test"></p> <p id="tree-1"></p>'
    copy.addNode(null, document.getElementById('test'))
    expect(document.body.innerHTML).toBe('<p id="test"></p> <p id="tree-1"></p>')
  })

  it('should work with append after', () => {
    document.body.innerHTML = '<p id="test"></p> <p id="tree-1"></p>'
    copy.addNode('after', document.getElementById('test'))
    expect(document.body.innerHTML).toBe('<p id="test"></p> <p id="tree-1"></p>findMe')
  })

  it('should work with append before', () => {
    document.body.innerHTML = '<p id="test"></p> <p id="tree-1"></p>'
    copy.addNode('before', document.getElementById('test'))
    expect(document.body.innerHTML).toBe('<p id="test"></p> findMe<p id="tree-1"></p>')
  })

  it('should work with append in', () => {
    document.body.innerHTML = '<p id="test"></p> <p id="tree-1"></p>'
    copy.addNode('in', document.getElementById('test'))
    expect(document.body.innerHTML).toBe('<p id="test"></p> findMe')
  })
})

describe('createTree', () => {
  let copy = {...pageDomTree}
  describe('single li', () => {
    it('should create a single li', () => {
      document.body.innerHTML = '<body><p></p></body>'
      copy.treeData = {html: '', ids: [], counter: 0}
      copy.createTree(document.body)
      expect(copy.treeData.html).toMatch('<li class="tree-item')
    })

    it('should move id counter +1', () => {
      document.body.innerHTML = '<body><p></p></body>'
      copy.treeData = {html: '', ids: [], counter: 0}
      copy.createTree(document.body)
      expect(copy.treeData.counter).toBe(1)
    })

    it('should save the item with the id', () => {
      document.body.innerHTML = '<body><p id=test></p></body>'
      copy.treeData = {html: '', ids: [], counter: 0}
      copy.createTree(document.body)
      expect(copy.treeData.ids[0]).toEqual(document.getElementById('test'))
    })
  })

  describe('full tree', () => {
    it('should move id counter +3', () => {
      document.body.innerHTML = '<body><h1><p></p><p></p></h1></body>'
      copy.treeData = {html: '', ids: [], counter: 0}
      copy.createTree(document.body)
      expect(copy.treeData.counter).toBe(3)
    })

    it('should create an ul with li', () => {
      document.body.innerHTML = '<body><h1><p></p><p></p></h1></body>'
      copy.treeData = {html: '', ids: [], counter: 0}
      copy.createTree(document.body)
      document.body.innerHTML = copy.treeData.html
      expect(document.getElementsByTagName('ul')[0]).not.toBe(null)
      expect(document.getElementsByTagName('ul')[0].children.length).toBe(4)
    })
  })
})

describe('addRelationEvents', () => {
  let copy = {...pageDomTree}
  it('should create addEventListener', () => {
    document.body.innerHTML = '<div id="testDom"></div><iframe id="frame"></iframe>'
    copy.$domTree = document.getElementById('testDom')
    copy.$iframe = {}
    copy.$iframe.body = document.getElementById('frame')
    copy.addRelationClickEvents = jest.fn()
    copy.addRelationHoverEvents = jest.fn()
    copy.domTreeScrollToElement = jest.fn()
    copy.addRelationEvents()
    copy.$domTree.dispatchEvent(new MouseEvent('mousedown'))
    copy.$domTree.dispatchEvent(new MouseEvent('mouseover'))
    copy.$iframe.body.dispatchEvent(new MouseEvent('mousedown'))
    expect(copy.addRelationClickEvents.mock.calls.length).toBe(1)
    expect(copy.addRelationHoverEvents.mock.calls.length).toBe(1)
    expect(copy.domTreeScrollToElement.mock.calls.length).toBe(1)
  })
})

describe('iframeScrollToElement', () => {
  let fakeElem = {}
  fakeElem.scrollIntoView = jest.fn()
  it('should not work if allowScrollToElement is false', () => {
    pageDomTree.allowScrollToElement = false
    pageDomTree.iframeScrollToElement(fakeElem)
    expect(fakeElem.scrollIntoView.mock.calls.length).toBe(0)
  })

  it('should use scrollIntoView if scrollIntoViewIfNeeded is not aviable', () => {
    pageDomTree.allowScrollToElement = true
    pageDomTree.iframeScrollToElement(fakeElem)
    expect(fakeElem.scrollIntoView.mock.calls.length).toBe(1)
  })

  it('should use scrollIntoViewIfNeeded if aviable', () => {
    pageDomTree.allowScrollToElement = true
    fakeElem.scrollIntoViewIfNeeded = jest.fn()
    fakeElem.scrollIntoView = jest.fn()
    pageDomTree.iframeScrollToElement(fakeElem)
    expect(fakeElem.scrollIntoView.mock.calls.length).toBe(0)
    expect(fakeElem.scrollIntoViewIfNeeded.mock.calls.length).toBe(1)
  })
})
