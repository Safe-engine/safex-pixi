import { BaseComponentProps, Vec2 } from '..'
import { NoRenderComponentX } from '../components/BaseComponent'
import { PhysicsSprite } from './PhysicsSprite'
import { box2D } from './PhysicsSystem'

interface RigidBodyProps {
  type?: 0 | 1 | 2 // 0: Static, 1: Kinematic, 2: Dynamic
  density?: Float
  restitution?: Float
  friction?: Float
  gravityScale?: Float
  isSensor?: boolean
  tag?: number
  onBeginContact?: (other: RigidBody) => void
  onEndContact?: (other: RigidBody) => void
  onPreSolve?: (other: RigidBody, impulse?) => void
  onPostSolve?: (other: RigidBody, oldManifold?) => void
}

export class RigidBody extends NoRenderComponentX<RigidBodyProps> {
  body: Box2D.b2Body
  physicSprite: PhysicsSprite
  set linearVelocity(vel: Vec2) {
    if (!this.node) {
      return
    }
    this.body.SetLinearVelocity(new box2D.b2Vec2(vel.x, vel.y))
  }

  get linearVelocity() {
    if (!this.node) {
      return Vec2.ZERO
    }
    const vel = this.body.GetLinearVelocity()
    return Vec2(vel)
  }

  applyForceToCenter(vel: Vec2) {
    if (!this.node) {
      return
    }
    this.body.ApplyForceToCenter(new box2D.b2Vec2(vel.x, vel.y), true)
  }

  applyLinearImpulseToCenter(vel: Vec2) {
    if (!this.node) {
      return
    }
    // console.log('applyLinearImpulseToCenter', new box2D.b2Vec2(vel.x, vel.y))
    this.body.ApplyLinearImpulseToCenter(new box2D.b2Vec2(vel.x, vel.y), true)
  }

  set position(pos: Vec2) {
    this.physicSprite.node.position = Vec2(pos.x, pos.y)
    const physicsPos = new box2D.b2Vec2(pos.x, pos.y)
    // console.log('SetTransform', pos, physicsPos)
    const body = this.body
    body.SetLinearVelocity(new box2D.b2Vec2(0, 0))
    body.SetAngularVelocity(0)
    body.SetAwake(true)
    body.SetTransform(physicsPos, this.node.rotation)
  }

  get position() {
    return Vec2(this.physicSprite.getBody().GetPosition())
  }
}

interface BoxColliderPhysicsProps {
  width: number
  height: number
  offset?: [number, number]
}
export class PhysicsBoxCollider extends NoRenderComponentX<BoxColliderPhysicsProps & BaseComponentProps<PhysicsBoxCollider>> {
  // set onCollisionEnter(val) {
  //   const phys1 = this.getComponent(PhysicsCollider)
  //   phys1._onCollisionEnter = val
  // }
  // get onCollisionEnter() {
  //   const phys1 = this.getComponent(PhysicsCollider)
  //   return phys1._onCollisionEnter
  // }
}
interface CircleColliderPhysicsProps {
  radius: number
  offset?: [number, number]
}
export class PhysicsCircleCollider extends NoRenderComponentX<CircleColliderPhysicsProps & BaseComponentProps<PhysicsCircleCollider>> { }
interface PolygonColliderPhysicsProps {
  points: Array<Vec2> | [number, number][]
  offset?: [number, number]
}
export class PhysicsPolygonCollider extends NoRenderComponentX<PolygonColliderPhysicsProps & BaseComponentProps<PhysicsPolygonCollider>> { }
