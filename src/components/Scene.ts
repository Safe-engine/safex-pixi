import { app } from '../app'
import { EnhancedComponent, GameWorld } from '../base'

import { NodeComp } from './NodeComp'

export class SceneComponent extends EnhancedComponent<{}, NodeComp> {
  render() {
    const world = GameWorld.Instance
    world.entities.reset()
    const root = world.entities.create()
    const node = root.assign(new NodeComp(app.stage, root))
    const sceneComponent = root.assign(this)
    sceneComponent.node = node
    return sceneComponent
  }

}
