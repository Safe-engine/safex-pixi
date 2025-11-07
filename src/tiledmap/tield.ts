import { Tilemap } from '@pixi/tilemap'
import { Assets, Rectangle, Texture } from 'pixi.js'

export function tileToPixel(map, tx, ty) {
  const tw = map.tilewidth
  const th = map.tileheight
  const { orientation, staggeraxis, staggerindex } = map

  switch (orientation) {
    case 'orthogonal':
      return { x: tx * tw, y: ty * th }

    case 'isometric':
      return { x: (tx - ty) * (tw / 2), y: (tx + ty) * (th / 2) }

    case 'staggered':
      if (staggeraxis === 'x') {
        const odd = staggerindex === 'odd'
        const offset = tx % 2 === (odd ? 1 : 0) ? th / 2 : 0
        return { x: tx * (tw / 2), y: ty * th + offset }
      } else {
        const odd = staggerindex === 'odd'
        const offset = ty % 2 === (odd ? 1 : 0) ? tw / 2 : 0
        return { x: tx * tw + offset, y: ty * (th / 2) }
      }

    default:
      throw new Error(`Unknown map type: ${orientation}`)
  }
}

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
      const { x, y } = tileToPixel(mapData, tx, ty)
      const texture = new Texture({ source: baseTexture, frame: new Rectangle(frameX, frameY, tileW, tileH) })
      tilemap.tile(texture, x, y)
    }
  }
  return tilemap
}
