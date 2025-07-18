import Box2DFactory from 'box2d-wasm'
import { EntityManager, EventManager, EventTypes, System } from 'entityx-ts'
import { Graphics } from 'pixi.js'

import { GameWorld, instantiate, NodeComp, Vec2 } from '..'
import { makeContactListener } from './ContactListener'
import { makeDebugDraw } from './debugDraw'
import {
  BoxColliderPhysics,
  CircleColliderPhysics,
  ColliderPhysics,
  PhysicsMaterial,
  PolygonColliderPhysics,
  RigidBody,
} from './PhysicsComponent'
import { PhysicsSprite } from './PhysicsSprite'

// Box2D.b2Fixture.prototype.shouldCollide = function (other) {
//   const nodeThis: NodeComp = this.getBody().getUserData()
//   const nodeOther = other.getBody().getUserData() as NodeComp
//   const { colliderMatrix } = GameWorld.Instance.systems.get(PhysicsSystem)
//   return colliderMatrix[nodeOther.group][nodeThis.group]
// }
export let box2D: typeof Box2D
export async function initBox2d() {
  box2D = await Box2DFactory()
}

export function setColliderMatrix(colliderMatrix = [[true]]) {
  const physicsSystem = GameWorld.Instance.systems.get(PhysicsSystem)
  physicsSystem.colliderMatrix = colliderMatrix
}
const maxTimeStep = 1 / 60
const velocityIterations = 1
const positionIterations = 1
const metadata: { [key: number]: NodeComp } = {}
const pixelsPerMeter = 1

export class PhysicsSystem implements System {
  world: Box2D.b2World
  listRemoveBody: Body[] = []
  listRemoveShape: Box2D.b2Shape[] = []
  colliderMatrix = [[true]]
  graphics: Graphics

  addDebug() {
    const debugDraw = makeDebugDraw(this.graphics, pixelsPerMeter, box2D)
    this.world.SetDebugDraw(debugDraw)
  }

  configure(event_manager: EventManager) {
    const { b2BodyDef, b2_dynamicBody, b2_staticBody, b2FixtureDef, b2PolygonShape, b2Vec2, b2World, getPointer, b2ContactListener } =
      box2D as typeof Box2D
    const gravity = new b2Vec2(0, 10)
    this.world = new b2World(gravity)
    console.log('configure world', (event_manager.world as GameWorld).app)
    // event_manager.world.physicsManager = this
    const graphics = new Graphics()
    this.graphics = graphics
    graphics.zIndex = 1000
    ;(event_manager.world as GameWorld).app.stage.addChild(graphics)
    // event_manager.subscribe(ComponentAddedEvent(RigidBody), this);
    event_manager.subscribe(EventTypes.ComponentAdded, BoxColliderPhysics, ({ entity, component }) => {
      console.log('ComponentAddedEvent BoxColliderPhysics', component)
      let rigidBody = entity.getComponent(RigidBody)
      if (!rigidBody) {
        rigidBody = instantiate(RigidBody)
        entity.assign(rigidBody)
      }
      const { type = 'static', gravityScale = 1 } = rigidBody.props
      const physicsMaterial = entity.getComponent(PhysicsMaterial)
      const { density = 1, friction = 0.5, restitution = 0.3 } = physicsMaterial?.props || {}
      const box = component
      const node = entity.getComponent(NodeComp)
      const { width, height, ...colliderProps } = box.props
      // ett.assign(instantiate(ColliderPhysics, { tag, offset }))
      const { x = 0, y = 0 } = colliderProps.offset || {}
      const zero = new b2Vec2(0, 0)
      const position = new b2Vec2(node.posX, node.posY)
      const offset = new b2Vec2(x, y)

      const bd = new b2BodyDef()
      bd.set_type(type === 'dynamic' ? b2_dynamicBody : b2_staticBody)
      bd.set_position(zero)
      bd.set_gravityScale(gravityScale)
      const body = this.world.CreateBody(bd)
      rigidBody.body = body
      // console.log('body', type, b2_dynamicBody, b2_staticBody, getPointer(body));
      // body.setMassData({ mass: 1 } as any)
      const physicsNode = new PhysicsSprite(node.instance, body)
      const square = new b2PolygonShape()
      square.SetAsBox(width / 2, height / 2)
      const fixtureDef = new b2FixtureDef()
      fixtureDef.set_shape(square)
      fixtureDef.set_density(density)
      fixtureDef.set_friction(friction)
      fixtureDef.set_restitution(restitution)
      body.CreateFixture(fixtureDef)
      body.SetTransform(position, 0)
      body.SetLinearVelocity(zero)
      body.SetAwake(true)
      body.SetEnabled(true)
      metadata[getPointer(body)] = node

      const physicsCollide = entity.assign(instantiate(ColliderPhysics, colliderProps))
      physicsCollide.instance = physicsNode
      physicsCollide.node = node
      box.node = node
    })
    event_manager.subscribe(EventTypes.ComponentAdded, CircleColliderPhysics, () => {})
    event_manager.subscribe(EventTypes.ComponentAdded, PolygonColliderPhysics, () => {})
    event_manager.subscribe(EventTypes.ComponentRemoved, NodeComp, () => {
      // log('ComponentRemovedEvent NodeComp', event);
      // const node = event.entity.getComponent(NodeComp)
      // if (node.instance instanceof Sprite) {
      //   const body = node.instance.getBody()
      //   this.listRemoveShape.push(...body.shapeList)
      //   this.listRemoveBody.push(body)
      // }
    })
    const listener = makeContactListener(this.world, metadata, box2D)
    this.world.SetContactListener(listener)
  }

  update(entities: EntityManager, events: EventManager, dt: number) {
    if (this.world) {
      const clampedDelta = Math.min(dt, maxTimeStep)
      this.world.Step(clampedDelta, velocityIterations, positionIterations)
      this.graphics.clear()
      this.world.DebugDraw()
      this.graphics.fill()
      // this.graphics.stroke();
      // console.log('GetBodyCount', this.world.GetBodyCount());
    }
  }

  set gravity(val: Vec2) {
    this.world.SetGravity(new box2D.b2Vec2(val.x, val.y))
    // this.world.iterations = 60
    // this.world.collisionSlop = 0.5
  }
}
