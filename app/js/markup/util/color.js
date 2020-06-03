
/**
 * Gives a function for assessing whether a value is in the provided range.
 * @param {Boolean|undefined|Number[]} args - Info based on which to build the function.
 * @returns {Function} The requested function.
 */
function setRange (...args) {
  return args.map((arg) =>
    arg === true || arg === undefined
      ? () => true
      : arg[0] < arg[1]
        ? i => i >= arg[0] && i <= arg[1]
        : i => i >= arg[0] || i <= arg[1])
}

/**
 * Vanilla colors for F-List.
 */
const vanillaColors = ['red', 'blue', 'white', 'yellow', 'pink', 'gray', 'green', 'orange', 'purple', 'black', 'brown', 'cyan']

/**
 * An object that carries the data for 'findClosestVanillaColor'.
 * Order matters; if an earlier color matches, it's used over a later one that also matches.
 * @see findClosestVanillaColor
 */
const closestColorRanges = {
  white: [setRange(true, [0, 10], [75, 100]), setRange(true, true, [95, 100])],
  gray: [setRange(true, [0, 10], [15, 75])],
  black: [setRange(true, [0, 10], [0, 15]), setRange(true, true, [0, 5])],
  pink: [setRange([330, 15], true, [65, 100])],
  brown: [setRange([340, 40], true, [0, 30])],
  red: [setRange([330, 15])],
  orange: [setRange([15, 40])],
  yellow: [setRange([40, 60])],
  green: [setRange([60, 160])],
  cyan: [setRange([160, 200])],
  blue: [setRange([200, 255])],
  purple: [setRange([255, 330])]
}

/**
 * Converts a color from RGB to HSL format.
 * @param {Number} r - Red channel.
 * @param {Number} g - Green channel.
 * @param {Number} b - Blue channel.
 * @returns {Number[]} The color in HSL format. One channel per array index.
 */
function findHSLColor (r, g, b) {
  r /= 255
  g /= 255
  b /= 255
  const cmin = Math.min(r, g, b)
  const cmax = Math.max(r, g, b)
  const delta = cmax - cmin
  let h = 0
  let s = 0
  let l = 0
  if (delta === 0) {
    h = 0
  } else if (cmax === r) {
    h = ((g - b) / delta) % 6
  } else if (cmax === g) {
    h = (b - r) / delta + 2
  } else {
    h = (r - g) / delta + 4
  }
  h = Math.round(h * 60)
  if (h < 0) h += 360
  l = (cmax + cmin) / 2
  s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1))
  s = +(s * 100).toFixed(1)
  l = +(l * 100).toFixed(1)
  return [h || 0, s || 0, l || 0]
}

/**
 * Finds the closest corresponding F-List colour to the provided one.
 * @param {Number} r - Red channel.
 * @param {Number} g - Green channel.
 * @param {Number} b - Blue channel.
 * @returns {String} The name of the matching color.
 * @see closestColorRanges
 */
function findClosestVanillaColor (r, g, b) {
  const col = findHSLColor(r, g, b)
  for (const colName in closestColorRanges) {
    if (closestColorRanges[colName].some(a => a.every((fn, i) => fn(col[i])))) return colName
  }
}

module.exports = { findClosestVanillaColor, findHSLColor, vanillaColors }
