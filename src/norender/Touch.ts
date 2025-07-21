import { FederatedPointerEvent } from 'pixi.js'

import { Vec2 } from '..'

export class Touch {
  private event: FederatedPointerEvent
  constructor(event) {
    this.event = event
  }

  getLocation(): ReturnType<typeof Vec2> {
    return Vec2(this.event.global)
  }
  getLocationX() {
    return this.event.globalX
  }
  getLocationY() {
    return this.event.globalY
  }
  getDelta(): ReturnType<typeof Vec2> {
    return Vec2(this.event.movementX, this.event.movementY)
  }
  getDeltaX() {
    return this.event.movementX
  }
  getDeltaY() {
    return this.event.movementY
  }
  getLocationInView(view: any) {
    const { x, y } = this.event.global
    return view.toLocal({ x, y })
  }
  getLocationInNode(node: any) {
    const { x, y } = this.event.global
    return node.toLocal({ x, y })
  }
}
