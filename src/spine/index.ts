import { GameWorld } from '..'
import { SpineSystem } from './SpineSystem'

export * from './SpineComponent'
export * from './SpineSystem'

export function setupSpine() {
  GameWorld.Instance.systems.add(SpineSystem)
  // GameWorld.Instance.listUpdate.push(SpineSystem)
  GameWorld.Instance.systems.configureOnce(SpineSystem)
}
