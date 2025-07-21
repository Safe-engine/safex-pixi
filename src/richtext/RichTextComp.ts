import TaggedText from 'pixi-tagged-text-plus'
import { BaseComponentProps } from '..'
import { ComponentX } from '../components/BaseComponent'
import {
  generateStringFromStyledElements,
  generateStylesFromStyledElements,
  parseFontString,
  transformToStyledElements,
} from './html-text-parser'

interface RichTextCompProps extends BaseComponentProps<RichTextComp> {
  font?: string
  string?: string
  size?: number
}

export class RichTextComp extends ComponentX<RichTextCompProps, TaggedText> {
  get string() {
    return this.props.string
  }

  set string(val: string) {
    this.props.string = val
    if (!this.node) return
    const jObj = parseFontString(val)
    const styledOutput = transformToStyledElements(jObj)
    const newText = generateStringFromStyledElements(styledOutput)
    const styles = generateStylesFromStyledElements(styledOutput)
    // console.log(styledOutput)
    const wrapped = `<root>${newText}</root>`
    this.node.instance.setText(wrapped)
    this.node.instance.setTagStyles(styles)
  }
  get size() {
    return this.props.size
  }
  set size(size: number) {
    this.props.size = size
    if (!this.node) return
    this.node.instance.setStyleForTag('root', { fontSize: size, color: '#fff' })
  }
  get font() {
    return this.props.font
  }
  set font(font: string) {
    this.props.font = font
    if (!this.node) return
    this.node.instance.setStyleForTag('root', { color: '#fff', fontFamily: font })
  }
}
