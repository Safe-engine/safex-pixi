import { Tilemap } from '@pixi/tilemap'
import { BaseComponentProps, GameWorld, NodeComp } from '..'
import { ComponentX } from '../components/BaseComponent'
import { loadIsometricMap } from './tield'

interface TiledMapCompProps extends BaseComponentProps<TiledMapComp> {
  mapUrl: string
}

export class TiledMapComp extends ComponentX<TiledMapCompProps, Tilemap> {
  getPositionAt(x: number, y: number) {
    return this.node.instance.getTileset()
  }

  render() {
    const tiledMap = loadIsometricMap(this.props.mapUrl)
    const world = GameWorld.Instance
    const entity = world.entities.create()
    entity.assign(new NodeComp(tiledMap, entity))
    const comp = entity.assign(this)
    return comp
  }
}
