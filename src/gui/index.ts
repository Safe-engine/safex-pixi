import { GameWorld } from '..'
import { GUISystem } from './GUISystem'

export * from './GUIComponent'
export * from './GUISystem'

export function setupGUI() {
  const world = GameWorld.Instance
  world.systems.addThenConfigure(GUISystem)
}
