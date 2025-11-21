import { Constructor } from 'entityx-ts'

import { GameWorld, SceneComponent } from '..'
import { ComponentX } from '../components/BaseComponent'

export type GetProps<T> = T extends ComponentX<infer P> ? P : never

export function instantiate<T extends ComponentX>(ComponentType: Constructor<T>, data?: GetProps<T>): T {
  const instance = new ComponentType()
  instance._init(data)
  if (!instance.render) {
    return instance
  }
  return instance.render()
}

export async function loadScene<T extends SceneComponent>(ComponentType: Constructor<T>) {
  const world = GameWorld.Instance
  world.entities.reset()
  const instance = new ComponentType()
  if (instance.preLoad) {
    await instance.preLoad()
  }
  instance.render()
}
