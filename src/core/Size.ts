class _Size {
  width: number
  height: number
  static ZERO
  constructor(width = 0, height = 0) {
    if (!(this instanceof _Size)) {
      return new _Size(width, height)
    }
    if (height === undefined) {
      this.width = (width as any).width
      this.height = (width as any).height
    }
    this.width = width
    this.height = height
  }
}

export type Size = _Size
export function Size(x?: number, y?: number): Size {
  return new _Size(x, y)
}
