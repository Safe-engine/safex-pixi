import { GameWorld } from '..'
import { CollideSystem, enabledDebugDraw } from './CollideSystem'

export * from './CollideComponent'
export * from './CollideSystem'
export * from './helper/Intersection'

export function setupCollider(colliderMatrix?, debug = false) {
  const collideSystem = GameWorld.Instance.addSystemAndUpdate(CollideSystem)
  if (colliderMatrix) {
    collideSystem.colliderMatrix = colliderMatrix
  }
  enabledDebugDraw(debug)
}
