import { Tilemap } from '@pixi/tilemap'
import { Assets, BaseComponentProps, GameWorld, NodeComp, Vec2 } from '..'
import { ComponentX } from '../components/BaseComponent'
import { loadIsometricMap, tileToPixel } from './tield'

interface TiledMapCompProps extends BaseComponentProps<TiledMapComp> {
  mapFile: string
}

export class TiledMapComp extends ComponentX<TiledMapCompProps, Tilemap> {
  mapData: any

  getPositionAt(tx: number, ty: number) {
    const pos = tileToPixel(this.mapData, tx + 1, ty)
    return Vec2(pos)
  }

  render() {
    this.mapData = Assets.get(this.props.mapFile)
    const tiledMap = loadIsometricMap(this.props.mapFile)
    const world = GameWorld.Instance
    const entity = world.entities.create()
    entity.assign(new NodeComp(tiledMap, entity))
    const comp = entity.assign(this)
    return comp
  }
}
