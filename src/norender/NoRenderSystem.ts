import { EventManager, EventTypes, System } from 'entityx-ts'
import { Container } from 'pixi.js'

import { Button } from '@pixi/ui'
import { NodeComp } from '../components/NodeComp'
import { ButtonComp, ExtraDataComp, TouchEventRegister } from './NoRenderComponent'
import { Touch } from './Touch'

export class NoRenderSystem implements System {
  configure(event_manager: EventManager) {
    event_manager.subscribe(EventTypes.ComponentAdded, ExtraDataComp, ({ component }) => {
      const { key, value } = component.props
      component.data[key] = value
    })
    event_manager.subscribe(EventTypes.ComponentAdded, TouchEventRegister, ({ entity, component }) => {
      const ett = entity
      const touchComp = component
      const nodeComp = ett.getComponent(NodeComp)
      touchComp.node = nodeComp
      const container: Container = nodeComp.instance
      container.eventMode = 'static'
      container.interactive = true
      if (touchComp.props.onTouchStart) {
        container.on('pointerdown', (event) => {
          touchComp.props.onTouchStart(new Touch(event), nodeComp)
        })
      }
      if (touchComp.props.onTouchMove) {
        container.on('pointermove', (event) => {
          touchComp.props.onTouchMove(new Touch(event), nodeComp)
        })
      }
      if (touchComp.props.onTouchEnd) {
        container.on('pointerup', (event) => {
          touchComp.props.onTouchEnd(new Touch(event), nodeComp)
        })
      }
      if (touchComp.props.onTouchCancel) {
        container.on('pointercancel', (event) => {
          touchComp.props.onTouchCancel(new Touch(event), nodeComp)
        })
      }
    })
    event_manager.subscribe(EventTypes.ComponentRemoved, TouchEventRegister, ({ component }) => {
      // console.log('ComponentRemovedEvent TouchEventRegister', component)
      const touchComp = component as TouchEventRegister
      const container: Container = touchComp.node.instance
      if (touchComp.props.onTouchStart) {
        container.removeListener('pointerdown')
      }
      if (touchComp.props.onTouchMove) {
        container.removeListener('pointermove')
      }
      if (touchComp.props.onTouchEnd) {
        container.removeListener('pointerup')
      }
      if (touchComp.props.onTouchEnd) {
        container.removeListener('pointercancel')
      }
    })
    event_manager.subscribe(EventTypes.ComponentAdded, ButtonComp, ({ entity, component }) => {
      const nodeComp = entity.getComponent(NodeComp)
      const button = new Button(nodeComp.instance)
      component.node = nodeComp
      button.onPress.connect(() => {
        if (!component.enabled) return
        if (Object.prototype.hasOwnProperty.call(component.props, 'onPress')) {
          component.props.onPress(component)
        }
      })
    })
  }

  // update(entities: EntityManager, events: EventManager, dt: number)
  // update() {
  // throw new Error('Method not implemented.');
  // }
}
