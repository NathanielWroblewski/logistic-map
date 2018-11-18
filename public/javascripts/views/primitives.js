const TAU = 2 * Math.PI

export const point = ({ element, x, y, stroke = '#336E7B', fill = '#fff' }) => {
  const context = element.getContext('2d')

  context.save()
  context.beginPath()
  context.arc(x, y, 2, 0, TAU, false)
  context.fillStyle = fill
  context.fill()
  context.lineWidth = 2
  context.strokeStyle = stroke
  context.stroke()
  context.restore()
}

export const line = ({ element, x, y, from: [x1, y1], stroke = '#336E7B' }) => {
  const context = element.getContext('2d')

  context.save()
  context.beginPath()
  context.moveTo(x1, y1)
  context.lineTo(x, y)
  context.lineWidth = 2
  context.strokeStyle = stroke
  context.stroke()
  context.restore()
}

export const pixel = ({ element, x, y, fill = 'rgba(51, 110, 123, 0.5)' }) => {
  const context = element.getContext('2d')

  context.save()
  context.fillStyle = fill
  context.fillRect(x, y, 1, 1)
  context.restore()
}
