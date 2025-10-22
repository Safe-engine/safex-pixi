import Box2DFactory from 'box2d-wasm'
import { EntityManager, EventManager, EventTypes, System } from 'entityx-ts'
import { Graphics } from 'pixi.js'

import { GameWorld, instantiate, NodeComp, Vec2 } from '..'
import { makeContactListener } from './ContactListener'
import { makeDebugDraw } from './debugDraw'
import { PhysicsBoxCollider, PhysicsCircleCollider, PhysicsPolygonCollider, RigidBody } from './PhysicsComponent'
import { PhysicsSprite } from './PhysicsSprite'

// Box2D.b2Fixture.prototype.shouldCollide = function (other) {
//   const nodeThis: NodeComp = this.getBody().getUserData()
//   const nodeOther = other.getBody().getUserData() as NodeComp
//   const { colliderMatrix } = GameWorld.Instance.systems.get(PhysicsSystem)
//   return colliderMatrix[nodeOther.group][nodeThis.group]
// }
export const DynamicBody = 2
export const KinematicBody = 1
export const StaticBody = 0
export let box2D: typeof Box2D

export async function initBox2d(wasmUrl?) {
  if (wasmUrl) {
    box2D = await Box2DFactory({
      locateFile: () => {
        return wasmUrl
      },
    })
    return
  }
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
  listRemoveBody: Box2D.b2Body[] = []
  // listRemoveShape: Box2D.b2Shape[] = []
  colliderMatrix = [[true]]
  graphics: Graphics

  addDebug() {
    const debugDraw = makeDebugDraw(this.graphics, pixelsPerMeter, box2D)
    this.world.SetDebugDraw(debugDraw)
  }

  configure(event_manager: EventManager) {
    const { b2BodyDef, b2FixtureDef, b2PolygonShape, b2CircleShape, b2Vec2, b2World, pointsToVec2Array, getPointer } = box2D as typeof Box2D
    const gravity = new b2Vec2(0, 10)
    this.world = new b2World(gravity)
    console.log('configure world', (event_manager.world as GameWorld).app)
    // event_manager.world.physicsManager = this
    const graphics = new Graphics()
    this.graphics = graphics
    graphics.zIndex = 1000
    const { app } = event_manager.world as GameWorld
    app.stage.addChild(graphics)
    // event_manager.subscribe(ComponentAddedEvent(RigidBody), this);
    event_manager.subscribe(EventTypes.ComponentAdded, PhysicsBoxCollider, ({ entity, component: box }) => {
      console.log('ComponentAddedEvent BoxColliderPhysics', box)
      let rigidBody = entity.getComponent(RigidBody)
      if (!rigidBody) {
        rigidBody = instantiate(RigidBody)
        entity.assign(rigidBody)
      }
      const { type = StaticBody, gravityScale = 1, density = 1, friction = 0.5, restitution = 0.3, isSensor } = rigidBody.props
      const { width, height, offset = [] } = box.props
      const node = entity.getComponent(NodeComp)
      const zero = new b2Vec2(0, 0)
      const bd = new b2BodyDef()
      bd.set_type(type)
      bd.set_position(zero)
      bd.set_gravityScale(gravityScale)
      const body = this.world.CreateBody(bd)
      rigidBody.body = body
      const physicsNode = new PhysicsSprite(node.instance, rigidBody.body)
      rigidBody.physicSprite = physicsNode
      rigidBody.node = node
      // console.log('body', type, b2_dynamicBody, b2_staticBody, getPointer(body));
      // body.setMassData({ mass: 1 } as any)
      const position = new b2Vec2(node.posX, node.posY)
      const square = new b2PolygonShape()
      const [x = 0, y = 0] = offset
      square.SetAsBox(width / 2, height / 2, new b2Vec2(node.w / 2 + x, node.h / 2 + y), 0)
      const fixtureDef = new b2FixtureDef()
      fixtureDef.set_shape(square)
      fixtureDef.set_density(density)
      fixtureDef.set_friction(friction)
      fixtureDef.set_restitution(restitution)
      fixtureDef.set_isSensor(isSensor)
      rigidBody.body.CreateFixture(fixtureDef)
      rigidBody.body.SetTransform(position, 0)
      rigidBody.body.SetLinearVelocity(zero)
      rigidBody.body.SetAwake(true)
      rigidBody.body.SetEnabled(true)
      metadata[getPointer(rigidBody.body)] = node
      box.node = node
    })
    event_manager.subscribe(EventTypes.ComponentAdded, PhysicsCircleCollider, ({ entity, component }) => {
      // console.log('ComponentAddedEvent PhysicsCircleCollider', component)
      let rigidBody = entity.getComponent(RigidBody)
      if (!rigidBody) {
        rigidBody = instantiate(RigidBody)
        entity.assign(rigidBody)
      }
      const { type = StaticBody, gravityScale = 1, density = 100, friction = 0.5, restitution = 0.3, isSensor = false } = rigidBody.props
      const node = entity.getComponent(NodeComp)
      const { radius, offset = [] } = component.props
      const [x = 0, y = 0] = offset
      const zero = new b2Vec2(0, 0)
      const position = new b2Vec2(node.posX, node.posY)

      const bd = new b2BodyDef()
      bd.set_type(type)
      bd.set_position(zero)
      bd.set_gravityScale(gravityScale)
      const body = this.world.CreateBody(bd)
      rigidBody.body = body
      // console.log('body', type, b2_dynamicBody, b2_staticBody, getPointer(body));
      // body.setMassData({ mass: 1 } as any)
      const physicsNode = new PhysicsSprite(node.instance, body)
      const circleShape = new b2CircleShape()
      circleShape.set_m_radius(radius)
      circleShape.set_m_p(new b2Vec2(x, y))
      const fixtureDef = new b2FixtureDef()
      fixtureDef.set_shape(circleShape)
      fixtureDef.set_density(density)
      fixtureDef.set_isSensor(isSensor)
      fixtureDef.set_friction(friction)
      fixtureDef.set_restitution(restitution)
      body.CreateFixture(fixtureDef)
      body.SetTransform(position, 0)
      body.SetLinearVelocity(zero)
      body.SetAwake(true)
      body.SetEnabled(true)
      metadata[getPointer(body)] = node

      rigidBody.physicSprite = physicsNode
      rigidBody.node = node
      component.node = node
    })
    event_manager.subscribe(EventTypes.ComponentAdded, PhysicsPolygonCollider, ({ entity, component }) => {
      // console.log('ComponentAddedEvent PhysicsPolygonCollider', component)
      let rigidBody = entity.getComponent(RigidBody)
      if (!rigidBody) {
        rigidBody = instantiate(RigidBody)
        entity.assign(rigidBody)
      }
      const { type = StaticBody, gravityScale = 1, density = 1, friction = 0.5, restitution = 0.3, isSensor } = rigidBody.props
      const node = entity.getComponent(NodeComp)
      const { points, offset = [] } = component.props
      const [x = 0, y = 0] = offset
      const zero = new b2Vec2(0, 0)
      const position = new b2Vec2(node.posX, node.posY)
      const { width, height } = node.contentSize
      const { scaleX, scaleY, anchorX, anchorY } = node

      const bd = new b2BodyDef()
      bd.set_type(type)
      bd.set_position(zero)
      bd.set_gravityScale(gravityScale)
      const body = this.world.CreateBody(bd)
      rigidBody.body = body
      // console.log('body', type, b2_dynamicBody, b2_staticBody, getPointer(body));
      // body.setMassData({ mass: 1 } as any)
      const physicsNode = new PhysicsSprite(node.instance, body)
      const polygonShape = new b2PolygonShape()
      const fixedPoints = points.map((p) => {
        if (p.x) return Vec2(p.x + x - width * anchorX * scaleX, -p.y + y + height * scaleY * anchorY)
        return Vec2(p[0] + x - width * anchorX * scaleX, -p[1] + y + height * scaleY * anchorY)
      })
      const [vecArr, destroyVecArr] = pointsToVec2Array(fixedPoints)
      // console.log('vecArr', vecArr, vecArr.Length())
      polygonShape.Set(vecArr, points.length)
      destroyVecArr()
      const fixtureDef = new b2FixtureDef()
      fixtureDef.set_shape(polygonShape)
      fixtureDef.set_density(density)
      fixtureDef.set_friction(friction)
      fixtureDef.set_restitution(restitution)
      fixtureDef.set_isSensor(isSensor)
      body.CreateFixture(fixtureDef)
      body.SetTransform(position, 0)
      // body.SetLinearVelocity(zero)
      body.SetAwake(true)
      body.SetEnabled(true)
      metadata[getPointer(body)] = node

      rigidBody.physicSprite = physicsNode
      rigidBody.node = node
      component.node = node
    })
    event_manager.subscribe(EventTypes.ComponentRemoved, RigidBody, ({ component }) => {
      // console.log('ComponentRemovedEvent NodeComp', component)
      if (component.physicSprite instanceof PhysicsSprite) {
        const body = component.physicSprite.getBody()
        // this.listRemoveShape.push(...body.shapeList)
        this.listRemoveBody.push(body)
      }
    })
    const listener = makeContactListener(this.world, metadata, box2D)
    this.world.SetContactListener(listener)
  }

  update(entities: EntityManager, _events: EventManager, dt: number) {
    if (this.world) {
      const { getPointer } = box2D
      for (const entt of entities.entities_with_components(RigidBody)) {
        const comp = entt.getComponent(RigidBody)
        if (comp.node.active && comp.enabled) {
          comp.physicSprite.update(dt)
        }
      }
      // remove bodies and shapes
      this.listRemoveBody.forEach((body) => {
        if (body) {
          this.world.DestroyBody(getPointer(body))
        }
      })
      this.listRemoveBody = []
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
