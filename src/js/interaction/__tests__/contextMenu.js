/* global describe expect it MouseEvent */
const contextMenu = require('../contextMenu.js')

// create a contextMenu to test all
function resetDom () {
  document.body.innerHTML = '<p id="test"></p>'
  document.body.innerHTML += `<div class="contextMenu">
    <ul>
      <li>hi</li>
      <li>hi</li>
    </ul>
  </div>`
  return document.getElementsByClassName('contextMenu')
}

// prepare element appends styling and id to a dom element

describe('prepare Element', () => {
  let $contextMenu = resetDom()
  let ownContextMenu = {...contextMenu}
  ownContextMenu.prepareElement($contextMenu[0])

  it('should add a display none styling', () => {
    expect($contextMenu[0].getAttribute('style')).toBe('display: none;')
  })
  it('should add a id(contextMenu)', () => {
    expect($contextMenu[0].getAttribute('id')).toBe('contextMenu')
  })
})

describe('Initialize', () => {
  let $contextMenu = resetDom()
  let ownContextMenu = {...contextMenu}
  it('should not initialize if inputs are undefined', () => {
    ownContextMenu.init(document, null)
    expect(ownContextMenu.$domItem).toBe(null)
  })

  it('should initialize with working inputs', () => {
    ownContextMenu.init(document, $contextMenu[0])
    expect(ownContextMenu.$domItem).not.toBe(undefined)
  })
  // reset
  let ownContextMenu1 = {...contextMenu}

  it('should initialize with default values', () => {
    ownContextMenu1.init(null, $contextMenu[0])
    expect(ownContextMenu1.$domItem).not.toBe(undefined)
  })
})

describe('event bindings', () => {
  let $contextMenu = resetDom()
  let ownContextMenu = {...contextMenu}
  ownContextMenu.init(document, $contextMenu[0])

  it('should fire context menu', () => {
    let event = new MouseEvent('contextmenu')
    event.target = document.getElementById('test')
    document.dispatchEvent(event)
    expect($contextMenu[0].getAttribute('style')).not.toBe('display: none;')
  })

  it('should fire close context menu', () => {
    let event = new MouseEvent('click')
    event.force = true
    document.dispatchEvent(event)
    expect($contextMenu[0].getAttribute('style')).toBe('display: none;')
  })
})

describe('getBestPoition', () => {
  let $contextMenu = resetDom()
  let ownContextMenu = {...contextMenu}
  ownContextMenu.init(document, $contextMenu[0])
  let cube = 100
  window.innerWidth = cube
  window.innerHeight = cube
  let tolerance = 0 // tolerance

  it('should return top left ', () => {
    let pos = ownContextMenu.getBestPosition(0, 0)
    expect(pos.x).toBe(0)
    expect(pos.y).toBe(0)
  })

  it('should return bottom right', () => {
    let pos = ownContextMenu.getBestPosition(100, 100)
    expect(pos.x).toBe(cube - tolerance)
    expect(pos.y).toBe(cube - tolerance)
  })

  it('should return top right', () => {
    let pos = ownContextMenu.getBestPosition(0, 100)
    expect(pos.x).toBe(0)
    expect(pos.y).toBe(cube - tolerance)
  })

  it('should return bottom left', () => {
    let pos = ownContextMenu.getBestPosition(100, 0)
    expect(pos.x).toBe(cube - tolerance)
    expect(pos.y).toBe(0)
  })
})
