import clamp from 'lodash/clamp';
import { Point } from 'pixi.js'

class _Vec2 extends Point {
  x: number
  y: number
  static ZERO

  equals(other: Point) {
    return this.x === other.x && this.y === other.y
  }

  addSelf(value: Point): Point {
    const nor = value.add(new Point(this.x, this.y))
    this.x = nor.x
    this.y = nor.y
    return nor
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
    theta = clamp(theta, -1.0, 1.0)
    return Math.acos(theta)
  }
}
export type Vec2 = _Vec2
export function Vec2(x = 0, y = 0): Vec2 {
  return new _Vec2(x, y)
}
Vec2.ZERO = Object.freeze(Vec2(0, 0))
