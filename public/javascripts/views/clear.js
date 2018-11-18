import { HEIGHT, WIDTH } from '../constants/index.js'

const clear = ({ element, height = HEIGHT, width = WIDTH }) => {
  const context = element.getContext('2d')

  context.clearRect(0, 0, width, height)
}

export default clear
