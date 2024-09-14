import {
  ComponentAddedEvent,
  Constructor, EntityManager, EventManager, EventReceive,
  System
} from 'entityx-ts'

import {  ComponentX, NodeComp } from '..'
import { GameWorld } from '../gworld'

export function registerSystem<T extends ComponentX>(component: Constructor<T>) {
  if (GameWorld.Instance.systems.isRegistered(`${component.name}System`)) {
    return
  }
  class NewSystem implements System {
    configure(event_manager: EventManager) {
      console.log('configure registerSystem', component.name)
      event_manager.subscribe(ComponentAddedEvent(component), this)
    }

    receive(type: string, event: EventReceive) {
      switch (type) {
        case ComponentAddedEvent(component): {
          const ett = event.entity
          const newComp: any = ett.getComponent(component)
          newComp.node = ett.getComponent(NodeComp)
          break
        }
        default:
          break
      }
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

export class Size {
  constructor(width, height) {
    this.width = width
    this.height = height
  }
  width: number
  height: number
}

export function size(width: number, height: number) {
  return new Size(width, height)
}
