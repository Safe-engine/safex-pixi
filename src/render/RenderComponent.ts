import { Graphics, Point, Sprite, Texture } from 'pixi.js'

import { Color4B, Vec2 } from '..'
import { GraphicsRenderProps, MaskRenderProps, SpriteRenderProps } from '../@types/safex'
import { ComponentX } from '../components/BaseComponent'
import { LoadingBar, LoadingBarMode } from '../core/LoadingBar'
import { SpriteTypes } from './RenderSystem'

export class NodeRender extends ComponentX {
  nodeName?: string
}

export class SpriteRender extends ComponentX<SpriteRenderProps, Sprite> {
  protected _spriteFrame: string
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

  get spriteFrame() {
    return this._spriteFrame
  }

  set spriteFrame(frame) {
    this._spriteFrame = frame
    if (!this.node) return
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
enum PointType {
  Circle,
  Rect,
};
export class GraphicsRender extends ComponentX<GraphicsRenderProps, Graphics> {
  lineWidth = 2
  strokeColor: Color4B
  fillColor: Color4B

  drawPoint(position: Vec2, pointSize: Float, color: Color4B, pointType = PointType.Rect) {

  }
  // drawPoints(points: Vec2[], color: Color4B) {
  // }
  drawLine(origin: Vec2, destination: Vec2, color: Color4B, thickness: Float) {

  }
  drawRect(origin: Vec2, destination: Vec2, color: Color4B) {
    const { x, y } = origin
    const width = destination.x - x
    const height = destination.y - y
    this.node.instance.rect(x, y, width, height)
    this.node.instance.fill(color)
  }
  drawSolidRect(origin: Vec2, destination: Vec2, color: Color4B) {

  }
  drawCircle(center: Vec2, radius: Float, angle?: Float, segments?: Integer, drawLineToCenter?: boolean, scaleX?: Float, scaleY?: Float, color?: Color4B, thickness?: Float) {
    const { x, y } = center
    this.node.instance.circle(x, y, radius)
    this.node.instance.fill(color)
  }
  drawSolidCircle(origin: Vec2, destination: Vec2, color: Color4B) {

  }
  drawQuadBezier(origin: Vec2, destination: Vec2, color: Color4B) {

  }
  drawCubicBezier(origin: Vec2, destination: Vec2, color: Color4B) {

  }
  drawCardinalSpline(points: Vec2[], color: Color4B) {
  }
  drawCatmullRom(points: Vec2[], color: Color4B) {
  }
  drawPoly(points: Vec2[], closedPolygon: boolean, color: Color4B, thickness?: Float) {
    this.node.instance.poly(points, closedPolygon)
    this.node.instance.fill(color)
  }
  drawSolidPoly(points: Vec2[], color: Color4B) {
  }
  drawDot(points: Vec2[], color: Color4B) {
  }
  drawSegment(from: Point, to: Point, color?: Color4B) {
    this.node.instance.moveTo(from.x, from.y);
    this.node.instance.lineTo(to.x, to.y);
    this.node.instance.strokeStyle = {
      cap: 'round', join: 'round',
      width: this.lineWidth || 36,
      color: color || this.strokeColor,
    }
    this.node.instance.stroke();
  }
  drawTriangle(p1: Vec2, p2: Vec2, p3: Vec2, color: Color4B) {
    this.node.instance.poly([p1, p2, p3], true)
    this.node.instance.fill(color)
  }
  clear() {
    this.node.instance.clear()
  }
}

export class MaskRender extends ComponentX<MaskRenderProps> {
  type: number
  segments: number
  inverted: boolean
}
