import chunk from 'lodash/chunk'
import flatten from 'lodash/flatten'
import max from 'lodash/max'
import min from 'lodash/min'
import { Graphics, Point, Rectangle, Size } from 'pixi.js'

import { BoxColliderProps, CircleColliderProps, PolygonColliderProps } from '../../@types/safex'
import { app } from '../app'
import { NoRenderComponentX } from '../components/BaseComponent'
import { NodeComp } from '../components/NodeComp'
import { v2 } from '../helper/utils'
import { circleCircle, polygonCircle, polygonPolygon } from './helper/Intersection'

function getNodeToWorldTransformAR(node: NodeComp) {
  const t = node.instance.worldTransform
  const x = node.instance.pivot.x * node.instance.width
  const y = node.instance.pivot.y * node.instance.height
  const transform = t.translate(x, y)
  return transform
}

function cloneRect(origin: Rectangle) {
  return new Rectangle(origin.x, origin.y, origin.width, origin.height)
}

export class Collider extends NoRenderComponentX {
  offset: Point
  tag: number
  enabled = true
  _worldPoints: Point[] = []
  _worldPosition: Point
  _worldRadius
  _AABB: Rectangle = new Rectangle(0, 0, 0, 0)
  _preAabb: Rectangle = new Rectangle(0, 0, 0, 0)
  onCollisionEnter?: (other: Collider) => void
  onCollisionExit?: (other: Collider) => void
  onCollisionStay?: (other: Collider) => void
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(dt: number, draw?: Graphics) { }
  getAABB() {
    return this._AABB
  }
  get world() {
    return {
      points: this._worldPoints,
      preAabb: this._preAabb,
    }
  }
  setOnCollisionEnter(cb: (other: Collider) => void) {
    const collider = this.getComponent(Collider)
    collider.onCollisionEnter = cb
  }
  setOnCollisionExit(cb: (other: Collider) => void) {
    const collider = this.getComponent(Collider)
    collider.onCollisionExit = cb
  }
  setOnCollisionStay(cb: (other: Collider) => void) {
    const collider = this.getComponent(Collider)
    collider.onCollisionStay = cb
  }
}

export class BoxCollider extends Collider {
  width: number
  height: number
  constructor(props: BoxColliderProps) {
    super(props)

  }
  get size(): Size {
    return this
  }

  set size(s: Size) {
    this.width = s.width
    this.height = s.height
  }

  update(dt, draw: Graphics) {
    if (!this.node) {
      return
    }
    const { x, y } = this.offset || v2()
    const hw = this.width * 0.5
    const hh = this.height * 0.5
    const transform = getNodeToWorldTransformAR(this.node)
    const rectTrs = new Rectangle(x - hw, y - hh, this.width, this.height)
    const collider = this.getComponent(Collider)
    collider._worldPoints[0] = transform.apply(v2(rectTrs.x, rectTrs.y))
    collider._worldPoints[1] = transform.apply(v2(rectTrs.x, rectTrs.y + rectTrs.height))
    collider._worldPoints[2] = transform.apply(v2(rectTrs.x + rectTrs.width, rectTrs.y + rectTrs.height))
    collider._worldPoints[3] = transform.apply(v2(rectTrs.x + rectTrs.width, rectTrs.y))

    const listX = collider._worldPoints.map(({ x }) => x)
    const listY = collider._worldPoints.map(({ y }) => y)
    collider._preAabb = cloneRect(collider._AABB)
    collider._AABB.x = min(listX)
    collider._AABB.y = min(listY)
    collider._AABB.width = max(listX) - collider._AABB.x
    collider._AABB.height = max(listY) - collider._AABB.y
    if (draw) {
      const drawList = collider._worldPoints.map(({ x, y }) => v2(x, app.screen.height - y))
      draw.poly(drawList)
    }
  }
}

export class CircleCollider extends Collider {
  radius: number
  constructor(props: CircleColliderProps) {
    super(props)
  }
  update(dt, draw: Graphics) {
    if (!this.node) {
      return
    }
    const transform = getNodeToWorldTransformAR(this.node)
    const collider = this.getComponent(Collider)
    collider._worldRadius = this.radius * this.node.scaleX
    collider._worldPosition = transform.apply(this.offset)
    if (draw) {
      const { x } = collider._worldPosition
      const y = app.screen.height - collider._worldPosition.y
      draw.rect(x, y, 2, 2)
      draw.circle(x, y, collider._worldRadius)
    }
    collider._preAabb = cloneRect(collider._AABB)
    collider._AABB.x = collider._worldPosition.x - collider._worldRadius
    collider._AABB.y = collider._worldPosition.y - collider._worldRadius
    collider._AABB.width = collider._worldRadius * 2
    collider._AABB.height = collider._AABB.width
    // draw.drawRect(p(this._AABB.x, this._AABB.y),
    //   p(this._worldPosition.x + this._worldRadius, this._worldPosition.y + this._worldRadius),
    //   Color.WHITE, 3, Color.DEBUG_BORDER_COLOR);
  }
}

export class PolygonCollider extends Collider {
  _points: number[]

  constructor(props: PolygonColliderProps) {
    super(props)
    this._points = props.points || []
  }

  get points(): Point[] {
    const { x, y } = this.offset
    const pointsList = chunk(this._points, 2).map(([px, py]) => v2(px + x, py + y))
    return pointsList
  }

  set points(points: Point[]) {
    this._points = flatten(points.map(({ x, y }) => [x, y]))
  }

  update(dt, draw: Graphics) {
    if (!this.node) {
      return
    }
    const transform = getNodeToWorldTransformAR(this.node)
    const collider = this.getComponent(Collider)
    collider._worldPoints = this.points.map((p) => transform.apply(p))
    // log(polyPoints);
    if (draw) {
      const drawList = collider._worldPoints.map(({ x, y }) => v2(x, app.screen.height - y))
      draw.poly(drawList)
    }
    const listX = collider._worldPoints.map(({ x }) => x)
    const listY = collider._worldPoints.map(({ y }) => y)
    collider._preAabb = cloneRect(collider._AABB)
    collider._AABB.x = min(listX)
    collider._AABB.y = min(listY)
    collider._AABB.width = max(listX) - collider._AABB.x
    collider._AABB.height = max(listY) - collider._AABB.y
    // draw.drawRect(p(this._AABB.x, this._AABB.y), p(max(listX), max(listY)),
    // Color.WHITE, 3, Color.DEBUG_BORDER_COLOR);
  }
}

export enum CollisionType {
  NONE,
  ENTER,
  STAY,
  EXIT,
}

function isPolygonCollider(col: Collider) {
  return col.getComponent(PolygonCollider) || col.getComponent(BoxCollider)
}
function isCircleCollider(col: Collider) {
  return col.getComponent(CircleCollider)
}

export class Contract {
  _collider1: Collider
  _collider2: Collider
  _touching: boolean
  _isPolygonPolygon: boolean
  _isCircleCircle: boolean
  _isPolygonCircle: boolean

  constructor(collider1: Collider, collider2: Collider) {
    this._collider1 = collider1
    this._collider2 = collider2
    const isCollider1Polygon = isPolygonCollider(collider1)
    const isCollider2Polygon = isPolygonCollider(collider2)
    const isCollider1Circle = isCircleCollider(collider1)
    const isCollider2Circle = isCircleCollider(collider2)

    if (isCollider1Polygon && isCollider2Polygon) {
      this._isPolygonPolygon = true
    } else if (isCollider1Circle && isCollider2Circle) {
      this._isCircleCircle = true
    } else if (isCollider1Polygon && isCollider2Circle) {
      this._isPolygonCircle = true
    } else if (isCollider1Circle && isCollider2Polygon) {
      this._isPolygonCircle = true
      this._collider1 = collider2
      this._collider2 = collider1
    }
    // log(this._isPolygonPolygon);
  }

  updateState() {
    const result = this.test()

    let type = CollisionType.NONE
    if (result && !this._touching) {
      this._touching = true
      type = CollisionType.ENTER
    } else if (result && this._touching) {
      type = CollisionType.STAY
    } else if (!result && this._touching) {
      this._touching = false
      type = CollisionType.EXIT
    }
    // console.log('updateState', result, this._touching, type)
    return type
  }

  test() {
    // if (!shouldCollider(this._collider1, this._collider2)) {
    //   return false
    // }
    // log(this._collider1.getAABB(), this._collider2.getAABB());
    if (!this._collider1.getAABB().intersects(this._collider2.getAABB())) {
      return false
    }

    if (this._isPolygonPolygon) {
      return polygonPolygon(this._collider1._worldPoints, this._collider2._worldPoints)
    }
    if (this._isCircleCircle) {
      const p1 = this._collider1
      const p2 = this._collider2
      return circleCircle(p1._worldPosition, p1._worldRadius, p2._worldPosition, p2._worldRadius)
    }

    if (this._isPolygonCircle) {
      const p2 = this._collider2
      return polygonCircle(this._collider1._worldPoints, p2._worldPosition, p2._worldRadius)
    }

    return false
  }
}
