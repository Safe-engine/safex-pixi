import { Constructor } from 'entityx-ts'
import { BaseComponentProps } from '../@types/safex'
import { NodeComp } from '../components/NodeComp'

export class EnhancedComponent<Props = {}, N extends NodeComp<any> = NodeComp<any>> {
  props: Props = {} as any
  constructor(data?: BaseComponentProps & Props) {
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
  actionsMap: { [key: string]: Animation } = {}
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
