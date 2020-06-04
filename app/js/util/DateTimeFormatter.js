/* eslint-env browser */
/* eslint-disable no-unused-vars */

function formatTimestamp (format, unixmillis = new Date().getTime()) {
  const formats = {
    yyyy: { format: { year: 'numeric' }, get: 'year' },
    yyy: { format: { year: 'numeric' }, get: 'year', func: info => String(info).slice(1) },
    yy: { format: { year: '2-digit' }, get: 'year' },
    y: { format: { year: '2-digit' }, get: 'year', func: info => info[1] },

    ddth: { format: { day: '2-digit' }, get: 'day', func: info => info + (info[0] === '1' || !['1', '2', '3'].includes(info[1]) ? 'th' : ['st', 'nd', 'rd'][info[1] - 1]) },
    dd: { format: { day: '2-digit' }, get: 'day' },
    dth: { format: { day: '2-digit' }, get: 'day', func: info => (info[0] === 0 ? info[1] : info) + (info[0] === '1' || !['1', '2', '3'].includes(info[1]) ? 'th' : ['st', 'nd', 'rd'][info[1] - 1]) },
    d: { format: { day: 'numeric' }, get: 'day' },

    ww: { format: { weekday: 'long' }, get: 'weekday' },
    w: { format: { weekday: 'short' }, get: 'weekday' },

    mmmm: { format: { month: 'long' }, get: 'month' },
    mmm: { format: { month: 'short' }, get: 'month' },
    mm: { format: { month: '2-digit' }, get: 'month' },
    m: { format: { month: 'numeric' }, get: 'month' },

    am: { format: { hourCycle: 'h12', hour: 'numeric' }, get: 'dayPeriod', func: info => info.toLowerCase() },
    AM: { format: { hourCycle: 'h12', hour: 'numeric' }, get: 'dayPeriod' },

    hh: { format: { hourCycle: 'h12', hour: '2-digit' }, get: 'hour' },
    h: { format: { hourCycle: 'h12', hour: 'numeric' }, get: 'hour' },
    HH: { format: { hourCycle: 'h23', hour: '2-digit' }, get: 'hour' },
    H: { format: { hourCycle: 'h23', hour: 'numeric' }, get: 'hour' },

    ii: { format: { minute: '2-digit' }, get: 'minute', func: info => String(info).padStart(2, 0) },
    i: { format: { minute: 'numeric' }, get: 'minute' },

    ss: { format: { second: '2-digit' }, get: 'second', func: info => String(info).padStart(2, 0) },
    s: { format: { second: 'numeric' }, get: 'second' },

    uuuuuu: { format: {}, get: 'year', func: () => String(unixmillis % 1000).padStart(3, 0) + '000' },
    uuuuu: { format: {}, get: 'year', func: () => String(unixmillis % 1000).padStart(3, 0) + '00' },
    uuuu: { format: {}, get: 'year', func: () => String(unixmillis % 1000).padStart(3, 0) + '0' },
    uuu: { format: {}, get: 'year', func: () => String(unixmillis % 1000).padStart(3, 0) },
    uu: { format: {}, get: 'year', func: () => String(unixmillis % 1000).padStart(3, 0).slice(0, 2) },
    u: { format: {}, get: 'year', func: () => String(unixmillis % 1000).padStart(3, 0).slice(0, 1) },

    z: { format: { timeZoneName: 'short', timeZone: 'America/New_York' }, get: 'timeZoneName' }

  }
  formats.pm = formats.am
  formats.PM = formats.AM

  const fetchFormatEntry = function (args) {
    const format = Intl.DateTimeFormat('en-US', args.format)
    const part = format.formatToParts(new Date(unixmillis)).find(part => part.type === args.get)
    return args.func === undefined ? part.value : args.func(part.value)
  }

  // console.log('ii', fetchFormatEntry(formats.ii))
  // console.log('HH', fetchFormatEntry(formats.HH))

  for (const key in formats) {
    // console.log(key, fetchFormatEntry(formats[key]))
    format = format
      .split(`\\${key}`)
      .map((str, ind) => ind === 0 ? str : fetchFormatEntry(formats[key]) + str)
      .join('')
  }

  return format
}
