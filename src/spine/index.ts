import { GameWorld } from '..'
import { SpineSystem } from './SpineSystem'

export * from './SpineComponent'
export * from './SpineSystem'

export function setupSpine() {
  // GameWorld.Instance.listUpdate.push(SpineSystem)
  GameWorld.Instance.systems.addThenConfigure(SpineSystem)
}
