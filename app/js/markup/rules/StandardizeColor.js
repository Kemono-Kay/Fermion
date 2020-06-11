/* eslint-env browser */

/**
 * A function for converting any sort of color to a 6-digit hex code.
 * This is a separate module because that makes it easier to mock in jest.
 * @param {String} col - color in any css-valid format.
 */
function standardizeColor (col) {
  const ctx = document.createElement('canvas').getContext('2d')
  ctx.fillStyle = col
  return ctx.fillStyle
}

module.exports = standardizeColor
