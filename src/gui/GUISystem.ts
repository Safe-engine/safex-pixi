import { Button, CheckBox, List, RadioGroup, ScrollBox } from '@pixi/ui'
import { EventManager, EventTypes, System } from 'entityx-ts'
import { callFunc, easeBackIn, scaleTo, sequence } from 'pixi-action-ease'
import { Text } from 'pixi.js'

import { NodeComp } from '..'
import { GameWorld } from '../base'
import { LoadingBarMode, ProgressTimer } from '../core/LoadingBar'
import {
  ButtonComp,
  CheckBoxComp,
  LabelComp,
  LabelOutlineComp,
  LabelShadowComp,
  ListComp,
  ProgressTimerComp,
  RadioGroupComp,
  ScrollView,
} from './GUIComponent'

export class GUISystem implements System {
  defaultFont: string
  configure(event_manager: EventManager<GameWorld>) {
    event_manager.subscribe(EventTypes.ComponentAdded, ButtonComp, ({ entity, component }) => {
      const nodeComp = entity.getComponent(NodeComp)
      // const { normalImage, selectedImage, disableImage, texType, zoomScale } = button
      // console.log('onPress.ButtonComp', component)
      const button = new Button(nodeComp.instance)
      // node.setZoomScale(zoomScale - 1)
      component.node = nodeComp
      // component.node = entity.assign(new NodeComp(node, entity))
      button.onPress.connect(() => {
        // console.log('onPress.connect')
        const scale = scaleTo(0.5, 1.2)
        const scaleDown = scaleTo(0.5, 1)
        const seq = sequence(
          scale,
          callFunc(() => {
            if (Object.prototype.hasOwnProperty.call(component.props, 'onPress')) {
              component.props.onPress(component)
            }
          }),
          scaleDown,
        )
        const ease = easeBackIn(seq)
        component.node.runAction(ease)
      })
    })
    // event_manager.subscribe(EventTypes.ComponentAdded, ProgressBarComp, ({ entity, component }) => {
    //   const { progress = 1, bg, fill } = component.props
    //   const node = new ProgressBar({ bg, fill, progress })
    //   component.node = entity.assign(new NodeComp(node, entity))
    // })
    event_manager.subscribe(EventTypes.ComponentAdded, ProgressTimerComp, ({ entity, component }) => {
      // console.log(component, '.progress')
      const { spriteFrame, fillCenter } = component.props
      const node = new ProgressTimer(LoadingBarMode.BAR, spriteFrame)
      if (fillCenter) {
        node.fillCenter = fillCenter
      }
      component.node = entity.assign(new NodeComp(node, entity))
    })
    event_manager.subscribe(EventTypes.ComponentAdded, ScrollView, ({ entity, component }) => {
      const { width, height } = component.props
      const view = new ScrollBox({ width, height })
      component.node = entity.assign(new NodeComp(view, entity))
    })
    event_manager.subscribe(EventTypes.ComponentAdded, ListComp, ({ entity, component }) => {
      const view = new List()
      component.node = entity.assign(new NodeComp(view, entity))
    })
    // event_manager.subscribe(EventTypes.ComponentAdded, SliderComp, ({ entity, component }) => {
    //   const { bg, slider, fill } = component.props
    //   const view = new Slider({ bg, fill, slider })
    //   component.node = entity.assign(new NodeComp(view, entity))
    // })
    event_manager.subscribe(EventTypes.ComponentAdded, RadioGroupComp, ({ entity, component }) => {
      const view = new RadioGroup()
      component.node = entity.assign(new NodeComp(view, entity))
    })
    event_manager.subscribe(EventTypes.ComponentAdded, CheckBoxComp, ({ entity, component }) => {
      const { style } = component.props
      const view = new CheckBox({ style })
      component.node = entity.assign(new NodeComp(view, entity))
    })
    // event_manager.subscribe(EventTypes.ComponentAdded, InputComp, ({ entity, component }) => {
    //   const { bg, size = 48, fill } = component.props
    //   const view = new Input({ bg, textStyle: { fontSize: size, fill } })
    //   component.node = entity.assign(new NodeComp(view, entity))
    // })
    event_manager.subscribe(EventTypes.ComponentAdded, LabelComp, ({ entity, component }) => {
      // console.log('ComponentAddedEvent LabelComp', component)
      const node = new Text()
      // node.texture.rotate = 8
      node.style.fill = '#fff'
      component.node = entity.assign(new NodeComp(node, entity))
      const { string = '', font = this.defaultFont, size = 64 } = component.props
      if (font) component.font = font
      component.size = size
      component.string = string
    })
    event_manager.subscribe(EventTypes.ComponentAdded, LabelOutlineComp, ({ entity, component }) => {
      const { color, width } = component.props
      const node = entity.getComponent(NodeComp)
      if (node.instance instanceof Text) {
        node.instance.style.stroke = { color, width }
      }
    })
    event_manager.subscribe(EventTypes.ComponentAdded, LabelShadowComp, ({ entity, component }) => {
      const { color, blur, offset } = component.props
      const node = entity.getComponent(NodeComp)
      if (node.instance instanceof Text) {
        node.instance.style.dropShadow = { color, blur, alpha: 1, angle: 0, distance: 0 }
      }
    })

    // event_manager.subscribe(EventTypes.ComponentAdded, BlockInputEventsComp), this);
  }
  // update() {
  // throw new Error('Method not implemented.');
  // }
}
