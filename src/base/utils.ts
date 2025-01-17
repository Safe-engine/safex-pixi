import { Constructor } from 'entityx-ts'

import { EnhancedComponent } from '.'

export function instantiate<C extends Constructor<EnhancedComponent>, D>(
  Component: C & { create?(data?: D) },
  data?: D
): InstanceType<C> {
  return Component.create(data);
}
