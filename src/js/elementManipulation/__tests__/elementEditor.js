/* global describe it expect jest Event */
const elementEditor = require('../elementEditor')
const classEditor = require('../elementEditor').classEditor
const styleManipulation = require('../styleManipulation')
let testHTML = `
  <div id="elementEditor"> </div>
  <div class="element-properties"></div>
  <div class="element-properties"></div>
`

describe('init', () => {
  it('should run cacheDom and bindEvents', () => {
    classEditor.init = jest.fn()
    let copy = {...elementEditor}
    copy.cacheDom = jest.fn()
    copy.bindGlobalEvent = jest.fn()
    copy.init()
    expect(copy.cacheDom.mock.calls.length).toBe(1)
    expect(copy.bindGlobalEvent.mock.calls.length).toBe(1)
  })
})

describe('cacheDom', () => {
  it('should save allEvents and elementProperties', () => {
    document.body.innerHTML = testHTML
    elementEditor.cacheDom()
    expect(elementEditor.$allEvents).toBe(document.getElementById('elementEditor'))
    expect(elementEditor.$elementProperties).toBe(document.getElementsByClassName('element-properties'))
  })

  it('should save queryContent', () => {
    document.body.innerHTML = `
    <div id="elementEditor">
      <input editCSS="color" id="idWithEdit">
      <input editProp="editProp" id="idWithProp">
      <input>
      <div class="radio" editCSS="color" id="radioWithEdit"></div>
      <div class="radio"></div>
      <div class="expandable-container" id="expandable"></div>
    </div>
    `
    elementEditor.cacheDom()
    expect(elementEditor.inputs).toEqual([document.getElementById('idWithEdit')])
    expect(elementEditor.radios).toEqual([document.getElementById('radioWithEdit')])
    expect(elementEditor.expandable).toEqual([document.getElementById('expandable')])
    expect(elementEditor.inputProp).toEqual([document.getElementById('idWithProp')])
  })
})

describe('bindGlobalEvent', () => {
  it('should trigger change events', () => {
    document.body.innerHTML = ''
    let copy = {...elementEditor}
    let eventChange = new Event('change')

    let input = document.createElement('p')
    copy.inputs = [input]
    copy.inputChanged = jest.fn()

    let inputProp = document.createElement('p')
    copy.inputProp = [inputProp]
    copy.propChanged = jest.fn()

    copy.bindGlobalEvent()
    input.dispatchEvent(eventChange)
    inputProp.dispatchEvent(eventChange)
    expect(copy.inputChanged.mock.calls.length).toBe(1)
    expect(copy.propChanged.mock.calls.length).toBe(1)
  })

  it('should trigger mousedown events', () => {
    document.body.innerHTML = '<div id="radio"><p id="child"></p></div>'
    let copy = {...elementEditor}
    let event = new Event('mousedown')

    copy.radios = [document.getElementById('radio')]
    copy.radioClicked = jest.fn()
    copy.bindGlobalEvent()
    document.getElementById('child').dispatchEvent(event)

    expect(copy.radioClicked.mock.calls.length).toBe(1)
  })

  it('should run expandable', () => {
    let copy = {...elementEditor}
    copy.expandable = ['1', '2']
    copy.toggleExpandable = jest.fn()
    copy.bindGlobalEvent()
    expect(copy.toggleExpandable.mock.calls.length).toBe(2)
  })
})

describe('rgbToHex', () => {
  it('should convert rgb() to hex', () => {
    expect(elementEditor.rgbToHex('rgb(66, 134, 244)')).toBe('#4286f4')
    expect(elementEditor.rgbToHex('rgb(86, 0, 178)')).toBe('#5600b2')
    expect(elementEditor.rgbToHex('rgb(0, 255, 174)')).toBe('#00ffae')
  })

  it('should convert rgba() to hex', () => {
    expect(elementEditor.rgbToHex('rgba(66, 134, 244, 0)')).toBe('#4286f4')
    expect(elementEditor.rgbToHex('rgba(86, 0, 178, 0)')).toBe('#5600b2')
    expect(elementEditor.rgbToHex('rgba(0, 255, 174, 0)')).toBe('#00ffae')
  })
})

describe('toggleExpandable', () => {
  it('should toggle element visibility', () => {
    let event = new Event('mousedown')
    document.body.innerHTML = `<div class="openContent active"></div><div class="expandable-content"></div>`
    elementEditor.toggleExpandable(document.body)
    let opener = document.getElementsByClassName('openContent')[0]
    let open = document.getElementsByClassName('expandable-content')[0]
    opener.dispatchEvent(event)
    expect(opener.classList.contains('active')).toBe(false)
    expect(open.classList.contains('active')).toBe(true)
  })
})

describe('select', () => {
  it('should save selectedItem', () => {
    classEditor.select = jest.fn()
    let copy = {...elementEditor}
    copy.setStyles = jest.fn()
    copy.showProperties = jest.fn()
    copy.showPropertiesValue = jest.fn()
    copy.select('test')
    expect(copy.selectedItem).toBe('test')
  })
})

describe('unselect', () => {
  it('should remove selectedItem', () => {
    let copy = {...elementEditor}
    copy.selectedItem = 'test'
    copy.unselect()
    expect(copy.selectedItem).toBe(null)
  })
})

describe('showProperties', () => {
  it('should return false if selectedItem is not present', () => {
    let copy = {...elementEditor}
    copy.selectedItem = null
    expect(copy.showProperties()).toBe(false)
  })

  it('should display div with same nodeName', () => {
    let copy = {...elementEditor}
    document.body.innerHTML = `<div id="one" inputFor="color"></div><div id="two" inputFor="else"></div>`
    let one = document.getElementById('one')
    let two = document.getElementById('two')
    copy.selectedItem = one
    copy.$elementProperties = [one, two]
    copy.showProperties('color')
    expect(one.classList.contains('active')).toBe(true)
  })
})

describe('showPropertiesValue', () => {
  it('should return false if selectedItem is not present', () => {
    let copy = {...elementEditor}
    copy.selectedItem = null
    expect(copy.showPropertiesValue()).toBe(false)
  })

  it('should add value of current property', () => {
    let copy = {...elementEditor}
    document.body.innerHTML = `<div id="one" color="red"></div><input id="input" editProp="color" value="">`
    let one = document.getElementById('one')
    let input = document.getElementById('input')
    copy.selectedItem = one
    copy.inputProp = [input]
    copy.showPropertiesValue('color')
    expect(input.value).toBe('red')
  })
})

describe('propChanged', () => {
  it('should return false if selectedItem is not present', () => {
    let copy = {...elementEditor}
    copy.selectedItem = null
    expect(copy.propChanged()).toBe(false)
  })

  it('should replace the value', () => {
    let copy = {...elementEditor}
    document.body.innerHTML = `<div id="one" color="green">`
    let one = document.getElementById('one')
    copy.selectedItem = one
    let e = { currentTarget: { value: 'red', getAttribute (v) { return 'color' } } }
    copy.propChanged(e)
    expect(one.getAttribute('color')).toBe('red')
  })

  it('should delete the value', () => {
    let copy = {...elementEditor}
    document.body.innerHTML = `<div id="one" color="green">`
    let one = document.getElementById('one')
    copy.selectedItem = one
    let e = { currentTarget: { value: '', getAttribute (v) { return 'color' } } }
    copy.propChanged(e)
    expect(one.getAttribute('color')).toBe(null)
  })
})

describe('setStyles', () => {
  it('should run setStylesInputs and setStylesRadios (without class)', () => {
    let copy = {...elementEditor}
    copy.setStylesInputs = jest.fn()
    copy.setStylesRadios = jest.fn()
    copy.setStyles()
    expect(copy.setStylesInputs.mock.calls.length).toBe(1)
    expect(copy.setStylesRadios.mock.calls.length).toBe(1)
  })

  it('should run setStylesInputs and setStylesRadios (with class)', () => {
    classEditor.createClassStyle = jest.fn()
    classEditor.removeStyleClass = jest.fn()
    classEditor.cssClass = true
    let copy = {...elementEditor}
    copy.setStylesInputs = jest.fn()
    copy.setStylesRadios = jest.fn()
    copy.setStyles()
    expect(copy.setStylesInputs.mock.calls.length).toBe(1)
    expect(copy.setStylesInputs.mock.calls.length).toBe(1)
    expect(classEditor.createClassStyle.mock.calls.length).toBe(1)
    expect(classEditor.removeStyleClass.mock.calls.length).toBe(1)
    classEditor.cssClass = null
  })
})

describe('setStylesInputs', () => {
  it('should fill input with style information (inline)', () => {
    let mock = jest.fn()
    mock.mockReturnValue('red')

    classEditor.getStyleClass = mock
    styleManipulation.getStyle = mock
    let copy = {...elementEditor}
    copy.rgbToHex = jest.fn()
    copy.inputs = [{ value: 'no', getAttribute () { return 'red' } }]

    copy.setStylesInputs(false)
    expect(copy.inputs[0].value).toBe('red')
    expect(mock.mock.calls.length).toBe(1)
  })

  it('should fill input with style information (class)', () => {
    let mock = jest.fn()
    mock.mockReturnValue('red')
    classEditor.getStyleClass = mock
    styleManipulation.getStyle = mock

    let copy = {...elementEditor}
    copy.rgbToHex = jest.fn()
    copy.inputs = [{ value: 'no', getAttribute () { return 'red' } }]

    copy.setStylesInputs(true)
    expect(copy.inputs[0].value).toBe('red')
    expect(mock.mock.calls.length).toBe(1)
  })
})

describe('setStylesRadios', () => {
  it('should set radio with value (inline)', () => {
    document.body.innerHTML = `<div radio editCSS="position" id="radio">
      <div val="static" class="item"></div>
      <div val="relative" class="item"></div>
      <div val="absolute" class="item"></div>
      <div id="fixed" val="fixed" class="item"></div>
    </div>`
    let mock = jest.fn()
    mock.mockReturnValue('fixed')
    classEditor.getStyleClass = mock
    styleManipulation.getStyle = mock

    let copy = {...elementEditor}
    copy.radios = [document.getElementById('radio')]
    copy.setStylesRadios(false)

    expect(document.getElementById('fixed').classList.contains('active')).toBe(true)
  })

  it('should set radio with value (class)', () => {
    document.body.innerHTML = `<div radio editCSS="position" id="radio">
      <div val="static" class="item"></div>
      <div val="relative" class="item"></div>
      <div val="absolute" class="item"></div>
      <div id="fixed" val="fixed" class="item"></div>
    </div>`
    let mock = jest.fn()
    mock.mockReturnValue('fixed')
    classEditor.getStyleClass = mock
    styleManipulation.getStyle = mock

    let copy = {...elementEditor}
    copy.radios = [document.getElementById('radio')]
    copy.setStylesRadios(true)

    expect(document.getElementById('fixed').classList.contains('active')).toBe(true)
  })
})

describe('removeStyle', () => {
  it('should remove inline Style', () => {
    styleManipulation.removeInlineStyle = jest.fn()

    elementEditor.removeStyle('color')
    expect(styleManipulation.removeInlineStyle.mock.calls.length).toBe(1)
  })

  it('should remove class Style', () => {
    classEditor.cssClass = true
    styleManipulation.removeStyleFromClass = jest.fn()
    styleManipulation.createStyleHTML = jest.fn()

    elementEditor.removeStyle('color')
    expect(styleManipulation.removeStyleFromClass.mock.calls.length).toBe(1)
    expect(styleManipulation.createStyleHTML.mock.calls.length).toBe(1)
    classEditor.cssClass = null
  })
})

describe('inputChanged', () => {
  it('should run changeCurrentStyle', () => {
    let copy = {...elementEditor}
    copy.changeCurrentStyle = jest.fn()
    copy.inputChanged({currentTarget: { getAttribute () {} }})
    expect(copy.changeCurrentStyle.mock.calls.length).toBe(1)
  })
})

describe('radioClicked', () => {
  it('should run changeCurrentStyle', () => {
    let copy = {...elementEditor}
    copy.changeCurrentStyle = jest.fn()
    copy.radioClicked({currentTarget: { parentNode: {getAttribute () {}}, getAttribute () {} }})
    expect(copy.changeCurrentStyle.mock.calls.length).toBe(1)
  })
})

describe('changeCurrentStyle', () => {
  it('should run changeStyle (inline)', () => {
    let copy = {...elementEditor}
    classEditor.cssClass = null
    styleManipulation.setInlineStyle = jest.fn()
    copy.changeCurrentStyle()
    expect(styleManipulation.setInlineStyle.mock.calls.length).toBe(1)
  })

  it('should run changeStyle (class)', () => {
    let copy = {...elementEditor}
    classEditor.cssClass = true
    styleManipulation.addStyleToClass = jest.fn()
    styleManipulation.createStyleHTML = jest.fn()
    copy.changeCurrentStyle()
    expect(styleManipulation.addStyleToClass.mock.calls.length).toBe(1)
    expect(styleManipulation.createStyleHTML.mock.calls.length).toBe(1)
  })
})
