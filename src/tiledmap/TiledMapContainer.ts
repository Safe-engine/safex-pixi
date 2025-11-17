import { Container } from 'pixi.js'
import { Vec2 } from '../core'
import { tileToPixel } from './tield'

export class TiledMapContainer extends Container {
  layers: Map<string, TiledMapLayer> = new Map()
  objectGroups: Map<string, any> = new Map()

  getLayer(layerName: string) {
    return this.layers.get(layerName)
  }

  getObjectGroup(layerName: string) {
    return this.objectGroups.get(layerName)
  }
}

export class TiledMapLayer extends Container {
  mapData: any
  getPositionAt(tx: number, ty: number) {
    const pos = tileToPixel(this.mapData, tx + 1, ty)
    return Vec2(pos)
  }

  getTileAt(tx: number, ty: number) {
    const idx = 0 | (tx + ty * this.mapData.width)
    return this.children[idx]
  }
}
