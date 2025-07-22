import { Container } from 'pixi.js'
import { Vec2, radiansToDegrees } from '..'

export class PhysicsSprite {
  node: Container
  physicsBody: Box2D.b2Body

  constructor(node: Container, body: Box2D.b2Body) {
    this.node = node
    this.physicsBody = body
  }

  update(dt: number) {
    if (!this.physicsBody) {
      return
    }
    // const pos = this.physicsBody.GetPosition()
    // use lerp to smooth the position update
    const pos = Vec2(
      lerp(this.node.x, this.physicsBody.GetPosition().x, dt * 10),
      lerp(this.node.y, this.physicsBody.GetPosition().y, dt * 10),
    )
    this.node.position = Vec2(pos.x, pos.y)
    // lerp the rotation
    this.node.rotation = lerp(this.node.rotation, radiansToDegrees(-this.physicsBody.GetAngle()), dt * 10)
    // this.node.setRotation(radiansToDegrees(this.physicsBody.GetAngle()))
    // this.node.setScale(1 / pixelsPerMeter)
    // this.node.setScale(1 / this.physicsBody.GetFixtureList().GetShape().GetRadius())
  }

  getBody() {
    return this.physicsBody
  }

  set position(val: Box2D.b2Vec2) {
    this.physicsBody.SetTransform(val, this.node.rotation)
  }

  // set x(val) {
  //   this.physicsBody.setPosition(Vec2(val, this.y))
  // }
  // set y(val) {
  //   this.physicsBody.setPosition(Vec2(this.x, val))
  // }

  get x() {
    return this.physicsBody.GetPosition().x
  }

  get y() {
    return this.physicsBody.GetPosition().x
  }

  // set angle(val: number) {
  //   this.physicsBody.setAngle(val)
  // }

  get angle() {
    return this.physicsBody.GetAngle()
  }

  addChild(child: Container) {
    this.node.addChild(child)
  }
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}
