import { Tilemap } from '@pixi/tilemap'
import { Assets, Rectangle, Texture } from 'pixi.js'

export function loadIsometricMap(mapUrl: string) {
  const mapData = Assets.get(mapUrl)
  const tileset = mapData.tilesets[0]
  const baseDir = mapUrl.split('/').slice(0, -1).join('/')
  const tilesetImageUrl = `${baseDir}/${tileset.image}`
  const tilesetTexture = Assets.get(tilesetImageUrl)
  const baseTexture = tilesetTexture.baseTexture

  const tileW = tileset.tilewidth
  const tileH = tileset.tileheight
  const cols = tileset.columns
  const firstGid = tileset.firstgid

  const tilemap = new Tilemap(baseTexture)
  for (const layer of mapData.layers) {
    if (layer.type !== 'tilelayer') continue
    const data = layer.data
    for (let i = 0; i < data.length; i++) {
      const gid = data[i]
      if (gid === 0) continue

      const tileId = gid - firstGid
      const frameX = (tileId % cols) * tileW
      const frameY = Math.floor(tileId / cols) * tileH

      const tx = i % mapData.width
      const ty = Math.floor(i / mapData.width)

      // Chuyển sang toạ độ isometric
      const screenX = (tx - ty) * (mapData.tilewidth / 2)
      const screenY = (tx + ty) * (mapData.tileheight / 2)
      const texture = new Texture({ source: baseTexture, frame: new Rectangle(frameX, frameY, tileW, tileH) })
      tilemap.tile(texture, screenX, screenY)
    }
  }
  return tilemap
}
