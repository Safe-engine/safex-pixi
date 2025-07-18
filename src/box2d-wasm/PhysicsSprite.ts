import { Container } from 'pixi.js'

export class PhysicsSprite {
  node: Container
  physicsBody: Box2D.b2Body

  constructor(node: Container, body: Box2D.b2Body) {
    this.node = node
    this.physicsBody = body
  }

  // set position(val: Box2D.b2Vec2) {
  //   this.physicsBody.setPosition(val)
  // }

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
