import { Container } from 'pixi.js'
import { EnhancedComponent, GameWorld } from '../base'

import { NodeComp } from './NodeComp'

export class NoRenderComponentX<Props = Object, C extends Container = Container> extends EnhancedComponent<Props, NodeComp<C>> {
  static create(data?: any) {
    return new this(data)
  }
}

export class ComponentX<Props = Object, C extends Container = Container> extends EnhancedComponent<Props, NodeComp<C>> {
  static hasRender = true
  render?(data?: Props): any
  static create(data?: any) {
    // console.log('create', this, this.prototype['render'])
    if (this.prototype.render) return this.prototype.render(data)
    const world = GameWorld.Instance
    const root = world.entities.create()
    const comp = root.assign(new this(data))
    return comp
  }
}
