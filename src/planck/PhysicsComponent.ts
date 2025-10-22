import { Body, BodyType, Vec2 } from 'planck'

import { ComponentX } from '../components/BaseComponent'
import { PhysicsSprite } from './PhysicsSprite'

interface RigidBodyProps {
  type?: BodyType
  density?: Float
  restitution?: Float
  friction?: Float
  gravityScale?: Float
  tag?: Integer
}
export class RigidBody extends ComponentX<RigidBodyProps> {
  body: Body
  // set linearVelocity(vel: Vec2) {
  //   if (!this.node) {
  //     return
  //   }
  //   const physics = this.node.instance
  //   if (physics instanceof Sprite) {
  //     physics.getBody().setVel(vel)
  //   }
  // }

  // get linearVelocity() {
  //   if (!this.node) {
  //     return Vec2.ZERO
  //   }
  //   const physics = this.node.instance
  //   const vel = (physics as Sprite).getBody().getVel()
  //   return v2(vel)
  // }
}

interface PhysicsMaterialProps {
  friction?: number
  restitution?: number
  density?: number
}
export class PhysicsMaterial extends ComponentX<PhysicsMaterialProps> { }

interface ColliderPhysicsProps {
  tag?: number
  group?: number
  offset?: Vec2
  onCollisionEnter?: (other: PhysicsCollider) => void
  onCollisionExit?: (other: PhysicsCollider) => void
  onCollisionStay?: (other: PhysicsCollider) => void
}

export class PhysicsCollider<T extends ColliderPhysicsProps = ColliderPhysicsProps> extends ComponentX<T, PhysicsSprite['node']> {
  enabled = true
  instance: PhysicsSprite
}

interface BoxColliderPhysicsProps extends ColliderPhysicsProps {
  width: number
  height: number
}
export class PhysicsBoxCollider extends PhysicsCollider<BoxColliderPhysicsProps> {
  // set onCollisionEnter(val) {
  //   const phys1 = this.getComponent(PhysicsCollider)
  //   phys1._onCollisionEnter = val
  // }
  // get onCollisionEnter() {
  //   const phys1 = this.getComponent(PhysicsCollider)
  //   return phys1._onCollisionEnter
  // }
}
interface CircleColliderPhysicsProps extends ColliderPhysicsProps {
  radius: number
}
export class PhysicsCircleCollider extends PhysicsCollider<CircleColliderPhysicsProps> { }
interface PolygonColliderPhysicsProps extends ColliderPhysicsProps {
  points: Array<Vec2>
}
export class PhysicsPolygonCollider extends PhysicsCollider<PolygonColliderPhysicsProps> { }
