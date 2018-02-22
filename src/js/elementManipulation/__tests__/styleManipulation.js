/* global describe it expect */
const styleManipulation = require('../styleManipulation')
styleManipulation.init(document)

describe('getStyle', () => {
  let test1 = document.createElement('div')
  test1.style.width = '200px'
  it('should return false if elem or style is not given', () => {
    expect(styleManipulation.getStyle(null, null)).toBe(false)
    expect(styleManipulation.getStyle(test1, null)).toBe(false)
    expect(styleManipulation.getStyle(null, 'width')).toBe(false)
  })

  it('should return the style', () => {
    expect(styleManipulation.getStyle(test1, 'width')).toBe('200px')
  })

  it('should return the default style', () => {
    expect(styleManipulation.getStyle(test1, 'display')).toBe('block')
  })

  it('should return the word "default" id return is ""', () => {
    expect(styleManipulation.getStyle(test1, 'height')).toBe('default')
  })
})

describe('setInlineStyle', () => {
  let test2 = document.createElement('div')
  it('should return false if elem, style or value is not given', () => {
    expect(styleManipulation.setInlineStyle(null, null, null)).toBe(false)
    expect(styleManipulation.setInlineStyle(test2, null, '50px')).toBe(false)
    expect(styleManipulation.setInlineStyle(null, 'width', '50px')).toBe(false)
    expect(styleManipulation.setInlineStyle(test2, 'width', null)).toBe(false)
  })

  it('should set the style inline', () => {
    let elem = styleManipulation.setInlineStyle(test2, 'width', '100px')
    expect(elem.getAttribute('style')).toBe('width: 100px;')
    expect(elem.style.width).toBe('100px')
  })
})

describe('removeInlineStyle', () => {
  let test3 = document.createElement('div')
  test3.style.width = '100px'
  it('should return false if elem or style is not given', () => {
    expect(styleManipulation.removeInlineStyle(null, null)).toBe(false)
    expect(styleManipulation.removeInlineStyle(test3, null)).toBe(false)
    expect(styleManipulation.removeInlineStyle(null, 'width')).toBe(false)
  })

  it('should remove the inlineStyle', () => {
    let elem = styleManipulation.removeInlineStyle(test3, 'width')
    expect(elem.getAttribute('style')).toBe('')
  })
})

describe('removeInlineStyleFull', () => {
  let test4 = document.createElement('div')
  test4.style.width = '100px'
  test4.style.height = '100px'

  it('should return false if elem is not given', () => {
    expect(styleManipulation.removeInlineStyleFull(null)).toBe(false)
  })

  it('should remove the whole inlineStyle', () => {
    let elem = styleManipulation.removeInlineStyleFull(test4)
    expect(elem.getAttribute('style')).toBe('')
  })
})

describe('isCustomStyleTagPresent', () => {
  it('should add a custom style element', () => {
    document.getElementsByTagName('head')[0].innerHTML = ''
    styleManipulation.isCustomStyleTagPresent()
    expect(document.getElementsByTagName('head')[0].innerHTML)
      .toBe('<style id="customClassStyles"></style>')
  })

  it('should not add a custom style element if it already exists', () => {
    styleManipulation.isCustomStyleTagPresent()
    expect(document.getElementsByTagName('head')[0].innerHTML)
      .toBe('<style id="customClassStyles"></style>')
  })
})

describe('getCssClassByName', () => {
  it('should return false if not found', () => {
    styleManipulation.cssClasses = [{name: '.style', styles: []}]
    expect(styleManipulation.getCssClassByName('.WrongStyle')).toBe(undefined)
  })

  it('should retun the index if found', () => {
    styleManipulation.cssClasses = [{name: '.style', styles: []}]
    expect(styleManipulation.getCssClassByName('.style')).toEqual({name: '.style', styles: []})
  })
})

describe('createCssClass', () => {
  it('should fill the array and return the inserted value', () => {
    styleManipulation.cssClasses = []
    styleManipulation.createCssClass('.helloThere')
    expect(styleManipulation.cssClasses[0]).toEqual({'name': '.helloThere', 'styles': []})
  })
})

describe('removeCssClass', () => {
  it('should delete a cssClass', () => {
    styleManipulation.cssClasses = [{name: '.style', styles: []}]
    styleManipulation.removeCssClass(styleManipulation.cssClasses[0])
    expect(styleManipulation.cssClasses[0]).toBe(undefined)
  })
})

describe('addCssClassStyles', () => {
  it('should push style if it doesnt exist', () => {
    styleManipulation.cssClasses = [{name: '.style', styles: []}]
    styleManipulation.addCssClassStyles(styleManipulation.cssClasses[0], 'width', '100px')
    expect(styleManipulation.cssClasses[0].styles[0]).toEqual({'style': 'width', 'value': '100px'})
  })

  it('should change style', () => {
    styleManipulation.cssClasses = [{name: '.style', styles: [{'style': 'width', 'value': '100px'}]}]
    styleManipulation.addCssClassStyles(styleManipulation.cssClasses[0], 'width', '200px')
    expect(styleManipulation.cssClasses[0].styles[0]).toEqual({'style': 'width', 'value': '200px'})
  })
})

describe('removeCssClassStyles', () => {
  it('should delete style', () => {
    styleManipulation.cssClasses = [{name: '.style', styles: [{'style': 'width', 'value': '100px'}, {'style': 'height', 'value': '100px'}]}]
    styleManipulation.removeCssClassStyles(styleManipulation.cssClasses[0], 'width')
    expect(styleManipulation.cssClasses[0].styles[0]).toEqual({'style': 'height', 'value': '100px'})
  })
})

describe('addStyleToClass', () => {
  it('should create class if not found', () => {
    styleManipulation.cssClasses = []
    styleManipulation.addStyleToClass('.boi', 'width', '100px')
    expect(styleManipulation.cssClasses[0]).toEqual({'name': '.boi', 'styles': [{'style': 'width', 'value': '100px'}]})
  })

  it('should use existing class', () => {
    styleManipulation.cssClasses = [{name: '.style', styles: []}]
    styleManipulation.addStyleToClass('.style', 'width', '100px')
    expect(styleManipulation.cssClasses[0]).toEqual({'name': '.style', 'styles': [{'style': 'width', 'value': '100px'}]})
  })

  it('should add change existing style', () => {
    styleManipulation.cssClasses = [{name: '.style', styles: [{'style': 'width', 'value': '100px'}]}]
    styleManipulation.addStyleToClass('.style', 'width', '150px')
    expect(styleManipulation.cssClasses[0]).toEqual({'name': '.style', 'styles': [{'style': 'width', 'value': '150px'}]})
  })

  it('should add more style', () => {
    styleManipulation.cssClasses = [{name: '.style', styles: [{'style': 'width', 'value': '100px'}]}]
    styleManipulation.addStyleToClass('.style', 'height', '100px')
    expect(styleManipulation.cssClasses[0]).toEqual({'name': '.style', 'styles': [{'style': 'width', 'value': '100px'}, {'style': 'height', 'value': '100px'}]})
  })
})

describe('removeStyleFromClass', () => {
  it('should remove a style', () => {
    styleManipulation.cssClasses = [{name: '.style', styles: [{'style': 'width', 'value': '100px'}, {'style': 'height', 'value': '100px'}]}]
    styleManipulation.removeStyleFromClass('.style', 'height')
    expect(styleManipulation.cssClasses[0]).toEqual({'name': '.style', 'styles': [{'style': 'width', 'value': '100px'}]})
  })

  it('should return false if class cannot be found', () => {
    styleManipulation.cssClasses = [{name: '.style', styles: []}]
    expect(styleManipulation.removeStyleFromClass('.boi', 'height')).toBe(false)
  })

  it('should do nothing if style not found', () => {
    styleManipulation.cssClasses = [{name: '.style', styles: [{'style': 'width', 'value': '100px'}]}]
    styleManipulation.removeStyleFromClass('.style', 'height')
    expect(styleManipulation.cssClasses[0]).toEqual({'name': '.style', 'styles': [{'style': 'width', 'value': '100px'}]})
  })

  it('should remove whole class if empty after delete', () => {
    styleManipulation.cssClasses = [{name: '.style', styles: [{'style': 'width', 'value': '100px'}]}]
    styleManipulation.removeStyleFromClass('.style', 'width')
    expect(styleManipulation.cssClasses[0]).toEqual(undefined)
  })
})

describe('createStyleHTML', () => {
  it('should create valid css', () => {
    let should = `.style {\nwidth: 100px;\nheight: 100px;\n}\n`
    styleManipulation.cssClasses = [{name: 'style', styles: [{'style': 'width', 'value': '100px'}, {'style': 'height', 'value': '100px'}]}]
    styleManipulation.createStyleHTML()
    expect(styleManipulation.headStyle.innerHTML).toBe(should)
  })
})
