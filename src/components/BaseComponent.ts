import { Container } from 'pixi.js'
import { EnhancedComponent, GameWorld } from '../base'

import { NodeComp } from './NodeComp'

export class NoRenderComponentX<Props = Object, C extends Container = Container> extends EnhancedComponent<Props, NodeComp<C>> {
}

export class ComponentX<Props = Object, C extends Container = Container> extends EnhancedComponent<Props, NodeComp<C>> {
  static hasRender = true
  render?(): this {
    const world = GameWorld.Instance
    const root = world.entities.create()
    const comp = root.assign(this)
    return comp
  }
}
