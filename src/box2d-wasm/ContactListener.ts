import { NodeComp } from "..";
import { ColliderPhysics } from "./PhysicsComponent";
type Meta = { [key: number]: NodeComp }
export const makeContactListener = (world: Box2D.b2World, metadata: Meta, box2D: typeof Box2D) => {
  const { JSContactListener, getPointer, NULL } = box2D
  function getContactById(contact: number) {
    for (let contactList = world.GetContactList(); getPointer(contactList) !== getPointer(NULL); contactList = contactList.GetNext()) {
      if (getPointer(contactList) === contact) {
        console.log('contactBegin', contact, getPointer(contactList), getPointer(NULL));
        return contactList
      }
    }
  }
  const listener = Object.assign(new JSContactListener(), {
    BeginContact(contact: Box2D.b2Contact | number): void {
      if (typeof contact === 'number') {
        contact = getContactById(contact)
      }
      const ett1: NodeComp = metadata[getPointer(contact.GetFixtureA().GetBody())]
      const ett2: NodeComp = metadata[getPointer(contact.GetFixtureB().GetBody())]
      // world.addPostStepCallback(() => {
      //   // log('addPostStepCallback');
      //   listRemoveShape.forEach((s) => world.removeShape(s))
      //   listRemoveBody.forEach((b) => world.removeBody(b))
      //   listRemoveBody = []
      //   listRemoveShape = []
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
    },
    EndContact(contact: Box2D.b2Contact | number): void {
      if (typeof contact === 'number') {
        contact = getContactById(contact)
      }
      const ett1: NodeComp = metadata[getPointer(contact.GetFixtureA().GetBody())]
      const ett2: NodeComp = metadata[getPointer(contact.GetFixtureB().GetBody())]
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
    },
    PreSolve(contact: Box2D.b2Contact | number, oldManifold: Box2D.b2Manifold | number): void {
      console.log('collisionSeparate');
    },
    PostSolve(contact: Box2D.b2Contact | number, impulse: Box2D.b2ContactImpulse | number): void {
      console.log('collisionPost');
    }
  });
  return listener
}