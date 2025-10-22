import { GameWorld } from '..'
import { DragonBonesSystem } from './DragonBonesSystem'

export * from './DragonBonesComponent'
export * from './DragonBonesSystem'

export function setupDragonBones() {
  GameWorld.Instance.systems.addThenConfigure(DragonBonesSystem)
}
