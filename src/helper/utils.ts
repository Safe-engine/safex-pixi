import { Constructor, EntityManager, EventManager, EventReceive, EventTypes, System } from 'entityx-ts';
import { Point } from 'pixi.js';
import { EnhancedComponent, GameWorld } from '../base';

import { NodeComp } from '../components/NodeComp';

export function v2(x = 0, y = 0) {
  return new Point(x, y)
}

export function getDistance(point1: Point, point2: Point) {
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export function registerSystem<T extends EnhancedComponent<any>>(component: Constructor<T>) {
  if (GameWorld.Instance.systems.isRegistered(`${component.name}System`)) {
    return
  }
  class NewSystem implements System {
    configure(event_manager: EventManager<GameWorld>) {
      console.log('configure registerSystem core', component.name)
      event_manager.subscribe(EventTypes.ComponentAdded, component, (event: EventReceive<T>) => {
        // console.log('receiveComponentAddedEvent', event)
        const ett = event.entity
        const newComp = ett.getComponent<T>(component)
        newComp.node = ett.getComponent(NodeComp)
      })
    }

    update(entities: EntityManager, events: EventManager<GameWorld>, dt: number) {
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
