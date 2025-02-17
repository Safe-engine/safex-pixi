import { Collider, NodeComp, Vec2 } from "..";

interface BaseComponentProps {
  $ref?: object;
  $push?: object[];
  node?: Partial<NodeComp>;
}

interface NodeCompProps {
  nodeName?: string
}

interface LoadingBarProps {
}

interface DragonBonesData {
  atlas: string
  skeleton: string
  texture: string
}
interface DragonBonesProps {
  data: DragonBonesData
  skin?: string
  animation?: string
  playTimes?: number
  timeScale?: number
  onAnimationStart?: (event: { name: string }) => void
  onAnimationEnd?: (event: { name: string }) => void
  onAnimationComplete?: (event: { name: string }) => void
}

export type BodyType = 'kinematic' | 'dynamic' | 'static'
interface RigidBodyProps {
  type?: BodyType
  density?: Float
  restitution?: Float
  friction?: Float
  gravityScale?: Float
}

interface PhysicsMaterialProps {
  friction?: number
  restitution?: number
  density?: number
}

interface ColliderPhysicsProps {
  tag?: number
  group?: number
  offset?: Vec2
  onCollisionEnter?: (other: Collider) => void
  onCollisionExit?: (other: Collider) => void
  onCollisionStay?: (other: Collider) => void
}

interface BoxColliderPhysicsProps extends ColliderPhysicsProps {
  width: number
  height: number
}

interface CircleColliderPhysicsProps extends ColliderPhysicsProps {
  radius: number
}

interface PolygonColliderPhysicsProps extends ColliderPhysicsProps {
  points: Array<Vec2>
}
