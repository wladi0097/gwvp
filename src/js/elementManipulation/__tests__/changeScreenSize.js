/* global describe it expect jest MouseEvent */
const changeScreenSize = require('../changeScreenSize')

const html = `<div class="header-icons">
  <i id="screen-Tv"></i>
  <i id="screen-Computer"></i>
  <i id="screen-Tablet"></i>
  <i id="screen-Mobile"></i>
</div>
<div class="hover-wrapper" style="min-width: 1200px; transform: scale(1)"></div>
<div class="click-wrapper" style="min-width: 1200px; transform: scale(1)"></div>
<iframe src="/public" id="simulated" style="min-width: 1200px; transform: scale(1)"></iframe>
`
document.body.innerHTML = html

describe('cacheDom', () => {
  it('should cache all dom items', () => {
    changeScreenSize.cacheDom()
    expect(changeScreenSize.$hover).not.toBe()
    expect(changeScreenSize.$click).not.toBe()
    expect(changeScreenSize.$simulated).not.toBe()
    expect(changeScreenSize.$buttons).not.toBe()
    // buttons
    expect(changeScreenSize.$tv).not.toBe()
    expect(changeScreenSize.$computer).not.toBe()
    expect(changeScreenSize.$tablet).not.toBe()
    expect(changeScreenSize.$mobile).not.toBe()
  })
})

describe('bindEvents', () => {
  let copy = {...changeScreenSize}
  copy.cacheDom()
  copy.bindEvents()
  it('should fire event on click', () => {
    copy.changeResolution = jest.fn()
    let event = new MouseEvent('mousedown')
    copy.$tv.dispatchEvent(event)
    expect(copy.changeResolution.mock.calls.length).toBe(1)
    copy.$computer.dispatchEvent(event)
    expect(copy.changeResolution.mock.calls.length).toBe(2)
    copy.$tablet.dispatchEvent(event)
    expect(copy.changeResolution.mock.calls.length).toBe(3)
    copy.$mobile.dispatchEvent(event)
    expect(copy.changeResolution.mock.calls.length).toBe(4)
  })
})

describe('applyStyle', () => {
  it('should add css to $hover, $click and $simulated.', () => {
    changeScreenSize.width = 666
    changeScreenSize.scale = 0.66
    changeScreenSize.applyStyle()
    expect(changeScreenSize.$hover.getAttribute('style')).toBe('width: 666px; min-width:666px; transform: scale(0.66)')
    expect(changeScreenSize.$click.getAttribute('style')).toBe('width: 666px; min-width:666px; transform: scale(0.66)')
    expect(changeScreenSize.$simulated.getAttribute('style')).toBe('width: 666px; min-width:666px; transform: scale(0.66)')
  })
})

describe('changeResolution', () => {
  it('should ignore invalid input and return the default', () => {
    changeScreenSize.changeResolution('invalid input')
    expect(changeScreenSize.width).toBe(1200)
  })
  it('should set TV', () => {
    changeScreenSize.changeResolution('Tv')
    expect(changeScreenSize.width).toBe(1200)
    expect(changeScreenSize.$tv.classList.contains('selected'))
  })
  it('should set Computer', () => {
    changeScreenSize.changeResolution('Computer')
    expect(changeScreenSize.width).toBe(979)
    expect(changeScreenSize.$computer.classList.contains('selected'))
  })
  it('should set Tablet', () => {
    changeScreenSize.changeResolution('Tablet')
    expect(changeScreenSize.width).toBe(767)
    expect(changeScreenSize.$tablet.classList.contains('selected'))
  })
  it('should set Mobile', () => {
    changeScreenSize.changeResolution('Mobile')
    expect(changeScreenSize.width).toBe(480)
    expect(changeScreenSize.$mobile.classList.contains('selected'))
  })
})

describe('changeZoom', () => {
  it('should return false if value is bigger than 2.0 and lower than 0.5', () => {
    expect(changeScreenSize.changeZoom(10.0)).toBe(false)
    expect(changeScreenSize.changeZoom(0.1)).toBe(false)
  })
  it('should change zoom', () => {
    changeScreenSize.changeZoom(1.2)
    expect(changeScreenSize.scale).toBe(1.2)
  })
})

describe('init', () => {
  it('should run', () => {
    let copy = {...changeScreenSize}
    copy.cacheDom = jest.fn()
    copy.bindEvents = jest.fn()
    copy.init()
    expect(copy.cacheDom.mock.calls.length).toBe(1)
    expect(copy.bindEvents.mock.calls.length).toBe(1)
  })
})
