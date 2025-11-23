import { FancyButton, ScrollBox } from '@pixi/ui'
import { BaseComponentProps, GameWorld, NodeComp, registerSystem } from '..'
import { ComponentX } from '../components/BaseComponent'

interface ScrollViewCompProps extends BaseComponentProps<ScrollViewComp> {
  width: number
  height: number
}

export class ScrollViewComp extends ComponentX<ScrollViewCompProps, FancyButton> {
  render() {
    const { width, height } = this.props
    const view = new ScrollBox({ width, height })
    const world = GameWorld.Instance
    const entity = world.entities.create()
    entity.assign(new NodeComp(view, entity))
    const comp = entity.assign(this)
    return comp
  }
}
registerSystem(ScrollViewComp)
