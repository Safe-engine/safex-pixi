import { Constructor, Entity } from 'entityx-ts'
import { BaseComponentProps } from '../@types/safex'

export interface BaseNode<C> {
  active: boolean
  entity: Entity
  instance: C
  addComponent<T extends EnhancedComponent>(instance: T): T
  getComponent<T extends ComponentType>(component: Constructor<T>): T
  getComponentsInChildren<T extends ComponentType>(component: Constructor<T>): T[]
  getComponentInChildren<T extends ComponentType>(component: Constructor<T>): T
  // isEqual(other: EnhancedComponent): boolean
}

export class EnhancedComponent<Props = Object, N extends BaseNode<any> = BaseNode<any>> {
  constructor(data?: BaseComponentProps & Props) {
    if (data) {
      // console.log('constructor', this.constructor.name, data)
      Object.keys(data).forEach((key) => {
        this[key] = data[key]
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

export type ComponentType = EnhancedComponent | BaseNode<any>
