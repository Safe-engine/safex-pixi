import { Constructor } from 'entityx-ts'
import { actionManager, Animation, CallFunc, DelayTime, Repeat, Sequence } from 'pixi-action-ease'

import { NodeComp } from './NodeComp'

export class EnhancedComponent {
  constructor(...args: any[]) {
    const [data] = args
    if (data) {
      // console.log('constructor', this.constructor.name, data)
      Object.keys(data).forEach((key) => {
        this[key] = data[key]
      })
    }
  }
  node: NodeComp
  static hasRender = true
  actionsMap: { [key: string]: Animation } = {}
  addComponent<T extends EnhancedComponent>(instance): T {
    return this.node.addComponent(instance)
  }
  getComponent<T extends ComponentType>(component: Constructor<T>): T {
    return this.node.getComponent(component)
  }
  schedule(callback: (dt?: number) => void, interval: number, repeat = -1, delay = 0, key?: string) {
    const action = Sequence.create(DelayTime.create(interval), CallFunc.create(callback))
    const repeatAct = Repeat.create(action, repeat)
    const seq = Sequence.create(DelayTime.create(delay), repeatAct)
    const animation = actionManager.runAction(this.node.instance as any, seq)
    this.actionsMap[key] = animation
  }
  unschedule(callback: (arg?: unknown) => void, key?: string) {
    // this.node.instance.unschedule(callback.bind(this))
    this.actionsMap[key].stop()
  }
  unscheduleAllCallbacks() {
    Object.values(this.actionsMap).forEach((action: Animation) => {
      action.stop()
    })
  }
  scheduleOnce(callback: (arg?: unknown) => void, delay: number, key?: string) {
    const action = Sequence.create(DelayTime.create(delay), CallFunc.create(callback))
    const animation = actionManager.runAction(this.node.instance as any, action)
    this.actionsMap[key] = animation
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
