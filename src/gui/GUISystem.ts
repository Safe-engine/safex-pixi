import { CheckBox, Input, List, RadioGroup } from '@pixi/ui'
import { EventManager, EventTypes, System } from 'entityx-ts'

import { Color4B, NodeComp } from '..'
import { GameWorld } from '../base'
import { CheckBoxComp, InputComp, ListComp, RadioGroupComp } from './GUIComponent'

export class GUISystem implements System {
  configure(event_manager: EventManager<GameWorld>) {
    // event_manager.subscribe(EventTypes.ComponentAdded, ProgressBarComp, ({ entity, component }) => {
    //   const { progress = 1, bg, fill } = component.props
    //   const node = new ProgressBar({ bg, fill, progress })
    //   component.node = entity.assign(new NodeComp(node, entity))
    // })
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
