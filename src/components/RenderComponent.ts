import { ComponentX } from '@safe-engine/core'
import { ColorSource, Graphics, Point, Sprite, Texture, TextureSource } from 'pixi.js'

import { LoadingBar, LoadingBarMode } from '../core/LoadingBar'
import { SpriteTypes } from '../systems/RenderSystem'
import { NodeComp } from './NodeComp'

export class NodeRender extends ComponentX<NodeComp> {
  nodeName?: string
}

export class SpriteRender extends ComponentX<NodeComp<Sprite>> {
  public spriteFrame: TextureSource
  public type: SpriteTypes
  public fillType: LoadingBarMode = LoadingBarMode.BAR
  public fillRange = 1
  public fillCenter: Point
  loadingBar: LoadingBar

  // set fillStart(val: number) {
  //   if (this.node.instance instanceof cc.ProgressTimer) {
  //     this.node.instance.setMidpoint(cc.v2(val, val));
  //   }
  // }

  setFillRange(val: number) {
    if (this.loadingBar) {
      this.loadingBar.progress = val
    }
  }

  getSpriteFrame() {
    return this.spriteFrame
  }

  setSpriteFrame(frame) {
    this.spriteFrame = frame
    const sprite = this.node.instance as Sprite
    // if (this.node.instance instanceof cc.Sprite) {
    sprite.texture = Texture.from(frame)
    // sprite.texture.rotate = 8
    // } else if (this.node.instance instanceof ccui.ImageView) {
    //   if (this.texType) {
    //     this.node.instance.loadTexture(frame, this.texType);
    //   } else {
    //     this.node.instance.loadTexture(frame);
    //   }
    //   const sprite = new cc.Sprite(frame);
    //   this.node.setContentSize(sprite.getContentSize());
    // } else if (this.node.instance instanceof ccui.Button) {
    //   this.node.instance.loadTextureNormal(frame);
    // }
  }
}

export class GraphicsRender extends ComponentX<NodeComp<Graphics>> {
  lineWidth = 2
  strokeColor: ColorSource
  fillColor: ColorSource
}

export class MaskRender extends ComponentX<NodeComp> {
  type: number
  segments: number
  inverted: boolean
}
