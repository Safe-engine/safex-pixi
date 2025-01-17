// import { Touch } from '../../polyfills'
import { FederatedPointerEvent } from 'pixi.js'
import { NoRenderComponentX } from './BaseComponent'
import { EventCallbackType, EventMap, NodeComp } from './NodeComp'

type TouchEVentCallback = (touch?: FederatedPointerEvent, node?: NodeComp) => void

export class EventRegister extends NoRenderComponentX {
  events: EventMap = {}

  on(name: string, callback: EventCallbackType, target?: any) {
    const bound = target ? callback.bind(target) : callback
    if (this.events[name]) {
      this.events[name].push(bound)
    } else {
      this.events[name] = [bound]
    }
  }

  off(name: string, callback?: EventCallbackType, target?: any)
  off(name: string) {
    this.events[name] = undefined
  }

  emit(name: string, ...params: any) {
    if (this.events[name]) {
      this.events[name].forEach((fc) => fc(...params))
    }
  }
}

export class TouchEventRegister extends NoRenderComponentX {
  onTouchStart?: TouchEVentCallback
  onTouchMove?: TouchEVentCallback
  onTouchEnd?: TouchEVentCallback
  onTouchCancel?: TouchEVentCallback
  listener: EventListener
  touch: Touch

  setOnTouchStart(cb: TouchEVentCallback) {
    this.onTouchStart = cb
  }

  setOnTouchMove(cb: TouchEVentCallback) {
    this.onTouchMove = cb
  }

  setOnTouchEnd(cb: TouchEVentCallback) {
    this.onTouchEnd = cb
  }

  setOnTouchCancel(cb: TouchEVentCallback) {
    this.onTouchCancel = cb
  }
}

export class ExtraDataComp extends NoRenderComponentX {
  key: string
  value: any
  data: { [key: string]: any } = {}
  getData<T>(key: string): T {
    return this.data[key]
  }
  setData<T>(key: string, val: T) {
    this.data[key] = val
  }
}
