import { Graphics, Rectangle, Size } from 'pixi.js'

import { BaseComponentProps, GameWorld, Vec2 } from '..'
import { NoRenderComponentX } from '../components/BaseComponent'
import { NodeComp } from '../components/NodeComp'
import { circleCircle, polygonCircle, polygonPolygon } from './helper/Intersection'
import { getMax, getMin } from './helper/utils'

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
interface ColliderProps extends BaseComponentProps<Collider> {
  tag?: number
  onCollisionEnter?: (other: Collider) => void
  onCollisionExit?: (other: Collider) => void
  onCollisionStay?: (other: Collider) => void
}

export class Collider<T = ColliderProps> extends NoRenderComponentX<T> {
  _worldPoints: Vec2[] = []
  _worldPosition: Vec2
  _worldRadius
  _AABB: Rectangle = new Rectangle(0, 0, 0, 0)
  _preAabb: Rectangle = new Rectangle(0, 0, 0, 0)

  // update(dt: number, draw?: Graphics) { }
  getAABB() {
    return this._AABB
  }
  get world() {
    return {
      points: this._worldPoints,
      preAabb: this._preAabb,
    }
  }
}

interface BoxColliderProps extends BaseComponentProps<BoxCollider> {
  offset?: [number, number]
  width: number
  height: number
}
export class BoxCollider extends Collider<BoxColliderProps> {
  get size(): Size {
    return this.props
  }

  set size(s: Size) {
    this.props.width = s.width
    this.props.height = s.height
  }

  update(dt, draw: Graphics) {
    if (!this.node) {
      return
    }
    const [x, y] = this.props.offset || [0, 0]
    // const hw = this.width * 0.5
    // const hh = this.height * 0.5
    const transform = getNodeToWorldTransformAR(this.node)
    // const dx = x - hw
    // const dy = y - hh
    const collider = this.getComponent(Collider)
    collider._worldPoints = [
      Vec2(x, y),
      Vec2(x, y + this.props.height),
      Vec2(x + this.props.width, y + this.props.height),
      Vec2(x + this.props.width, y),
    ].map((p) => transform.apply(p))
    // console.log("_worldPoints", collider._worldPoints, rectTrs)
    // collider._worldPoints = collider._worldPoints.map(p => transform.apply(p))
    const listX = collider._worldPoints.map(({ x }) => x)
    const listY = collider._worldPoints.map(({ y }) => y)
    collider._preAabb = cloneRect(collider._AABB)
    collider._AABB.x = getMin(listX)
    collider._AABB.y = getMin(listY)
    collider._AABB.width = getMax(listX) - collider._AABB.x
    collider._AABB.height = getMax(listY) - collider._AABB.y
    if (draw) {
      // console.log("drawing", JSON.stringify(collider._worldPoints))
      const drawList = collider._worldPoints
      // draw.clear()
      draw.poly(drawList)
      // draw.fill({ color: '#fff', alpha: 0.3 })
    }
  }
}

interface CircleColliderProps extends BaseComponentProps<CircleCollider> {
  offset?: [number, number]
  radius: number
}

export class CircleCollider extends Collider<CircleColliderProps> {
  update(dt, draw: Graphics) {
    if (!this.node) {
      return
    }
    const transform = getNodeToWorldTransformAR(this.node)
    const collider = this.getComponent(Collider)
    const [x, y] = this.props.offset || [0, 0]
    collider._worldRadius = this.props.radius * this.node.scaleX
    collider._worldPosition = transform.apply(Vec2(x, y))
    if (draw) {
      const { x } = collider._worldPosition
      const y = GameWorld.Instance.app.screen.height - collider._worldPosition.y
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

interface PolygonColliderProps extends BaseComponentProps<PolygonCollider> {
  offset?: [number, number]
  points: Array<Vec2>
}

export class PolygonCollider extends Collider<PolygonColliderProps> {
  get points(): Vec2[] {
    const [x, y] = this.props.offset || [0, 0]
    const pointsList = this.props.points.map((p) => Vec2(p.x + x, p.y + y))
    return pointsList
  }

  set points(points: Vec2[]) {
    this.props.points = points
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
      const drawList = collider._worldPoints.map(({ x, y }) => Vec2(x, GameWorld.Instance.app.screen.height - y))
      draw.poly(drawList)
    }
    const listX = collider._worldPoints.map(({ x }) => x)
    const listY = collider._worldPoints.map(({ y }) => y)
    collider._preAabb = cloneRect(collider._AABB)
    collider._AABB.x = getMin(listX)
    collider._AABB.y = getMin(listY)
    collider._AABB.width = getMax(listX) - collider._AABB.x
    collider._AABB.height = getMax(listY) - collider._AABB.y
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
