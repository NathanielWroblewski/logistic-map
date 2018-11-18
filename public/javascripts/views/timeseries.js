import { point, line } from './primitives.js'

const render = ({ element, iterations = 100, iteratedFunction, params, height = HEIGHT, width = WIDTH }) => {
  const { xo, r } = params
  const dt = (width - 5) / iterations
  const values = []
  let xn = xo

  for (let iteration = 0; iteration < iterations; iteration++) {
    xn = iteratedFunction({ x: xn, r })
    const x = (iteration + 1) * dt
    const y = Math.round((1 - xn) * height)

    if (y >= 0 && y < height) {
      values.push([x, y])
    }
  }

  values.forEach(([x, y], index) => {
    if (index) {
      line({ element, x, y, from: values[index - 1] })
    }

    point({ element, x, y })
  })
}

export default render
