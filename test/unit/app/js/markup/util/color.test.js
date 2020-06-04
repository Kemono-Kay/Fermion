/* global describe, it, expect */

const path = require('path')
const { findClosestVanillaColor, findHSLColor } = require(path.join(process.cwd(), 'app', 'js', 'markup', 'util', 'Color.js'))

describe('The color utility module', () => {
  it('should have a \'findClosestVanillaColor\' function', () => {
    expect(findClosestVanillaColor).toBeInstanceOf(Function)
  })

  it('should have a \'findHSLColor\' function', () => {
    expect(findHSLColor).toBeInstanceOf(Function)
  })
})

describe('The \'findHSLColor\' function', () => {
  it.each([
    [255, 0, 0, 0],
    [0, 255, 0, 120],
    [0, 0, 255, 240]
  ])('should resolve the hue of rgb(%i, %i, %i) to be ~%f', (r, g, b, expected) => {
    expect(findHSLColor(r, g, b)[0]).toBeCloseTo(expected)
  })

  it.each([
    [128, 128, 128, 0],
    [255, 0, 0, 100],
    [0, 255, 0, 100],
    [0, 0, 255, 100]
  ])('should resolve the saturation of rgb(%i, %i, %i) to be ~%f', (r, g, b, expected) => {
    expect(findHSLColor(r, g, b)[1]).toBeCloseTo(expected)
  })

  it.each([
    [255, 255, 255, 100],
    [0, 0, 0, 0]
  ])('should resolve the luminosity of rgb(%i, %i, %i) to be ~%f', (r, g, b, expected) => {
    expect(findHSLColor(r, g, b)[2]).toBeCloseTo(expected)
  })
})

describe('The \'findClosestVanillaColor\' function', () => {
  describe.each([
    // Grayscale tones
    ['black', [[5, 5, 5], [0, 5, 5], [0, 0, 0], [30, 30, 30]]],
    ['gray', [[128, 128, 128], [130, 128, 128], [50, 50, 50], [180, 180, 180]]],
    ['white', [[250, 250, 250], [255, 250, 250], [200, 200, 200]]],

    // Hues
    ['red', [[255, 0, 0]]],
    ['orange', [[255, 128, 0], [255, 220, 200]]],
    ['yellow', [[255, 255, 0], [255, 255, 200], [50, 50, 0]]],
    ['green', [[0, 255, 0], [200, 255, 200], [0, 50, 0]]],
    ['cyan', [[0, 200, 255], [0, 40, 50], [200, 240, 255]]],
    ['blue', [[0, 0, 255], [0, 0, 50], [200, 200, 255]]],
    ['purple', [[255, 0, 255], [255, 200, 255], [50, 0, 50]]],

    // Variations
    ['pink', [[255, 128, 128], [255, 128, 172]]],
    ['brown', [[100, 50, 0], [50, 0, 0]]]
  ])('should return \'%s\'', (colName, colList) => {
    colList.forEach(a => a.unshift(colName))
    it.each(colList)('for a %sish color like rgb(%i, %i, %i)', (expected, r, g, b) => {
      expect(findClosestVanillaColor(r, g, b)).toEqual(expected)
    })
  })

  it.each([
    ['foo', 'bar', 'baz'],
    [10, 10, undefined],
    [10, 10, [10, 10]],
    [10, 10, {}],
    [10, 10, () => {}]
  ])('should return the sane fallback value \'black\' if given the invalid RGB value rgb(%o, %o, %o)', (r, g, b) => {
    expect(findClosestVanillaColor(r, g, b)).toBe('black')
  })
})
