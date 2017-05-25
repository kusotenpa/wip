export function getUVs(length, x, y) {
  if (!(length && x)) return
  y = y || x

  const uvs = new Float32Array(length)
  let position = 0

  for (let _x = 0; _x < x; _x++) {
    for (let _y = 0; _y < y; _y++) {
      uvs[ position++ ] = _x / (x - 1)
      uvs[ position++ ] = _y / (y - 1)
    }
  }

  return uvs
}

export default {
  getUVs,
}
