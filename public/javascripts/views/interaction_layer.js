import { HEIGHT, WIDTH } from '../constants/index.js'

class InteractionLayer {
  constructor ({ element, model }) {
    this.element = element
    this.model = model
    this.state = {}

    this.setListeners()
  }

  setListeners () {
    this.element.addEventListener('mousemove', e => this.displayCoordinates(e), false)
    this.element.addEventListener('mousedown', e => this.startSelection(e))
    this.element.addEventListener('mousemove', e => this.updateSelection(e))
    this.element.addEventListener('mouseup', e => this.finalizeSelection(e))
  }

  getMouseCoordinates (event) {
    const { left, top } = this.element.getBoundingClientRect()
    const { clientX, clientY } = event
    const x = this.bounded(clientX - left, 0, WIDTH)
    const y = this.bounded(clientY - top, 0, HEIGHT)

    return [x, y]
  }

  scale (coordinates = []) {
    const [x, y] = coordinates
    const { rmax, rmin, xmax, xmin } = this.model.peek()
    const rspan = rmax - rmin
    const xspan = xmax - xmin
    const dr = rspan / WIDTH
    const dx = xspan / HEIGHT
    const scaledx = x * dr + rmin
    const scaledy = (HEIGHT - y) * dx + xmin

    return [scaledx, scaledy]
  }

  displayCoordinates (e) {
    const [x, y] = this.getMouseCoordinates(e)
    const [rvalue, xvalue] = this.scale([x, y]).map(value => value.toPrecision(10))
    const context = this.element.getContext('2d')

    this.clear()
    context.save()
    context.font = '16px serif'
    context.fillStyle = '#aaa'
    context.fillText(`(${rvalue}, ${xvalue})`, 0, HEIGHT - 10)
    context.restore()

    this.displayCrosshairsAt([x, y])
  }

  displayCrosshairsAt ([x, y]) {
    const context = this.element.getContext('2d')

    context.save()
    context.strokeStyle = '#aaa'
    context.lineWidth = 1
    context.setLineDash([3, 5])

    context.beginPath()
    context.moveTo(x, 0)
    context.lineTo(x, HEIGHT)
    context.stroke()

    context.beginPath()
    context.moveTo(0, y)
    context.lineTo(WIDTH, y)
    context.stroke()

    context.restore()
  }

  startSelection (e) {
    this.state.start = this.getMouseCoordinates(e)
  }

  updateSelection (e) {
    if (this.state.start) {
      const context = this.element.getContext('2d')
      const [x2, y2] = this.getMouseCoordinates(e)
      const [x1, y1] = this.state.start

      this.clear()
      this.displayCoordinates(e)
      context.strokeRect(x1, y1, x2 - x1, y2 - y1)
    }
  }

  finalizeSelection (e) {
    if (this.state.start) {
      const [r2, x2] = this.scale(this.getMouseCoordinates(e))
      const [r1, x1] = this.scale(this.state.start)
      const [rmin, rmax] = [r1, r2].sort()
      const [xmin, xmax] = [x1, x2].sort()

      this.clear()
      this.displayCoordinates(e)

      this.state.start = null
      this.model.push({ ...this.model.peek(), rmin, rmax, xmin, xmax })
    }
  }

  bounded (value, min, max) {
    const positive = Math.max(value, min)

    return Math.min(positive, max)
  }

  clear () {
    const context = this.element.getContext('2d')

    context.clearRect(0, 0, WIDTH, HEIGHT)
  }
}

export default InteractionLayer
