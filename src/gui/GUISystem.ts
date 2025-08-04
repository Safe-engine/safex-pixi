import { Button, CheckBox, Input, List, RadioGroup, ScrollBox } from '@pixi/ui'
import { EventManager, EventTypes, System } from 'entityx-ts'
import { callFunc, easeBackIn, scaleTo, sequence } from 'pixi-action-ease'

import { Color4B, NodeComp } from '..'
import { GameWorld } from '../base'
import { ButtonComp, CheckBoxComp, InputComp, ListComp, RadioGroupComp, ScrollView } from './GUIComponent'

export class GUISystem implements System {
  configure(event_manager: EventManager<GameWorld>) {
    event_manager.subscribe(EventTypes.ComponentAdded, ButtonComp, ({ entity, component }) => {
      const nodeComp = entity.getComponent(NodeComp)
      const { zoomScale = 1.2 } = component.props
      const button = new Button(nodeComp.instance)
      component.node = nodeComp
      const lastScaleX = nodeComp.scaleX
      const lastScaleY = nodeComp.scaleY
      button.onPress.connect(() => {
        if (!component.enabled) return
        // console.log('onPress.connect')
        const scale = scaleTo(0.3, zoomScale * lastScaleX, lastScaleY * zoomScale)
        const scaleDown = scaleTo(0.3, lastScaleX, lastScaleY)
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
    event_manager.subscribe(EventTypes.ComponentAdded, InputComp, ({ entity, component }) => {
      const { bg, size = 48 } = component.props
      const view = new Input({ bg, textStyle: { fontSize: size, fill: { color: Color4B(255, 255, 255, 255) } } })
      component.node = entity.assign(new NodeComp(view, entity))
    })

    // event_manager.subscribe(EventTypes.ComponentAdded, BlockInputEventsComp), this);
  }
  // update() {
  // throw new Error('Method not implemented.');
  // }
}
