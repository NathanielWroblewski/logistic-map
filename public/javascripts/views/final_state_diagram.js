import { HEIGHT } from '../constants/index.js'
import { iterate } from '../utilities/iterated_functions.js'
import { pixel } from './primitives.js'

export const render = ({ element, iteratedFunction, args, params, height = HEIGHT, roffset, renderer = pixel }) => {
  const { xmax, xmin, offset, limit } = params
  const xspan = xmax - xmin

  iterate(iteratedFunction, args, { offset, limit }, x => {
    const y = Math.round(((xmax - x) / xspan) * height)

    if (y >= 0 && y < height) {
      renderer({ element, x: roffset, y })
    }
  })
}

export default render
