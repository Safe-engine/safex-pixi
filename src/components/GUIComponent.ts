import { CheckBox, CheckBoxOptions, Input, List, ProgressBar, RadioGroup, Slider, SliderOptions } from '@pixi/ui'
import { Assets, Container, FillInput, Point, Text } from 'pixi.js'

import { ButtonCompProps, ColorSource, LabelCompProps, LabelOutlineCompProps, LabelShadowCompProps, ProgressTimerProps, ScrollViewProps } from '../../@types/safex'
import { LoadingBarMode, ProgressTimer } from '../core/LoadingBar'
import { ComponentX, NoRenderComponentX } from './BaseComponent'

// const _htmlTextParser = new HtmlTextParser()
export const FillType = {
  HORIZONTAL: 0,
  VERTICAL: 1,
  RADIAL: 2,
}
type Keys = keyof typeof FillType
type Values = (typeof FillType)[Keys]

export class ButtonComp extends NoRenderComponentX<ButtonCompProps> {
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

export class ProgressBarComp extends ComponentX<{}, ProgressBar> {
  mode = LoadingBarMode.BAR
  isReverse: boolean
  bg: string
  fill: string

  get progress() {
    return this.node.instance.progress
  }

  set progress(val: number) {
    this.node.instance.progress = val
  }
}

export class LabelComp extends ComponentX<LabelCompProps, Text> {
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

export class ScrollView extends NoRenderComponentX<ScrollViewProps> {
  width: number
  height: number
}

export class BlockInputEventsComp extends NoRenderComponentX { }

export class ProgressTimerComp extends ComponentX<ProgressTimerProps & { $ref?: ProgressTimerComp }, ProgressTimer> {
  spriteFrame: string
  fillType?: Values
  fillRange?: number
  fillCenter?: Point
  isReverse?: boolean

  getFillRange() {
    return this.node.instance.progress
  }

  setFillStart(val: number) {
    this.node.instance.fillCenter.x = val
  }

  setFillRange(val: number) {
    // console.log('setFillRange', this.node.instance);
    this.node.instance.progress = val
  }
}

export class RichTextComp extends ComponentX<LabelCompProps, Text> {
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

export class LabelOutlineComp extends NoRenderComponentX<LabelOutlineCompProps> {
  color: ColorSource
  width: number
}

export class LabelShadowComp extends NoRenderComponentX<LabelShadowCompProps> {
  color: ColorSource
  blur: number
  offset: Point
}

export class InputComp extends ComponentX<{}, Input> {
  bg: string
  fill: FillInput
  font: string
  string: string
  size = 64
}

export class ListComp extends ComponentX<{}, List> {
}
export class SliderComp extends ComponentX<{}, Slider> {
  bg: string
  fill: SliderOptions['fill']
  slider: Container
}
export class RadioGroupComp extends ComponentX<{}, RadioGroup> {
}
export class CheckBoxComp extends ComponentX<{}, CheckBox> {
  style: CheckBoxOptions['style'];
}
