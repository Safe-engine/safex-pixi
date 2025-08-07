import { Point } from 'pixi.js'

import { clampf } from './math'

export function updatePoint(p) {
  const { x, y } = p
  return Vec2(x, y)
}

class _Vec2 {
  x: number
  y: number
  static ZERO
  constructor(x: number | object = 0, y = 0) {
    if (!(this instanceof _Vec2)) {
      return new _Vec2(x, y)
    }
    if (typeof x === 'object') {
      this.x = (x as any).x
      this.y = (x as any).y
      return
    }
    this.x = x
    this.y = y
  }

  equals(other: _Vec2) {
    return this.x === other.x && this.y === other.y
  }

  add(value: Point | Vec2): _Vec2 {
    return updatePoint(new Point(this.x, this.y).add(value))
  }

  addSelf(value: Point | Vec2): _Vec2 {
    const nor = updatePoint(new Point(this.x, this.y).add(value))
    this.x = nor.x
    this.y = nor.y
    return nor
  }

  sub(value: Point | Vec2): _Vec2 {
    return updatePoint(new Point(this.x, this.y).subtract(value))
  }

  mul(multiply: number): _Vec2 {
    return updatePoint(new Point(this.x, this.y).multiply(new Point(multiply, multiply)))
  }

  mulSelf(multiply: number): _Vec2 {
    const nor = updatePoint(new Point(this.x, this.y).multiply(new Point(multiply, multiply)))
    this.x = nor.x
    this.y = nor.y
    return nor
  }

  mag(): number {
    return new Point(this.x, this.y).magnitude()
  }

  normalizeSelf(): _Vec2 {
    const nor = updatePoint(new Point(this.x, this.y).normalize())
    this.x = nor.x
    this.y = nor.y
    return nor
  }

  normalize(): _Vec2 {
    return updatePoint(new Point(this.x, this.y).normalize())
  }

  public cross(other: Vec2) {
    return this.x * other.y - this.y * other.x
  }
  public signAngle(other: Vec2) {
    const angle = this.angle(other)
    return this.cross(other) < 0 ? -angle : angle
  }
  public lengthSqr() {
    return this.x * this.x + this.y * this.y
  }
  public dot(other: Vec2) {
    return this.x * other.x + this.y * other.y
  }
  public angle(other: Vec2) {
    const magSqr1 = this.lengthSqr()
    const magSqr2 = other.lengthSqr()

    if (magSqr1 === 0 || magSqr2 === 0) {
      console.warn('Cant get angle between zero vector')
      return 0.0
    }

    const dot = this.dot(other)
    let theta = dot / Math.sqrt(magSqr1 * magSqr2)
    theta = clampf(theta, -1.0, 1.0)
    return Math.acos(theta)
  }
  public distance(other: _Vec2) {
    return this.sub(other).mag()
  }
  clone() {
    return Vec2(this.x, this.y)
  }
}
export type Vec2 = _Vec2
export function Vec2(x?: number | object, y?: number): Vec2 {
  return new _Vec2(x, y)
}

Vec2.ZERO = Object.freeze(Vec2(0, 0))
