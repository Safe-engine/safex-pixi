import { Tilemap } from '@pixi/tilemap'
import { Assets, BaseComponentProps, GameWorld, NodeComp, Vec2 } from '..'
import { ComponentX } from '../components/BaseComponent'
import { loadIsometricMap } from './tield'

interface TiledMapCompProps extends BaseComponentProps<TiledMapComp> {
  mapFile: string
}

export class TiledMapComp extends ComponentX<TiledMapCompProps, Tilemap> {
  mapData: any
  getPositionAt(x: number, ty: number) {
    const mapData = this.mapData
    const tx = x + 1
    // Chuyển sang toạ độ isometric
    const screenX = (tx - ty) * (mapData.tilewidth / 2)
    const screenY = (tx + ty) * (mapData.tileheight / 2)
    return Vec2(screenX, screenY)
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
