export const logisticMap = ({ r, x }) => {
  return r * x * (1 - x)
}

export const iterate = (iteratedFunction, { x, r }, { offset, limit }, callback) => {
  for (let i = 0; i < offset; i++) {
    x = iteratedFunction({ x, r })
  }

  for (let i = 0; i < limit; i++) {
    callback(x = iteratedFunction({ x, r }))
  }
}
