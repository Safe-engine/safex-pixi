import { GameWorld, Vec2 } from '..'
import { PhysicsSystem } from './PhysicsSystem'

export * from './PhysicsComponent'
export * from './PhysicsSprite'
export * from './PhysicsSystem'

export function setupPhysics(world = GameWorld.Instance, isDebugDraw?: boolean, gravity?: Vec2) {
  // console.log('app world', world.app)
  const physicsSystem = world.addSystemAndUpdate(PhysicsSystem)
  if (isDebugDraw) {
    physicsSystem.addDebug()
  }
  if (gravity) {
    physicsSystem.gravity = gravity
  }
}
