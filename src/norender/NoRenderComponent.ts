import { FederatedPointerEvent } from 'pixi.js'
import { ExtraDataProps, TouchEventProps } from '../../@types/safex'
import { NoRenderComponentX } from '../components/BaseComponent'
import { EventCallbackType, EventMap, NodeComp } from '../components/NodeComp'

export class Touch extends FederatedPointerEvent {
  // declare getLocation: () => Vec2
  // declare getDelta: () => Vec2
}

export type TouchEventCallback = (touch?: Touch, node?: NodeComp) => void

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

export class TouchEventRegister extends NoRenderComponentX<TouchEventProps> {
  onTouchStart?: TouchEventCallback
  onTouchMove?: TouchEventCallback
  onTouchEnd?: TouchEventCallback
  onTouchCancel?: TouchEventCallback
  listener: EventListener
  touch: Touch

  setOnTouchStart(cb: TouchEventCallback) {
    this.onTouchStart = cb
  }

  setOnTouchMove(cb: TouchEventCallback) {
    this.onTouchMove = cb
  }

  setOnTouchEnd(cb: TouchEventCallback) {
    this.onTouchEnd = cb
  }

  setOnTouchCancel(cb: TouchEventCallback) {
    this.onTouchCancel = cb
  }
}

export class ExtraDataComp extends NoRenderComponentX<ExtraDataProps> {
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
