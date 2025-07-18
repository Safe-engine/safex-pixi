import { Constructor } from 'entityx-ts'

import { GameWorld } from '..'
import { ComponentX, NoRenderComponentX } from '../components/BaseComponent'

export type GetProps<T> = T extends ComponentX<infer P> ? P : T extends NoRenderComponentX<infer Q> ? Q : never

export function instantiate<T extends ComponentX>(ComponentType: Constructor<T>, data?: GetProps<T>): T {
  const instance = new ComponentType()
  instance.init(data)
  // console.log(ComponentType.name, data, instance)
  if (!instance.render) {
    return instance
  }
  return instance.render()
}

export function loadScene<T extends ComponentX>(ComponentType: Constructor<T>) {
  const world = GameWorld.Instance
  world.entities.reset()
  const instance = new ComponentType()
  instance.render()
}
