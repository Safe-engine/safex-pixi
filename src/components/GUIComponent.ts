import { Assets, Text } from 'pixi.js'

import { ComponentX, NoRenderComponentX } from '../core/decorator'
import { LoadingBar, LoadingBarMode } from '../core/LoadingBar'

export class ButtonComp extends NoRenderComponentX {
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

export class ProgressBarComp extends NoRenderComponentX {
  mode = LoadingBarMode.BAR
  private _progress: number
  isReverse: boolean

  get progress() {
    return this._progress
  }

  set progress(val: number) {
    this._progress = val
    ;(this.node.instance as LoadingBar).progress = val
  }
}

export class LabelComp extends ComponentX {
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

export class ScrollView extends ComponentX {
  width: Float
  height: Float
}

export class BlockInputEventsComp extends NoRenderComponentX {}
