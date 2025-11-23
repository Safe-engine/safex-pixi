import { CheckBox, CheckBoxOptions, Input, List, ProgressBar, RadioGroup, Slider, SliderOptions } from '@pixi/ui'
import { Container } from 'pixi.js'

import { BaseComponentProps } from '..'
import { ComponentX, render } from '../components/BaseComponent'
import { LoadingBarMode } from '../core/LoadingBar'

export const FillType = {
  HORIZONTAL: 0,
  VERTICAL: 1,
  RADIAL: 2,
}
// type Keys = keyof typeof FillType
// type Values = (typeof FillType)[Keys]

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

export class ListComp extends ComponentX<{}, List> { }
export class SliderComp extends ComponentX<{}, Slider> {
  bg: string
  fill: SliderOptions['fill']
  slider: Container
}
export class RadioGroupComp extends ComponentX<{}, RadioGroup> { }
export class CheckBoxComp extends ComponentX<{ style: CheckBoxOptions['style'] }, CheckBox> { }

Object.defineProperty(RadioGroupComp.prototype, 'render', { value: render })
Object.defineProperty(CheckBoxComp.prototype, 'render', { value: render })
Object.defineProperty(ListComp.prototype, 'render', { value: render })
Object.defineProperty(SliderComp.prototype, 'render', { value: render })
Object.defineProperty(InputComp.prototype, 'render', { value: render })
