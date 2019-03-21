/* global describe it expect jest */
const contentExplorer = require('../contentExplorer')

describe('getScripts', () => {
  it('should return all script tags', () => {
    document.body.innerHTML = '<script id="123"></script>'
    expect(contentExplorer.getScripts(document).length).toBe(1)
  })

  it('should not return any script tag', () => {
    document.body.innerHTML = ''
    expect(contentExplorer.getScripts(document).length).toBe(0)
  })
})

describe('getCss', () => {
  it('should return all link tags', () => {
    document.body.innerHTML = '<link id="123">'
    expect(contentExplorer.getCss(document).length).toBe(1)
  })

  it('should not return any link tag', () => {
    document.body.innerHTML = ''
    expect(contentExplorer.getCss(document).length).toBe(0)
  })
})
