import { BaseComponentProps } from '..'
import { ComponentX } from '../components/BaseComponent'
import { NodeComp } from '../components/NodeComp'
import { Touch } from './Touch'

export type EventCallbackType = (...args) => void
export interface EventMap {
  [key: string]: [EventCallbackType]
}

export type TouchEventCallback = (touch?: Touch, node?: NodeComp) => void

export class EventRegister extends ComponentX {
  private events: EventMap = {}

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

interface TouchEventProps {
  onTouchStart?: TouchEventCallback
  onTouchMove?: TouchEventCallback
  onTouchEnd?: TouchEventCallback
  onTouchCancel?: TouchEventCallback
}
export class TouchEventRegister extends ComponentX<TouchEventProps> {
  listener: EventListener
  touch: Touch
}

interface ExtraDataProps {
  key: string
  value: any
}
export class ExtraDataComp extends ComponentX<ExtraDataProps> {
  data: { [key: string]: any } = {}

  getData<T>(key: string): T {
    return this.data[key]
  }
  setData<T>(key: string, val: T) {
    this.data[key] = val
  }
}

interface ButtonCompProps extends BaseComponentProps<ButtonComp> {
  // normalImage?: string
  // selectedImage?: string
  // disableImage?: string
  // zoomScale?: number
  onPress: (target: ButtonComp) => void
}
export class ButtonComp extends ComponentX<ButtonCompProps> { }
