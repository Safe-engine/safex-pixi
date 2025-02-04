import { Constructor } from 'entityx-ts';

import { ComponentX, NoRenderComponentX } from '../components/BaseComponent';

export type GetProps<T> = T extends ComponentX<infer P> ? P : T extends NoRenderComponentX<infer Q> ? Q : never;

export function instantiate<T extends ComponentX>(ComponentType: Constructor<T>, data?: GetProps<T>): T {
  const instance = new ComponentType(data)
  if (!instance.render) {
    return instance
  }
  return instance.render()
}
