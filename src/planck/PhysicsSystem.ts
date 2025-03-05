import {
  Entity,
  EntityManager,
  EventManager,
  EventTypes,
  System
} from 'entityx-ts'
import { Body, Box, Contact, Fixture, Manifold, Shape, Vec2, World } from 'planck'

import { Graphics } from 'pixi.js'
import { GameWorld, instantiate } from '../base'
import { NodeComp } from '../components/NodeComp'
import {
  BoxColliderPhysics,
  CircleColliderPhysics,
  ColliderPhysics,
  PolygonColliderPhysics,
  RigidBody,
} from './PhysicsComponent'
import { PhysicsSprite } from './PhysicsSprite'

Fixture.prototype.shouldCollide = function (other) {
  const nodeThis: NodeComp = this.getBody().getUserData()
  const nodeOther = other.getBody().getUserData() as NodeComp
  const { colliderMatrix } = GameWorld.Instance.systems.get(PhysicsSystem)
  return colliderMatrix[nodeOther.group][nodeThis.group]
}

export function setColliderMatrix(colliderMatrix = [[true]]) {
  const physicsSystem = GameWorld.Instance.systems.get(PhysicsSystem)
  physicsSystem.colliderMatrix = colliderMatrix
}

export class PhysicsSystem implements System {
  world: World
  listRemoveBody: Body[] = []
  listRemoveShape: Shape[] = []
  colliderMatrix = [[true]]

  configure(event_manager: EventManager) {
    this.world = new World({
      gravity: Vec2(0, 98.0),
    })
    // event_manager.world.physicsManager = this
    // event_manager.subscribe(ComponentAddedEvent(RigidBody), this);
    event_manager.subscribe(EventTypes.ComponentAdded, BoxColliderPhysics, ({ entity, component }) => {
      console.log('ComponentAddedEvent BoxColliderPhysics', component)
      let rigidBody = entity.getComponent(RigidBody)
      if (!rigidBody) {
        rigidBody = instantiate(RigidBody)
        entity.assign(rigidBody)
      }
      const { type = 'dynamic', gravityScale = 1 } = rigidBody.props
      // const physicsMaterial = entity.getComponent(PhysicsMaterial)
      const box = component
      const node = entity.getComponent(NodeComp)
      const { width, height, ...colliderProps } = box.props
      // ett.assign(instantiate(ColliderPhysics, { tag, offset }))
      // const { density, restitution, friction } = physicsMaterial
      const { x = 0, y = 0 } = colliderProps.offset || {}
      const body = this.world.createBody({
        position: { x: node.position.x + x, y: node.position.y + y }, // the body's origin position.
        angle: 0.25 * Math.PI, // the body's angle in radians.
        userData: node,
        type,
        gravityScale,
      })
      rigidBody.body = body
      // console.log('body', body);
      // body.setMassData({ mass: 1 } as any)
      const physicsNode = new PhysicsSprite(node.instance, body)
      const shape = new Box(width, height)
      body.createFixture({
        shape,
        density: 1,
        isSensor: true,
      })
      const debugBox = new Graphics()
      debugBox.rect(x, y, width, height)
      debugBox.fill({ color: 0xff0000, alpha: 0.3 })
      node.instance.addChild(debugBox)
      const physicsCollide = entity.assign(instantiate(ColliderPhysics, colliderProps))
      physicsCollide.instance = physicsNode
      physicsCollide.node = node
      box.node = node
    })
    event_manager.subscribe(EventTypes.ComponentAdded, (CircleColliderPhysics), () => { })
    event_manager.subscribe(EventTypes.ComponentAdded, (PolygonColliderPhysics), () => { })
    event_manager.subscribe(EventTypes.ComponentRemoved, (NodeComp), () => {
      // log('ComponentRemovedEvent NodeComp', event);
      // const node = event.entity.getComponent(NodeComp)
      // if (node.instance instanceof Sprite) {
      //   const body = node.instance.getBody()
      //   this.listRemoveShape.push(...body.shapeList)
      //   this.listRemoveBody.push(body)
      // }
    })
    this.world.on('begin-contact', this.contactBegin.bind(this))
    this.world.on('end-contact', this.contactEnd.bind(this))
    this.world.on('pre-solve', this.preSolve.bind(this))
    this.world.on('post-solve', this.postSolve.bind(this))
  }

  update(entities: EntityManager, events: EventManager, dt: number) {
    if (this.world) {
      this.world.step(dt)

      // Iterate over bodies
      for (let body = this.world.getBodyList(); body; body = body.getNext()) {
        this.renderBody(body)
        // ... and fixtures
        for (let fixture = body.getFixtureList(); fixture; fixture = fixture.getNext()) {
          this.renderFixture(fixture)
        }
      }

      // Iterate over joints
      for (let joint = this.world.getJointList(); joint; joint = joint.getNext()) {
        this.renderJoint(joint)
      }
    }
  }

  renderBody(body: Body) {
    // Render or update body rendering
    const ett = body.getUserData() as NodeComp
    const collider = ett.getComponent(ColliderPhysics)
    if (collider) {
      collider.instance.node.position = body.getPosition()
      collider.instance.angle = body.getAngle()
      // console.log('renderBody body', body.getPosition())
    }
  }

  renderFixture(fixture: Fixture) {
    // Render or update fixture rendering
    // const shape = fixture.getShape()
    // console.log('renderFixture shape', shape.m_type)
  }

  renderJoint(joint) {
    // Render or update joint rendering
  }

  contactBegin(contact: Contact) {
    console.log('contactBegin');
    const ett1: NodeComp = contact.getFixtureA().getBody().getUserData() as NodeComp
    const ett2: NodeComp = contact.getFixtureB().getBody().getUserData() as NodeComp
    // this.world.addPostStepCallback(() => {
    //   // log('addPostStepCallback');
    //   this.listRemoveShape.forEach((s) => this.world.removeShape(s))
    //   this.listRemoveBody.forEach((b) => this.world.removeBody(b))
    //   this.listRemoveBody = []
    //   this.listRemoveShape = []
    // })
    const phys1 = ett1.getComponent(ColliderPhysics)
    const phys2 = ett2.getComponent(ColliderPhysics)
    if (phys1 && phys2) {
      if (Object.prototype.hasOwnProperty.call(phys1, 'onCollisionEnter')) {
        phys1.props.onCollisionEnter(phys2)
      }
      if (Object.prototype.hasOwnProperty.call(phys2, 'onCollisionEnter')) {
        phys2.props.onCollisionEnter(phys1)
      }
    }
  }

  preSolve(contact: Contact, oldManifold: Manifold) {
    console.log('preSolve');
  }

  postSolve(contact: Contact, contactImpulse) {
    console.log('collisionPost');
  }

  contactEnd(contact: Contact) {
    console.log('collisionSeparate');
    const ett1: Entity = contact.getFixtureA().getBody().getUserData() as Entity
    const ett2: Entity = contact.getFixtureB().getBody().getUserData() as Entity
    // const event1 = ett1.getComponent(NodeComp)
    const phys1 = ett1.getComponent(ColliderPhysics)
    const phys2 = ett2.getComponent(ColliderPhysics)
    // const event2 = ett2.getComponent(NodeComp)
    if (phys1 && phys2) {
      if (Object.prototype.hasOwnProperty.call(phys1, 'onCollisionExit')) {
        phys1.props.onCollisionExit(phys2)
      }
      if (Object.prototype.hasOwnProperty.call(phys2, 'onCollisionExit')) {
        phys2.props.onCollisionExit(phys1)
      }
    }
  }

  set enabled(val) {
    if (val) {
      this.world.setGravity(Vec2(0, 98))
      // this.world.iterations = 60
      // this.world.collisionSlop = 0.5
    }
  }
}
