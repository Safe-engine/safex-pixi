import { EnhancedComponent } from '../components/EnhancedComponent'
import { GameWorld } from '../gworld'

export class NoRenderComponentX extends EnhancedComponent {
  static hasRender = false
  static create(data?: any) {
    return new this(data)
  }
}

export class ComponentX extends EnhancedComponent {
  static create(data?: any) {
    const world = GameWorld.Instance
    const root = world.entities.create()
    const comp = root.assign(new this(data))
    return comp
  }
}
