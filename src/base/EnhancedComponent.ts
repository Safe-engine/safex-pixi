import { Constructor } from 'entityx-ts'
import { BaseComponentProps } from '..'
import { NodeComp } from '../components/NodeComp'

export class EnhancedComponent<Props = object, N extends NodeComp<any> = NodeComp<any>> {
  props: Props = {} as any
  enabled = true
  constructor(data?: BaseComponentProps<EnhancedComponent> & Props) {
    this.init(data)
  }
  init(data?: Props) {
    if (data) {
      // console.log('constructor', this.constructor.name, data)
      Object.keys(data).forEach((key) => {
        this.props[key] = data[key]
      })
    }
  }
  node: N

  addComponent<T extends EnhancedComponent>(instance): T {
    return this.node.addComponent(instance)
  }
  getComponent<T extends ComponentType>(component: Constructor<T>): T {
    return this.node.getComponent(component)
  }
  getComponentsInChildren<T extends ComponentType>(component: Constructor<T>): T[] {
    return this.node.getComponentsInChildren(component)
  }
  getComponentInChildren<T extends ComponentType>(component: Constructor<T>): T {
    return this.node.getComponentInChildren(component)
  }
  isEqual(other: EnhancedComponent) {
    return this.node.entity.id === other.node.entity.id
  }
}

export type ComponentType = EnhancedComponent | NodeComp
