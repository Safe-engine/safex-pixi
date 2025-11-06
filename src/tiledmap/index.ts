import { registerSystem } from '../helper/utils'
import { TiledMapComp } from './TiledMapComp'

export function setupTiledMap() {
  registerSystem(TiledMapComp)
}
