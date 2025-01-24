import { Body, BodyType, Vec2 } from 'planck'

import { BoxColliderPhysicsProps, CircleColliderPhysicsProps, ColliderPhysicsProps, PhysicsMaterialProps, PolygonColliderPhysicsProps, RigidBodyProps } from '../../@types/safex'
import { NoRenderComponentX } from '../components/BaseComponent'
import { PhysicsSprite } from './PhysicsSprite'


export class RigidBody extends NoRenderComponentX<RigidBodyProps> {
  type: BodyType = 'dynamic'
  density = 1
  restitution = 0.5
  friction = 0.3
  body: Body
  gravityScale = 1
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

export class PhysicsMaterial extends NoRenderComponentX<PhysicsMaterialProps> {
  density = 1
  restitution = 0
  friction = 0
}

export class ColliderPhysics<T extends ColliderPhysicsProps = ColliderPhysicsProps> extends NoRenderComponentX<T, PhysicsSprite['node']> {
  tag = 0
  group = 0
  offset: Vec2 = Vec2.zero()
  onCollisionEnter: (other: ColliderPhysics) => void
  onCollisionExit: (other: ColliderPhysics) => void
  enabled = true
  instance: PhysicsSprite
}

export class BoxColliderPhysics extends ColliderPhysics<BoxColliderPhysicsProps> {
  width: number
  height: number

  // set onCollisionEnter(val) {
  //   const phys1 = this.getComponent(ColliderPhysics)
  //   phys1._onCollisionEnter = val
  // }

  // get onCollisionEnter() {
  //   const phys1 = this.getComponent(ColliderPhysics)
  //   return phys1._onCollisionEnter
  // }
}

export class CircleColliderPhysics extends ColliderPhysics<CircleColliderPhysicsProps> {
  radius: number
}

export class PolygonColliderPhysics extends ColliderPhysics<PolygonColliderPhysicsProps> {
  points: number[]
}
