import { Container } from 'pixi.js'
import { EnhancedComponent, GameWorld } from '../base'

import { NodeComp } from './NodeComp'

export class ComponentX<Props = object, C extends Container = Container> extends EnhancedComponent<Props, NodeComp<C>> {
  render?(): this
}

export function render() {
  const world = GameWorld.Instance
  const root = world.entities.create()
  const comp = root.assign(this)
  return comp
}
