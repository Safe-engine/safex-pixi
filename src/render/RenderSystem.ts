import { EventManager, EventTypes, System } from 'entityx-ts'
import { Container, Graphics, Sprite } from 'pixi.js'

import { NodeComp } from '..'
import { GraphicsRender, MaskRender, NodeRender, SpriteRender } from './RenderComponent'

export enum SpriteTypes {
  SIMPLE,
  SLICED,
  TILED,
  FILLED,
  MESH,
  ANIMATION,
}

export class RenderSystem implements System {
  configure(event_manager: EventManager) {
    event_manager.subscribe(EventTypes.ComponentAdded, NodeRender, ({ entity }) => {
      const nodeRenderComp = entity.getComponent(NodeRender)
      const node = new Container()
      nodeRenderComp.node = entity.assign(new NodeComp(node, entity))
    })
    event_manager.subscribe(EventTypes.ComponentAdded, SpriteRender, ({ entity, component }) => {
      const { spriteFrame } = component.props
      // const texture = GameWorld.Instance.assetManager.get<Texture>(spriteFrame)
      // console.log('SpriteRender ComponentAdded', component, texture)
      const node = Sprite.from(spriteFrame)
      // if (type === SpriteTypes.FILLED) {
      //   // console.log('fillType', fillType)
      //   const loadingBar = new LoadingBar(fillType, node)
      //   if (fillRange) loadingBar.progress = fillRange
      //   if (fillCenter) loadingBar.fillCenter = fillCenter
      //   component.loadingBar = loadingBar
      //   // node.setMidpoint(fillCenter)
      // }
      // node.texture.rotate = 8
      component.node = entity.assign(new NodeComp(node, entity))
      // component.node.anchorX = 0.5
      // component.node.anchorY = 0.5
    })
    event_manager.subscribe(EventTypes.ComponentAdded, MaskRender, ({ component }) => {
      console.log('MaskRender', component)
      // const { type, segments, inverted } = maskComp
      // const node = new cc.ClippingNode()
      // node.setInverted(inverted)
      // maskComp.node = ett.assign(new NodeComp(node, ett))
    })
    event_manager.subscribe(EventTypes.ComponentAdded, GraphicsRender, ({ entity, component }) => {
      // const { lineWidth, strokeColor, fillColor } = component.props
      // console.log('GraphicsRender', component);
      const node = new Graphics()
      component.node = entity.assign(new NodeComp(node, entity))
    })
    event_manager.subscribe(EventTypes.ComponentRemoved, NodeComp, ({ component }) => {
      if (component) {
        component.instance.removeFromParent()
      }
    })
  }

  // update() {
  // throw new Error('Method not implemented.');
  // }
}
