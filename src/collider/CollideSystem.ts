import { EntityManager, EventManager, EventTypes, System } from 'entityx-ts'
import { Color, Graphics } from 'pixi.js'

import { app } from '../app'
import { GameWorld } from '../base'
import { NodeComp } from '../components/NodeComp'
import { BoxCollider, CircleCollider, Collider, CollisionType, Contract, PolygonCollider } from './CollideComponent'

export function enabledDebugDraw(enable = true) {
  const collideSystem = GameWorld.Instance.systems.get(CollideSystem)
  collideSystem.enabledDebugDraw = enable
}

export class CollideSystem implements System {
  listColliders: Collider[] = []
  _contracts: Contract[] = []
  removeColliders: Collider[] = []
  debugGraphics: Graphics
  enabledDebugDraw = true
  enabled = true
  colliderMatrix = [[true]]

  configure(event_manager: EventManager) {
    event_manager.subscribe(EventTypes.ComponentAdded, BoxCollider, this.onAddCollider.bind(this))
    event_manager.subscribe(EventTypes.ComponentAdded, CircleCollider, this.onAddCollider.bind(this))
    event_manager.subscribe(EventTypes.ComponentAdded, PolygonCollider, this.onAddCollider.bind(this))
    event_manager.subscribe(EventTypes.ComponentRemoved, BoxCollider, this.onRemoveCollider.bind(this))
    event_manager.subscribe(EventTypes.ComponentRemoved, CircleCollider, this.onRemoveCollider.bind(this))
    event_manager.subscribe(EventTypes.ComponentRemoved, PolygonCollider, this.onRemoveCollider.bind(this))
    if (this.enabledDebugDraw) {
      this.debugGraphics = new Graphics()
      this.debugGraphics.setFillStyle({ color: new Color('white') })
      this.debugGraphics.width = 4
      this.debugGraphics.zIndex = 40
    }
    app.stage.addChild(this.debugGraphics)
  }

  update(entities: EntityManager, events: EventManager, dt: number) {
    if (!this.enabled) {
      return
    }
    this.listColliders.forEach((collider) => {
      if (!collider.node.active) {
        this.removeColliders.push(collider)
      }
    })
    // this.removeColliders.forEach((comp) => {
    //   this.listColliders = this.listColliders.filter((col) => !col.isEqual(comp) && col.node.active)
    //   this._contracts = this._contracts.filter((contract) => {
    //     const col1 = contract._collider1
    //     const col2 = contract._collider2
    //     if (col1.isEqual(comp) || !col1.node.active) {
    //       if (contract._touching) {
    //         // contract._touching = false
    //         if (col2.onCollisionExit) {
    //           col2.onCollisionExit(col1)
    //         }
    //       }
    //       return false
    //     }
    //     if (col2.isEqual(comp) || !col2.node.active) {
    //       if (contract._touching) {
    //         // contract._touching = false
    //         if (col1.onCollisionExit) col1.onCollisionExit(col2)
    //       }
    //       return false
    //     }
    //     return true
    //   })
    // })
    this.removeColliders = []
    const draw = this.enabledDebugDraw ? this.debugGraphics : undefined
    if (this.enabledDebugDraw) {
      draw.clear()
    }
    for (const entt of entities.entities_with_components(BoxCollider)) {
      const comp = entt.getComponent(BoxCollider)
      comp.update(dt, draw)
    }
    for (const entt of entities.entities_with_components(CircleCollider)) {
      const comp = entt.getComponent(CircleCollider)
      comp.update(dt, draw)
    }
    for (const entt of entities.entities_with_components(PolygonCollider)) {
      const comp = entt.getComponent(PolygonCollider)
      comp.update(dt, draw)
    }
    if (this.enabledDebugDraw) {
      // draw.clear()
      // draw.removeFromParent()
      // app.stage.addChild(draw)
      // console.log('enabledDebugDraw', this.debugGraphics)
      // this.debugGraphics.width = 4
      // this.debugGraphics.circle(500, 600, 450)
      this.debugGraphics.fill({ color: new Color('white'), alpha: 0.3 })
    }
    // console.log(this._contracts.length)
    this._contracts.forEach((contract) => {
      const col1 = contract._collider1
      const col2 = contract._collider2
      if (!col1.node || !col2.node || !col1.node.active || !col2.node.active) {
        return
      }
      const type = contract.updateState()
      if (!col1 || !col2) {
        return
      }

      switch (type) {
        case CollisionType.ENTER: {
          if (col1.onCollisionEnter) {
            col1.onCollisionEnter(col2)
          }
          if (col2.onCollisionEnter) {
            col2.onCollisionEnter(col1)
          }
          break
        }
        case CollisionType.STAY:
          if (col1.onCollisionStay) {
            col1.onCollisionStay(col2)
          }
          if (col2.onCollisionStay) {
            col2.onCollisionStay(col1)
          }
          break
        case CollisionType.EXIT:
          if (col1.onCollisionExit) {
            col1.onCollisionExit(col2)
          }
          if (col2.onCollisionExit) {
            col2.onCollisionExit(col1)
          }
          break

        default:
          break
      }
    })
  }

  addCollider(colliderPhysics: Collider) {
    this.listColliders.forEach((col) => {
      // if (shouldCollider(col, colliderPhysics)) {
      this._contracts.push(new Contract(col, colliderPhysics))
      // }
    })
    this.listColliders.push(colliderPhysics)
  }

  removeCollider(colliderPhysics: Collider) {
    this.removeColliders.push(colliderPhysics)
  }
  onAddCollider({ entity, component }) {
    console.log('ComponentAddedEvent', component)
    const collider = entity.assign(new Collider(component))
    collider.node = entity.getComponent(NodeComp)
    component.node = entity.getComponent(NodeComp)
    this.addCollider(collider)
  }
  onRemoveCollider({ entity, component }) {
    console.log('ComponentRemovedEvent', component)
    const collider = entity.getComponent(Collider)
    this.removeCollider(collider)
  }
}
