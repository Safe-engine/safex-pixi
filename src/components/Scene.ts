import { app } from '../app'
import { EnhancedComponent, GameWorld } from '../base'

import { NodeComp } from './NodeComp'

export class SceneComponent extends EnhancedComponent<{}, NodeComp> {

  static create() {
    const world = GameWorld.Instance
    world.entities.reset()
    const root = world.entities.create()
    const node = root.assign(new NodeComp(app.stage, root))
    const sceneComponent = root.assign(new SceneComponent())
    sceneComponent.node = node
    return sceneComponent
  }

}
