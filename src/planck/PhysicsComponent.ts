import { Body, Vec2 } from 'planck'

import { BoxColliderPhysicsProps, CircleColliderPhysicsProps, PhysicsMaterialProps, PolygonColliderPhysicsProps } from '../../@types/safex'
import { NoRenderComponentX } from '../components/BaseComponent'
import { PhysicsSprite } from './PhysicsSprite'

export type BodyType = 'kinematic' | 'dynamic' | 'static'

export class RigidBody extends NoRenderComponentX {
  type: BodyType = 'dynamic'
  density = 1
  restitution = 0
  friction = 0
  body: Body
  gravityScale = 0
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

export class ColliderPhysics<T = {}> extends NoRenderComponentX<T> {
  tag = 0
  group = 0
  offset: Vec2 = Vec2.zero()
  _onCollisionEnter: (other: ColliderPhysics) => void
  enabled = true
  instance: PhysicsSprite
}

export class BoxColliderPhysics extends ColliderPhysics<BoxColliderPhysicsProps> {
  width: number
  height: number

  set onCollisionEnter(val) {
    const phys1 = this.getComponent(ColliderPhysics)
    phys1._onCollisionEnter = val
  }

  get onCollisionEnter() {
    const phys1 = this.getComponent(ColliderPhysics)
    return phys1._onCollisionEnter
  }
}

export class CircleColliderPhysics extends ColliderPhysics<CircleColliderPhysicsProps> {
  radius: number
}

export class PolygonColliderPhysics extends ColliderPhysics<PolygonColliderPhysicsProps> {
  points: number[]
}
