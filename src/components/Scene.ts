import { EnhancedComponent, GameWorld } from '../base'

import { NodeComp } from './NodeComp'

export class SceneComponent extends EnhancedComponent<object, NodeComp> {
  render() {
    const world = GameWorld.Instance
    world.entities.reset()
    const root = world.entities.create()
    const node = root.assign(new NodeComp(GameWorld.Instance.app.stage, root))
    GameWorld.Instance.app.stage.eventMode = 'static'
    GameWorld.Instance.app.stage.hitArea = GameWorld.Instance.app.screen
    const sceneComponent = root.assign(this)
    sceneComponent.node = node
    return sceneComponent
  }
}
