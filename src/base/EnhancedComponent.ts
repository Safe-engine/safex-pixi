import { Constructor } from 'entityx-ts'
import { REPEAT_FOREVER } from 'pixi-action-ease'
import { BaseComponentProps, Container, Ticker } from '..'
import { NodeComp } from '../components/NodeComp'

export class EnhancedComponent<Props = object, N extends NodeComp<Container> = NodeComp<Container>> {
  props: Props = {} as any
  enabled = true
  private _ticker: Ticker
  private _timers: Map<any, any>

  constructor(data?: BaseComponentProps<EnhancedComponent> & Props) {
    this.init(data)
    this._ticker = Ticker.shared
    this._timers = new Map() // Map<Function, TimerInfo>
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

  addComponent<T extends EnhancedComponent>(instance: T): T {
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
  schedule(callback, interval, repeat = REPEAT_FOREVER, delay = 0) {
    if (this._timers.has(callback)) {
      this.unschedule(callback)
    }

    let elapsed = -delay
    let count = 0

    const fn = () => {
      elapsed += this._ticker.deltaMS / 1000
      if (elapsed >= interval) {
        elapsed -= interval
        callback(count)
        count++
        if (count > repeat) {
          this.unschedule(callback)
        }
      }
    }

    this._timers.set(callback, { fn })
    this._ticker.add(fn)
  }

  scheduleOnce(callback, delay, key = undefined) {
    if (key) {
      // Cho phép hủy bằng key thay vì callback
      if (this._timers.has(key)) {
        this.unschedule(key)
      }
    }

    let elapsed = 0

    const fn = () => {
      elapsed += this._ticker.deltaMS / 1000
      if (elapsed >= delay) {
        callback()
        this.unschedule(key || callback)
      }
    }

    this._timers.set(key || callback, { fn })
    this._ticker.add(fn)
  }

  unschedule(callback) {
    const timer = this._timers.get(callback)
    if (timer) {
      this._ticker.remove(timer.fn)
      this._timers.delete(callback)
    }
  }

  unscheduleAllCallbacks() {
    for (const { fn } of this._timers.values()) {
      this._ticker.remove(fn)
    }
    this._timers.clear()
  }
  isEqual(other: EnhancedComponent) {
    return this.node.entity.id === other.node.entity.id
  }
}

export type ComponentType = EnhancedComponent | NodeComp
