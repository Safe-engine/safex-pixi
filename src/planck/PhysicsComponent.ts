import { Body, BodyType, Vec2 } from 'planck'

import { NoRenderComponentX } from '../components/BaseComponent'
import { PhysicsSprite } from './PhysicsSprite'

interface RigidBodyProps {
  type?: BodyType
  density?: Float
  restitution?: Float
  friction?: Float
  gravityScale?: Float
}
export class RigidBody extends NoRenderComponentX<RigidBodyProps> {
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
export class PhysicsMaterial extends NoRenderComponentX<PhysicsMaterialProps> {

}

interface ColliderPhysicsProps {
  tag?: number
  group?: number
  offset?: Vec2
  onCollisionEnter?: (other: ColliderPhysics) => void
  onCollisionExit?: (other: ColliderPhysics) => void
  onCollisionStay?: (other: ColliderPhysics) => void
}

export class ColliderPhysics<T extends ColliderPhysicsProps = ColliderPhysicsProps> extends NoRenderComponentX<T, PhysicsSprite['node']> {
  enabled = true
  instance: PhysicsSprite
}

interface BoxColliderPhysicsProps extends ColliderPhysicsProps {
  width: number
  height: number
}
export class BoxColliderPhysics extends ColliderPhysics<BoxColliderPhysicsProps> {

  // set onCollisionEnter(val) {
  //   const phys1 = this.getComponent(ColliderPhysics)
  //   phys1._onCollisionEnter = val
  // }

  // get onCollisionEnter() {
  //   const phys1 = this.getComponent(ColliderPhysics)
  //   return phys1._onCollisionEnter
  // }
}
interface CircleColliderPhysicsProps extends ColliderPhysicsProps {
  radius: number
}
export class CircleColliderPhysics extends ColliderPhysics<CircleColliderPhysicsProps> {
}
interface PolygonColliderPhysicsProps extends ColliderPhysicsProps {
  points: Array<Vec2>
}
export class PolygonColliderPhysics extends ColliderPhysics<PolygonColliderPhysicsProps> {
}
