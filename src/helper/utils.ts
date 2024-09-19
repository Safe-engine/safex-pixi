import {
  Constructor, EntityManager, EventManager, EventReceive,
  EventTypes,
  System
} from 'entityx-ts'

import { ComponentX, NodeComp } from '..'
import { GameWorld } from '../gworld'

export function registerSystem<T extends ComponentX>(component: Constructor<T>) {
  if (GameWorld.Instance.systems.isRegistered(`${component.name}System`)) {
    return
  }
  class NewSystem implements System {
    configure(event_manager: EventManager) {
      console.log('configure registerSystem', component.name)
      event_manager.subscribe(EventTypes.ComponentAdded, component, this.receiveComponentAddedEvent.bind(this))
    }

    receiveComponentAddedEvent(event: EventReceive<T>) {
      const ett = event.entity
      const newComp: any = ett.getComponent(component)
      newComp.node = ett.getComponent(NodeComp)
    }

    update(entities: EntityManager, events: EventManager, dt: number) {
      for (const entt of entities.entities_with_components(component)) {
        const comp = entt.getComponent(component)
        // console.log('comp', comp.constructor.name, typeof comp['update'] === 'function')
        if (comp.node.active && typeof comp['update'] === 'function') {
          comp['update'](dt)
        }
      }
    }
  }
  Object.defineProperty(NewSystem, 'name', { value: `${component.name}System` })
  GameWorld.Instance.systems.add(NewSystem)
  GameWorld.Instance.systems.configureOnce(NewSystem)
  GameWorld.Instance.listUpdate.push(NewSystem)
  return NewSystem
}

export function instantiate<T>(ComponentType: Constructor<T>, data?: any): T {
  return (ComponentType as any).create(data)
}
