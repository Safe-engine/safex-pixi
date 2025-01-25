import { EventManager, EventTypes, System } from 'entityx-ts'

// import { Touch } from '../../polyfills'
import { Container } from 'pixi.js'
import { NodeComp } from '../components/NodeComp'
import { ExtraDataComp, TouchEventRegister } from './NoRenderComponent'

export class NoRenderSystem implements System {
  configure(event_manager: EventManager) {
    event_manager.subscribe(EventTypes.ComponentAdded, ExtraDataComp, ({ entity, component }) => {
      const { key, value } = component
      component.data[key] = value
    })
    event_manager.subscribe(EventTypes.ComponentAdded, TouchEventRegister, ({ entity, component }) => {
      const ett = entity
      const touchComp = component
      const nodeComp = ett.getComponent(NodeComp)
      touchComp.node = nodeComp
      const container: Container = nodeComp.instance
      if (touchComp.onTouchStart) {
        container.on('touchstart', (event) => {
          touchComp.onTouchStart(event, nodeComp)
        });
      }
      if (touchComp.onTouchMove) {
        container.on('touchmove', (event) => {
          touchComp.onTouchMove(event, nodeComp)
        });
      }
      if (touchComp.onTouchEnd) {
        container.on('touchend', (event) => {
          touchComp.onTouchEnd(event, nodeComp)
        });
      }
      if (touchComp.onTouchEnd) {
        container.on('touchcancel', (event) => {
          touchComp.onTouchEnd(event, nodeComp)
        });
      }
    })
    event_manager.subscribe(EventTypes.ComponentRemoved, TouchEventRegister, ({ entity, component }) => {
      console.log('ComponentRemovedEvent TouchEventRegister', event)
      // const ett = event.entity
      // const nodeComp = ett.getComponent(NodeComp)
      const touchComp = component as TouchEventRegister
      const container: Container = touchComp.node.instance
      if (touchComp.onTouchStart) {
        container.removeListener('touchstart')
      }
      if (touchComp.onTouchMove) {
        container.removeListener('touchmove')
      }
      if (touchComp.onTouchEnd) {
        container.removeListener('touchend')
      }
      if (touchComp.onTouchEnd) {
        container.removeListener('touchcancel')
      }
    })
  }

  // update(entities: EntityManager, events: EventManager, dt: number)
  // update() {
  // throw new Error('Method not implemented.');
  // }
}
