import { GameWorld, Vec2 } from '..'
import { PhysicsSystem, setColliderMatrix } from './PhysicsSystem'

export * from './PhysicsComponent'
export * from './PhysicsSprite'
export * from './PhysicsSystem'

export function setupPhysics(colliderMatrix, isDebugDraw?: boolean, gravity?: Vec2) {
  // console.log('app world', world.app)
  const physicsSystem = GameWorld.Instance.addSystemAndUpdate(PhysicsSystem)
  if (isDebugDraw) {
    physicsSystem.addDebug()
  }
  if (gravity) {
    physicsSystem.gravity = gravity
  }
  setColliderMatrix(colliderMatrix)
}
