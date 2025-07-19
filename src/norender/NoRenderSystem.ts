import { EventManager, EventTypes, System } from 'entityx-ts'
// import { Touch } from '../../polyfills'
import { Container } from 'pixi.js'

import { NodeComp } from '../components/NodeComp'
import { ExtraDataComp, TouchEventRegister } from './NoRenderComponent'
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
      if (touchComp.props.onTouchEnd) {
        container.on('pointercancel', (event) => {
          touchComp.props.onTouchEnd(new Touch(event), nodeComp)
        })
      }
    })
    event_manager.subscribe(EventTypes.ComponentRemoved, TouchEventRegister, ({ component }) => {
      console.log('ComponentRemovedEvent TouchEventRegister', event)
      // const ett = event.entity
      // const nodeComp = ett.getComponent(NodeComp)
      const touchComp = component as TouchEventRegister
      const container: Container = touchComp.node.instance
      if (touchComp.props.onTouchStart) {
        container.removeListener('touchstart')
      }
      if (touchComp.props.onTouchMove) {
        container.removeListener('touchmove')
      }
      if (touchComp.props.onTouchEnd) {
        container.removeListener('touchend')
      }
      if (touchComp.props.onTouchEnd) {
        container.removeListener('touchcancel')
      }
    })
  }

  // update(entities: EntityManager, events: EventManager, dt: number)
  // update() {
  // throw new Error('Method not implemented.');
  // }
}
