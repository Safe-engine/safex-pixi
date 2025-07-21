import { CheckBox, CheckBoxOptions, Input, List, ProgressBar, RadioGroup, Slider, SliderOptions } from '@pixi/ui'
import { Assets, Container, Point, Text } from 'pixi.js'

import { BaseComponentProps } from '..'
import { ComponentX, NoRenderComponentX } from '../components/BaseComponent'
import { Color4B } from '../core/Color'
import { LoadingBarMode, ProgressTimer } from '../core/LoadingBar'

export const FillType = {
  HORIZONTAL: 0,
  VERTICAL: 1,
  RADIAL: 2,
}
// type Keys = keyof typeof FillType
// type Values = (typeof FillType)[Keys]

interface ButtonCompProps extends BaseComponentProps<ButtonComp> {
  normalImage?: string
  selectedImage?: string
  disableImage?: string
  zoomScale?: number
  onPress: (target: ButtonComp) => void
}
export class ButtonComp extends NoRenderComponentX<ButtonCompProps> {
  // setOnPress(cb: (target: ButtonComp) => void) {
  //   this.onPress = cb
  // }
  // set enabled(val) {
  //   this.node.instance.interactive = val
  // }
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
interface LabelCompProps extends BaseComponentProps<LabelComp> {
  font?: string
  string?: string
  size?: number
}
export class LabelComp extends ComponentX<LabelCompProps, Text> {
  get string() {
    return this.props.string
  }

  set string(val: string) {
    this.props.string = val
    if (!this.node) return
    if (this.node.instance instanceof Text) {
      this.node.instance.text = val
    }
  }

  get size() {
    return this.props.size
  }
  set size(val) {
    this.props.size = val
    if (!this.node) return
    if (this.node.instance instanceof Text) {
      this.node.instance.style.fontSize = val
    }
  }

  get font() {
    return this.props.font
  }

  set font(val: string) {
    this.props.font = val
    if (!this.node) return
    // console.log('set font', val, Assets.get(val))
    if (this.node.instance instanceof Text) {
      if (Assets.get(val)) this.node.instance.style.fontFamily = Assets.get(val).family
    }
  }
}

interface ScrollViewProps {
  width: number
  height: number
}
export class ScrollView extends NoRenderComponentX<ScrollViewProps> {}

export class BlockInputEventsComp extends NoRenderComponentX {}

interface ProgressTimerProps extends BaseComponentProps<ProgressTimerComp> {
  spriteFrame: string
  fillType?: number
  fillRange?: number
  fillCenter?: Point
  isReverse?: boolean
}
export class ProgressTimerComp extends ComponentX<ProgressTimerProps, ProgressTimer> {
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

interface LabelOutlineCompProps {
  color: Color4B
  width: number
}
export class LabelOutlineComp extends NoRenderComponentX<LabelOutlineCompProps> {}

interface LabelShadowCompProps extends BaseComponentProps<LabelShadowComp> {
  color: Color4B
  blur: number
  offset?: Point
}
export class LabelShadowComp extends NoRenderComponentX<LabelShadowCompProps> {}

interface InputCompProps extends BaseComponentProps<InputComp> {
  placeHolder?: string
  font?: string
  size?: Integer
  maxLength?: Integer
  isPassword?: boolean
  bg?: string
  // fill?: FillInput
}
export class InputComp extends ComponentX<InputCompProps, Input> {
  get string() {
    return this.node.instance.value
  }
}

export class ListComp extends ComponentX<{}, List> {}
export class SliderComp extends ComponentX<{}, Slider> {
  bg: string
  fill: SliderOptions['fill']
  slider: Container
}
export class RadioGroupComp extends ComponentX<{}, RadioGroup> {}
export class CheckBoxComp extends ComponentX<{ style: CheckBoxOptions['style'] }, CheckBox> {}
