import { Container } from 'pixi.js'
import { Body, Vec2 } from 'planck'

export class PhysicsSprite {
  node: Container
  physicsBody: Body

  constructor(node: Container, body: Body) {
    this.node = node
    this.physicsBody = body
  }

  set position(val: Vec2) {
    this.physicsBody.setPosition(val)
  }

  set x(val) {
    this.physicsBody.setPosition(Vec2(val, this.y))
  }
  set y(val) {
    this.physicsBody.setPosition(Vec2(this.x, val))
  }

  get x() {
    return this.physicsBody.getPosition().x
  }

  get y() {
    return this.physicsBody.getPosition().x
  }

  set angle(val: number) {
    this.physicsBody.setAngle(val)
  }

  get angle() {
    return this.physicsBody.getAngle()
  }

  addChild(child: Container) {
    this.node.addChild(child)
  }
}
