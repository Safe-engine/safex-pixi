import { ComponentType, Constructor, Entity } from 'entityx-ts'
import { Action, actionManager, Animation } from 'pixi-action-ease'
import { ColorSource, Container, Point, Sprite, Text } from 'pixi.js'

import { EnhancedComponent, instantiate } from '..'
import { updatePoint, Vec2 } from '../core'
import { Size } from '../core/Size'
import { ProgressBarComp } from '../gui/GUIComponent'
import { ExtraDataComp } from '../norender/NoRenderComponent'

export class NodeComp<C extends Container = Container> {
  entity: Entity
  instance: C
  parent: NodeComp
  children: NodeComp[] = []
  actionsList: Animation[] = []
  name: string
  private _group = 0
  private _active = true

  constructor(instance: C, entity: Entity) {
    this.entity = entity
    this.instance = instance
    this.anchorX = 0.5
    this.anchorY = 0.5
  }

  get uuid() {
    return this.entity.id
  }

  get position(): Vec2 {
    return updatePoint(this.instance.position)
  }

  set position(val: Vec2) {
    this.instance.position = val
  }

  get posX() {
    return this.instance.x
  }

  set posX(val: number) {
    this.instance.x = val
  }

  get posY() {
    return this.instance.y
  }

  set posY(val: number) {
    this.instance.y = val
  }

  set xy(val: [number, number]) {
    this.position = Vec2(val[0], val[1])
  }

  get scale() {
    return this.instance.scale.x
  }

  set scale(val: number) {
    this.instance.scale = new Point(val, val)
  }

  get scaleX() {
    return this.instance.scale.x
  }

  set scaleX(val: number) {
    this.instance.scale.x = val
  }

  get scaleY() {
    return this.instance.scale.y
  }

  set scaleY(val: number) {
    this.instance.scale.y = val
  }

  get anchorX() {
    if (this.instance instanceof Sprite || this.instance instanceof Text) return this.instance.anchor.x
    return 0.5
  }

  set anchorX(val: number) {
    if (this.instance instanceof Sprite || this.instance instanceof Text) this.instance.anchor.x = val
  }

  get anchorY() {
    if (this.instance instanceof Sprite || this.instance instanceof Text) return this.instance.anchor.y
    return 0.5
  }

  set anchorY(val: number) {
    if (this.instance instanceof Sprite || this.instance instanceof Text) this.instance.anchor.y = val
  }

  /** rotation is in radians */
  get rotation() {
    return this.instance.rotation
  }
  /** rotation is in radians */
  set rotation(val: number) {
    this.instance.rotation = val
  }

  /** angle is in degrees. */
  get angle() {
    return this.instance.angle
  }
  /** angle is in degrees. */
  set angle(val: number) {
    this.instance.angle = val
  }

  get color() {
    if (this.instance instanceof Sprite) return this.instance.tint
    if (this.instance instanceof Text) return this.instance.style.fill as ColorSource
    return 0xffffff
  }

  set color(val: ColorSource) {
    if (this.instance instanceof Sprite) this.instance.tint = val
    if (this.instance instanceof Text) this.instance.style.fill = val
  }

  get opacity() {
    return this.instance.alpha
  }

  set opacity(val: number) {
    this.instance.alpha = val
  }

  get active() {
    if (!this._active) return false
    let p = this.parent
    while (p) {
      if (!p.active) return false
      p = p.parent
    }
    return this.instance.visible && !this.instance.destroyed
  }

  set active(val: boolean) {
    this._active = val
    this.instance.visible = val
  }

  get group() {
    return this._group
  }

  set group(val: number) {
    this._group = val
  }

  get width() {
    return this.instance.width
  }

  set width(val) {
    this.instance.width = val
  }

  get height() {
    return this.instance.height
  }

  set height(val) {
    this.instance.setSize(this.width, val)
  }

  get zIndex() {
    return this.instance.zIndex
  }

  set zIndex(val) {
    this.instance.zIndex = val
  }

  get childrenCount() {
    return this.children.length
  }

  addComponent<T extends ComponentType>(instance): T {
    return this.entity.assign(instance)
  }

  getComponent<T extends Constructor<ComponentType>>(component: T): InstanceType<T> {
    return this.entity.getComponent(component) as any
  }

  getComponentsInChildren<T extends ComponentType>(component: Constructor<T>): T[] {
    if (!this.children.length) {
      return []
    }
    const listHave = this.children.filter((child) => {
      return child.getComponent(component)
    })
    return listHave.map((node) => node.getComponent(component))
  }

  getComponentInChildren<T extends ComponentType>(component: Constructor<T>): T {
    return this.getComponentsInChildren(component)[0]
  }

  convertToNodeSpace(point: Vec2) {
    return updatePoint(this.instance.toLocal(point))
  }

  convertToNodeSpaceAR(point: Vec2) {
    return updatePoint(this.instance.toLocal(point))
  }

  convertToWorldSpaceAR(point: Vec2) {
    return updatePoint(this.instance.toGlobal(point))
  }

  // setAnchorPoint(point: number | cc.Point, y?: number) {
  //   this.instance.setAnchorPoint(point, y)
  // }

  // getAnchorPoint() {
  //   return this.instance.getAnchorPoint()
  // }

  // getBoundingBox() {
  //   const box = this.instance.getBoundingBox()
  //   box.contains = function (point) {
  //     return this.x <= point.x && this.x + this.width >= point.x && this.y <= point.y && this.y + this.height >= point.y
  //   }
  //   return box
  // }

  get contentSize(): Size {
    return this.instance.getSize()
  }

  set contentSize(size: Size) {
    this.instance.setSize(size)
  }

  runAction(act: Action) {
    const animation = actionManager.runAction(this.instance as any, act)
    this.actionsList.push(animation)
  }

  stopAllActions() {
    this.actionsList.forEach((act) => {
      actionManager.cancelAction(act)
    })
    this.actionsList = []
  }

  pauseAllActions() {
    this.actionsList.forEach((anim: Animation) => {
      anim.isPause = true
    })
  }

  resumeAllActions() {
    this.actionsList.forEach((anim: Animation) => {
      anim.isPause = false
    })
  }

  destroy() {
    if (this.parent) {
      this.parent.children = this.parent.children.filter(({ entity }) => entity.id !== this.entity.id)
    }
    this.children.forEach((child) => {
      child.destroy()
    })
    this.parent = null
    this.entity.destroy()
    this.stopAllActions()
    this.instance.destroy()
  }

  removeFromParent() {
    this.active = false
    this.stopAllActions()
    this.instance.removeFromParent()
  }

  addChild(child: NodeComp, zOrder?: number) {
    child.parent = this
    child.active = true
    this.children.push(child)
    this.instance.addChild(child.instance)
    if (zOrder) child.zIndex = zOrder
  }

  destroyAllChildren() {
    this.children.forEach((child) => {
      child.destroy()
    })
  }

  removeAllChildren() {
    this.children.forEach((child) => {
      child.removeFromParent()
    })
  }

  resolveComponent(component: EnhancedComponent<object, NodeComp>) {
    // console.log(component.constructor.name, (component.constructor as any).hasRender)
    if ((component.constructor as any).hasRender) {
      this.addChild(component.node)
    } else {
      this.addComponent(component)
      if (component instanceof ProgressBarComp) {
        this.addChild(component.node)
      }
    }
  }

  getData<T>(key: string): T {
    const data = this.getComponent(ExtraDataComp)
    if (!data) return console.warn('need add ExtraDataComp to Node') as T
    return data.getData(key)
  }

  setData<T>(key: string, value: T) {
    const data = this.getComponent(ExtraDataComp)
    // console.log('setData', key, value, data)
    if (!data) {
      this.addComponent(instantiate(ExtraDataComp, { key, value }))
    } else {
      data.setData(key, value)
    }
  }
}
