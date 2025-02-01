import { CheckBox, CheckBoxOptions, Input, List, ProgressBar, RadioGroup, Slider, SliderOptions } from '@pixi/ui'
import { Assets, Container, FillInput, Point, Text } from 'pixi.js'

import TaggedText from 'pixi-tagged-text-plus'
import { ButtonCompProps, LabelCompProps, LabelOutlineCompProps, LabelShadowCompProps, ProgressTimerProps, ScrollViewProps } from '../@types/safex'
import { ComponentX, NoRenderComponentX } from '../components/BaseComponent'
import { Color4B } from '../core/Color'
import { LoadingBarMode, ProgressTimer } from '../core/LoadingBar'
import { generateStringFromStyledElements, generateStylesFromStyledElements, parseFontString, transformToStyledElements } from '../helper/html-text-parser'

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

  // setOnPress(cb: (target: ButtonComp) => void) {
  //   this.onPress = cb
  // }

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
  private _font: string
  private _string: string
  private _size = 64

  get string() {
    return this._string
  }

  set string(val: string) {
    this._string = val
    if (!this.node) return
    if (this.node.instance instanceof Text) {
      this.node.instance.text = val
    }
  }

  get size() {
    return this._size
  }
  set size(val) {
    this._size = val
    if (!this.node) return
    if (this.node.instance instanceof Text) {
      this.node.instance.style.fontSize = val
    }
  }

  get font() {
    return this._font
  }

  set font(val: string) {
    this._font = val
    if (!this.node) return
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

export class RichTextComp extends ComponentX<LabelCompProps, TaggedText> {
  private _font: string
  private _string: string
  private _size: number

  get string() {
    return this._string
  }


  set string(val: string) {
    this._string = val
    if (!this.node) return
    const jObj = parseFontString(val);
    const styledOutput = transformToStyledElements(jObj);
    const newText = generateStringFromStyledElements(styledOutput)
    const styles = generateStylesFromStyledElements(styledOutput)
    // console.log(styledOutput)
    const wrapped = `<root>${newText}</root>`
    this.node.instance.setText(wrapped)
    this.node.instance.setTagStyles(styles)
  }
  get size() {
    return this._size
  }
  set size(size: number) {
    this._size = size
    if (!this.node) return
    this.node.instance.setStyleForTag('root', { fontSize: size, color: '#fff' })
  }
  get font() {
    return this._font
  }
  set font(font: string) {
    this._font = font
    if (!this.node) return
    this.node.instance.setStyleForTag('root', { color: '#fff', fontFamily: font })
  }
}

export class LabelOutlineComp extends NoRenderComponentX<LabelOutlineCompProps> {
  color: Color4B
  width: number
}

export class LabelShadowComp extends NoRenderComponentX<LabelShadowCompProps> {
  color: Color4B
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
