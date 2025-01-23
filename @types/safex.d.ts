import { NodeComp, TouchEVentCallback } from "../src";
import { Color4B } from "../src/core/Color";

type ColorSource = ReturnType<typeof Color4B>

interface BaseComponentProps {
  $ref?: object;
  $push?: object[];
  node?: Partial<NodeComp>;
  // [$key: `$${string}`]: string
}

interface NodeCompProps {
  nodeName?: string
}

interface SpriteRenderProps {
  spriteFrame: string
}

interface GraphicsRenderProps {
  lineWidth?: number
  strokeColor?: ColorSource
  fillColor?: ColorSource
}

interface MaskRenderProps {
  type?: number
  segments?: number
  inverted?: boolean
}

interface ProgressTimerProps {
  spriteFrame: string
  fillType?: LoadingBarMode
  fillRange?: number
  fillCenter?: Point
  isReverse?: boolean
}

interface LoadingBarProps {
}

interface LabelCompProps {
  font?: string
  string?: string
  size?: number
}

interface ScrollViewProps {
  width: number
  height: number
}

interface LabelOutlineCompProps {
  color: ColorSource
  width: number
}

interface LabelShadowCompProps {
  color: ColorSource
  blur: number
  offset: Point
}

interface ColliderProps {
  offset?: Point
  tag?: number
  enabled?: boolean
  onCollisionEnter?: (other: Collider) => void
  onCollisionExit?: (other: Collider) => void
  onCollisionStay?: (other: Collider) => void
}

interface BoxColliderProps extends ColliderProps {
  width: number
  height: number
}

interface CircleColliderProps extends ColliderProps {
  radius: number
}

interface PolygonColliderProps extends ColliderProps {
  points: Array<Point>
}

interface SpineData {
  atlas: string
  skeleton: string
  texture?: string
}
interface SpineSkeletonProps {
  data: SpineData
  skin?: string
  animation?: string
  timeScale?: number
  loop?: boolean
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

interface ExtraDataProps {
  key: string
  value: any
}

interface ButtonCompProps {
  normalImage?: string
  selectedImage?: string
  disableImage?: string
  zoomScale?: number
  onPress: (target: ButtonComp) => void
}

interface TouchEventProps {
  onTouchStart?: TouchEVentCallback
  onTouchMove?: TouchEVentCallback
  onTouchEnd?: TouchEVentCallback
  onTouchCancel?: TouchEVentCallback
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

interface BoxColliderPhysicsProps {
  width: number
  height: number
}

interface CircleColliderPhysicsProps {
  radius: number
}

interface PolygonColliderPhysicsProps {
  points: Array<Vec2>
}
