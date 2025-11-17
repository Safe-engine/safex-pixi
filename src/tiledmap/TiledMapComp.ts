import { BaseComponentProps, GameWorld, NodeComp } from '..'
import { ComponentX } from '../components/BaseComponent'
import { loadIsometricMap } from './tield'
import { TiledMapContainer } from './TiledMapContainer'

interface TiledMapCompProps extends BaseComponentProps<TiledMapComp> {
  mapFile: string
}

export class TiledMapComp extends ComponentX<TiledMapCompProps, TiledMapContainer> {
  getLayer(layerName: string) {
    return this.node.instance.getLayer(layerName)
  }
  getObjectGroup(layerName: string) {
    return this.node.instance.getObjectGroup(layerName)
  }

  render() {
    const tiledMap = loadIsometricMap(this.props.mapFile)
    const world = GameWorld.Instance
    const entity = world.entities.create()
    entity.assign(new NodeComp(tiledMap, entity))
    const comp = entity.assign(this)
    return comp
  }
}
