import { HEIGHT, WIDTH } from '../constants/index.js'
import renderFinalStateDiagram from './final_state_diagram.js'

const render = ({ element, iteratedFunction, params, height = HEIGHT, width = WIDTH }) => {
  const { rmin, rmax, xo } = params
  const rspan = rmax - rmin
  const dr = rspan / width

  for (let column = 0; column < width; column++) {
    const r = rmin + (column * dr)
    const args = { x: xo, r }

    renderFinalStateDiagram({
      element, iteratedFunction, args, params, height, roffset: column
    })
  }
}

export default render
