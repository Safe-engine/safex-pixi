import { Container } from 'pixi.js'
import { EnhancedComponent, GameWorld } from '../base'

import { NodeComp } from './NodeComp'

export class NoRenderComponentX<C extends Container = Container> extends EnhancedComponent<NodeComp<C>> {
  static create(data?: any) {
    return new this(data)
  }
}

export class ComponentX<C extends Container = Container> extends EnhancedComponent<NodeComp<C>> {
  static hasRender = true
  static create(data?: any) {
    const world = GameWorld.Instance
    const root = world.entities.create()
    const comp = root.assign(new this(data))
    return comp
  }
}
