import { ColorSource, Point, Sprite, Texture, TextureSource } from 'pixi.js'

import { ComponentX } from '../core/decorator'
import { LoadingBar, LoadingBarMode } from '../core/LoadingBar'
import { SpriteTypes } from '../systems/RenderSystem'

export class NodeRender extends ComponentX {
  nodeName?: string
}

export class SpriteRender extends ComponentX {
  private spriteFrame: TextureSource
  private type: SpriteTypes
  private fillType: LoadingBarMode = LoadingBarMode.BAR
  private fillRange = 1
  private fillCenter: Point
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

export class GraphicsRender extends ComponentX {
  lineWidth = 2
  strokeColor: ColorSource
  fillColor: ColorSource
}

export class MaskRender extends ComponentX {
  type: number
  segments: number
  inverted: boolean
}