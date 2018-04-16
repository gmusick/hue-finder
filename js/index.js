const img = document.createElement('img')
img.src = 'images/color.jpg'

img.onload = () => {
  const height = img.height
  const width = img.width

  const canvas = document.createElement('canvas')
  canvas.height = height
  canvas.width = width

  const ctx = canvas.getContext('2d')
  ctx.drawImage(img, 0, 0)

  let colors = []

  let currentX = 0
  let blockSizeX = 40
  let currentY = 0
  let blockSizeY = 40

  while (currentY < height) {
    if (currentY + blockSizeY > height) {
      break
    }

    while (currentX < width) {
      if (currentX + blockSizeX > width) {
        break
      }

      const imageData = ctx.getImageData(
        currentX,
        currentY,
        blockSizeX,
        blockSizeY,
      )
      const pixels = imageData.data

      // const rgb = averageColorOf(pixels)
      const dominantColor = dominantColorOf(pixels)
      colors.push({
        height: blockSizeY,
        hsl: dominantColor,
        imageData,
        // rgb,
        width: blockSizeX,
      })

      currentX += blockSizeX
    }

    currentX = 0
    currentY += blockSizeY
  }

  const grouped = {
    0: [],
    30: [],
    60: [],
    90: [],
    120: [],
    150: [],
    180: [],
    210: [],
    240: [],
    270: [],
    300: [],
    330: [],
  }
  colors.forEach(color => {
    const hue = color.hsl.hue
    console.log('color hue', hue)

    if (hue < 30) {
      grouped['0'].push(color)
    } else if (hue < 60) {
      grouped['30'].push(color)
    } else if (hue < 90) {
      grouped['60'].push(color)
    } else if (hue < 120) {
      grouped['90'].push(color)
    } else if (hue < 150) {
      grouped['120'].push(color)
    } else if (hue < 180) {
      grouped['150'].push(color)
    } else if (hue < 210) {
      grouped['180'].push(color)
    } else if (hue < 240) {
      grouped['210'].push(color)
    } else if (hue < 270) {
      grouped['240'].push(color)
    } else if (hue < 300) {
      grouped['270'].push(color)
    } else if (hue < 330) {
      grouped['300'].push(color)
    } else if (hue <= 360) {
      grouped['330'].push(color)
    }
  })

  const keysAsNumbers = Object.keys(grouped).map(k => parseInt(k, 10))
  keysAsNumbers.sort((a, b) => a - b).forEach(group => {
    appendDivider(group)
    console.log('group', group, grouped[group])
    grouped[group].forEach(color => {
      appendColor(color)
    })
  })
  // const sorted = colors.sort((a, b) => {
  //   const hueSort = a.hsv.hue - b.hsv.hue
  //   if (hueSort !== 0) {
  //     return hueSort
  //   }
  //
  //   const valueSort = a.hsv.value - b.hsv.value
  //   if (valueSort !== 0) {
  //     return valueSort
  //   }
  //
  //   return a.hsv.saturation - b.hsv.saturation
  // })

  // sorted.forEach(color => {
  //   appendColor(color, blockSize)
  // })
  // console.log(sorted.length)

  // const hsv = toHsv(average.r / 255, average.g / 255, average.b / 255)
  // console.log('hsv', hsv)

  // const box2 = document.createElement('div')
  // const bg = `hsla(${hsv.hue}, ${hsv.saturation}%, ${hsv.lightness}%, 1)`
  // console.log(bg)
  // box2.style.backgroundColor = `hsla(${hsv.hue}, ${hsv.saturation}%, ${
  //   hsv.lightness
  // }%, 1)`
  // box2.style.height = '100px'
  // box2.style.width = '100px'
  // document.body.appendChild(box2)
}

const averageColorOf = pixels => {
  const rgb = {
    r: 0,
    g: 0,
    b: 0,
  }

  const count = pixels.length

  for (let i = 0; i < count; i += 4) {
    rgb.r += pixels[i]
    rgb.g += pixels[i + 1]
    rgb.b += pixels[i + 2]
  }

  const pixelCount = count / 4
  return {
    r: ~~(rgb.r / pixelCount),
    g: ~~(rgb.g / pixelCount),
    b: ~~(rgb.b / pixelCount),
  }
}

const dominantColorOf = pixels => {
  const count = pixels.length

  let colors = {}

  for (let i = 0; i < count; i += 4) {
    const r = pixels[i]
    const g = pixels[i + 1]
    const b = pixels[i + 2]

    const hsl = hslOf(r, g, b)

    if (colors[hsl.hue]) {
      colors[hsl.hue].count += 1
    } else {
      colors[hsl.hue] = {
        count: 1,
        hsl,
      }
    }
  }

  console.log(colors)
  const sortedByCount = Object.keys(colors)
    .sort((a, b) => colors[a].count - colors[b].count)
    .reverse()

  return colors[sortedByCount[0]].hsl
}

const appendColor = color => {
  const box = document.createElement('canvas')
  box.height = color.height
  box.width = color.width

  const ctx = box.getContext('2d')
  ctx.putImageData(color.imageData, 0, 0)

  // const box2 = document.createElement('div')
  // box2.style.height = '50px'
  // box2.style.width = '50px'
  //
  // const hsl = color.hsl
  // box2.style.backgroundColor = `hsl(${hsl.hue}, ${hsl.saturation}%, ${
  //   hsl.luminence
  // }%, 1)`

  document.body.appendChild(box)
  // document.body.appendChild(box2)
}

const appendDivider = label => {
  const divider = document.createElement('div')
  divider.style.height = '20px'
  divider.style.backgroundColor = '#ccc'
  divider.innerText = label

  document.body.appendChild(divider)
}

const toHsv = (r, g, b) => {
  const max = Math.max.apply(Math, [r, g, b])
  const min = Math.min.apply(Math, [r, g, b])

  const chroma = max - min
  let hue = 0
  let value = max
  let saturation = 0

  if (value > 0) {
    saturation = chroma / value
    if (saturation > 0) {
      if (r === max) {
        hue = 60 * ((g - min - (b - min)) / chroma)
        if (hue < 0) {
          hue += 360
        }
      } else if (g == max) {
        hue = 120 + 60 * ((b - min - (r - min)) / chroma)
      } else if (b == max) {
        hue = 240 + 60 * ((r - min - (g - min)) / chroma)
      }
    }
    // if (r === max) {
    //   hue = (((g - b) / chroma) % 6) * 60
    // } else if (g === max) {
    //   hue = ((b - r) / chroma + 2) * 60
    // } else if (b === max) {
    //   hue = ((r - g) / chroma + 4) * 60
    // }
  }

  return {
    hue,
    saturation,
    value,
  }
}

const hslOf = (r, g, b) => {
  const normalizedR = r / 255
  const normalizedG = g / 255
  const normalizedB = b / 255

  const max = Math.max.apply(Math, [normalizedR, normalizedG, normalizedB])
  const min = Math.min.apply(Math, [normalizedR, normalizedG, normalizedB])

  const luminence = Math.round((max + min) / 2 * 100)

  let saturation
  if (luminence < 0.5) {
    saturation = (max - min) / (max + min)
  } else {
    saturation = (max - min) / (2 - max - min)
  }
  saturation = Math.round(saturation * 100)

  let hue
  if (normalizedR === max) {
    hue = (normalizedG - normalizedB) / (max - min)
  } else if (normalizedG === max) {
    hue = 2 + (normalizedB - normalizedR) / (max - min)
  } else if (normalizedB === max) {
    hue = 4 + (normalizedR - normalizedG) / (max - min)
  }

  let degrees = hue * 60
  if (degrees < 0) {
    degrees += 360
  }
  degrees = Math.round(degrees)

  return {
    hue: degrees,
    saturation,
    luminence,
  }
}
