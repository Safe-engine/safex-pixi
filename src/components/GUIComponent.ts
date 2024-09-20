import { ComponentX, NoRenderComponentX } from '@safe-engine/core'
import { Assets, Container, Point, Text } from 'pixi.js'

import { Color4B } from '../core/Color'
import { LoadingBar, LoadingBarMode, ProgressTimer } from '../core/LoadingBar'
import { NodeComp } from './NodeComp'

// const _htmlTextParser = new HtmlTextParser()
export const FillType = {
  HORIZONTAL: 0,
  VERTICAL: 1,
  RADIAL: 2,
}
type Keys = keyof typeof FillType
type Values = (typeof FillType)[Keys]

export class ButtonComp extends NoRenderComponentX<Container, NodeComp> {
  normalImage: string
  selectedImage: string
  disableImage: string
  zoomScale: number
  onPress: (target: ButtonComp) => void

  setOnPress(cb: (target: ButtonComp) => void) {
    this.onPress = cb
  }

  set enabled(val) {
    this.node.instance.interactive = val
  }
}

export class ProgressBarComp extends NoRenderComponentX<LoadingBar, NodeComp<LoadingBar>> {
  mode = LoadingBarMode.BAR
  private _progress: number
  isReverse: boolean

  get progress() {
    return this._progress
  }

  set progress(val: number) {
    this._progress = val
    this.node.instance.progress = val
  }
}

export class LabelComp extends ComponentX<Text, NodeComp<Text>> {
  font: string
  string: string
  size = 64

  getString() {
    if (this.node.instance instanceof Text) {
      return this.node.instance.text
    }
  }

  setString(val: string) {
    if (this.node.instance instanceof Text) {
      this.node.instance.text = val
    }
  }

  getSize() {
    if (this.node.instance instanceof Text) {
      return this.node.instance.style.fontSize
    }
  }
  setSize(val) {
    if (this.node.instance instanceof Text) {
      this.node.instance.style.fontSize = val
    }
  }

  getFont() {
    if (this.node.instance instanceof Text) {
      return this.node.instance.style.fontFamily as string
    }
  }

  setFont(val: string) {
    // console.log('set font', val, Assets.get(val))
    if (this.node.instance instanceof Text) {
      if (Assets.get(val)) this.node.instance.style.fontFamily = Assets.get(val).family
    }
  }
}

export class ScrollView extends ComponentX<any, NodeComp> {
  width: number
  height: number
}

export class BlockInputEventsComp extends NoRenderComponentX<Container, NodeComp> { }

export class ProgressTimerComp extends ComponentX<ProgressTimer, NodeComp<ProgressTimer>> {
  spriteFrame: string
  fillType: Values
  fillRange: number
  fillCenter: Point
  isReverse: boolean

  getFillRange() {
    return this.node.instance.progress
  }

  setFillStart(val: number) {
    this.node.instance.fillCenter.x = val
  }

  setFillRange(val: number) {
    console.log('setFillRange', this.node.instance);
    this.node.instance.progress = val
  }
}

export class RichTextComp extends ComponentX<Text, NodeComp<Text>> {
  protected font: string
  protected string: string
  protected size: number

  getString() {
    return this.string
  }

  setString(val: string) {
    this.string = val
  }
}

export class LabelOutlineComp extends NoRenderComponentX<Container, NodeComp> {
  color: typeof Color4B
  width: number
}

export class LabelShadowComp extends NoRenderComponentX<Container, NodeComp> {
  color: typeof Color4B
  blur: number
  offset: Point
}