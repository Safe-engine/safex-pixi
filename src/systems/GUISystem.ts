import { Button, ScrollBox } from '@pixi/ui'
import {
  ComponentAddedEvent, EventManager, EventReceive,
  System
} from 'entityx-ts'
import { Sprite, Text } from 'pixi.js'
import { CallFunc, EaseBackIn, ScaleTo, Sequence } from 'pixi-action-ease'

import { NodeComp, SpriteRender } from '..'
import { ButtonComp, LabelComp, ProgressBarComp, ScrollView } from '../components/GUIComponent'
import { LoadingBar } from '../core/LoadingBar'

export class GUISystem implements System {
  configure(event_manager: EventManager) {
    event_manager.subscribe(ComponentAddedEvent(ButtonComp), this)
    event_manager.subscribe(ComponentAddedEvent(ProgressBarComp), this)
    event_manager.subscribe(ComponentAddedEvent(ScrollView), this)
    event_manager.subscribe(ComponentAddedEvent(LabelComp), this)
    // event_manager.subscribe(ComponentAddedEvent(BlockInputEventsComp), this);
  }
  receive(type: string, event: EventReceive) {
    switch (type) {
      case ComponentAddedEvent(ButtonComp): {
        console.log('ComponentAddedEvent ButtonComp', event)
        const ett = event.entity
        const button = ett.getComponent(ButtonComp)
        const nodeComp = ett.getComponent(NodeComp)
        // const { normalImage, selectedImage, disableImage, texType, zoomScale } = button
        const node = new Button(nodeComp.instance)
        // node.setZoomScale(zoomScale - 1)
        button.node = nodeComp
        // button.node = ett.assign(new NodeComp(node, ett))
        node.onPress.connect(() => {
          // console.log('onPress.connect')
          const scale = ScaleTo.create(0.12, 1.2)
          const scaleDown = ScaleTo.create(0.12, 1)
          const seq = Sequence.create(
            scale,
            CallFunc.create(() => {
              if (Object.prototype.hasOwnProperty.call(button, 'onPress')) {
                button.onPress(button)
              }
            }),
            scaleDown,
          )
          const ease = EaseBackIn.create(seq)
          button.node.runAction(ease)
        })
        break
      }
      case ComponentAddedEvent(ProgressBarComp): {
        console.log('ComponentAddedEvent ProgressBarComp', event)
        const ett = event.entity
        const bar = ett.getComponent(ProgressBarComp)
        const spriteComp = ett.getComponent(SpriteRender)
        if (!spriteComp) throw Error('ProgressBarComp need SpriteRender')
        const { progress, mode } = bar
        const node = new LoadingBar(mode, spriteComp.node.instance as Sprite)
        spriteComp.node.instance.mask = node
        bar.node = ett.assign(new NodeComp(node, ett))
        node.progress = progress
        break
      }
      case ComponentAddedEvent(ScrollView): {
        console.log('ComponentAddedEvent ScrollView', event)
        const ett = event.entity
        const scroll = event.component as ScrollView
        const { width, height } = scroll
        const view = new ScrollBox({ width, height })
        scroll.node = ett.assign(new NodeComp(view, ett))
        break
      }
      case ComponentAddedEvent(LabelComp): {
        console.log('ComponentAddedEvent LabelComp', event)
        const ett = event.entity
        const label = ett.getComponent(LabelComp)
        const node = new Text()
        // node.texture.rotate = 8
        node.style.fill = '#fff'
        label.node = ett.assign(new NodeComp(node, ett))
        const { string = '', font = '', size } = label
        if (font) label.setFont(font)
        label.setSize(size)
        label.setString(string)
        break
      }

      default:
        break
    }
  }
  update() {
    // throw new Error('Method not implemented.');
  }
}
