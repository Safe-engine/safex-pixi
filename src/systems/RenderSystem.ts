import {
  ComponentAddedEvent, ComponentRemovedEvent, EventManager, EventReceive,
  System
} from 'entityx-ts'
import { Container, Graphics, Sprite } from 'pixi.js'

import { NodeComp } from '../..'
import { GraphicsRender, NodeRender, SpriteRender } from '../components/RenderComponent'
import { LoadingBar } from '../core/LoadingBar'

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
    event_manager.subscribe(ComponentAddedEvent(NodeRender), this)
    event_manager.subscribe(ComponentAddedEvent(SpriteRender), this)
    // event_manager.subscribe(ComponentAddedEvent(ImageRender), this)
    // event_manager.subscribe(ComponentAddedEvent(MaskRender), this)
    event_manager.subscribe(ComponentAddedEvent(GraphicsRender), this)
    event_manager.subscribe(ComponentAddedEvent(NodeComp), this)
    event_manager.subscribe(ComponentRemovedEvent(NodeComp), this)
  }

  receive(type: string, event: EventReceive) {
    switch (type) {
      case ComponentAddedEvent(NodeRender): {
        // console.log('NodeRender', event)
        const ett = event.entity
        const nodeRenderComp = ett.getComponent(NodeRender)
        const node = new Container()
        nodeRenderComp.node = ett.assign(new NodeComp(node, ett))
        break
      }

      case ComponentAddedEvent(SpriteRender): {
        // console.log('ComponentAddedEvent SpriteRender', event)
        const ett = event.entity
        const spriteComp = ett.getComponent(SpriteRender)
        const { spriteFrame, type, fillType, fillRange, fillCenter } = spriteComp
        const node = Sprite.from(spriteFrame)
        if (type === SpriteTypes.FILLED) {
          // console.log('fillType', fillType)
          const loadingBar = new LoadingBar(fillType, node)
          if (fillRange) loadingBar.progress = fillRange
          if (fillCenter) loadingBar.fillCenter = fillCenter
          spriteComp.loadingBar = loadingBar
          // node.setMidpoint(fillCenter)
        }
        node.texture.rotate = 8
        spriteComp.node = ett.assign(new NodeComp(node, ett))
        // spriteComp.node.anchorX = 0.5
        // spriteComp.node.anchorY = 0.5
        break
      }

      // case ComponentAddedEvent(MaskRender): {
      //   console.log('MaskRender', event.component);
      //   const ett = event.entity
      //   const maskComp = event.entity.getComponent(MaskRender)
      //   const { type, segments, inverted } = maskComp
      //   const node = new cc.ClippingNode()
      //   node.setInverted(inverted)
      //   maskComp.node = ett.assign(new NodeComp(node, ett))
      //   break
      // }

      case ComponentAddedEvent(GraphicsRender): {
        console.log('MaskRender', event.component)
        const ett = event.entity
        const graphics = event.entity.getComponent(GraphicsRender)
        const { lineWidth, strokeColor, fillColor } = graphics
        const node = new Graphics()
        node.beginFill(fillColor)
        node.lineStyle(lineWidth, strokeColor)
        graphics.node = ett.assign(new NodeComp(node, ett))
        // node.drawCircle(0, 0, 100)
        break
      }
      case ComponentRemovedEvent(NodeComp): {
        const node = event.component as NodeComp
        if (node) {
          node.instance.removeFromParent()
        }
        break
      }
      default:
        break
    }
  }
  update() {
    // throw new Error('Method not implemented.');
  }
}
