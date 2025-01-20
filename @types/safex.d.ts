import { NodeComp } from "../src";
import { Color4B } from "../src/core/Color";

type ColorSource = ReturnType<typeof Color4B>

interface BaseComponentProps {
  $ref?: object;
  $push?: object[];
  node?: Partial<NodeComp>;
  // [$key: `$${string}`]: string
}

interface NodeCompProps extends BaseComponentProps {
  nodeName?: string
}

interface SpriteRenderProps extends BaseComponentProps {
  spriteFrame: string
}

interface GraphicsRenderProps extends BaseComponentProps {
  lineWidth?: number
  strokeColor?: ColorSource
  fillColor?: ColorSource
}

interface MaskRenderProps extends BaseComponentProps {
  type?: number
  segments?: number
  inverted?: boolean
}

interface ProgressTimerProps extends BaseComponentProps {
  spriteFrame: string
  fillType?: LoadingBarMode
  fillRange?: number
  fillCenter?: Point
  isReverse?: boolean
}

interface LoadingBarProps extends BaseComponentProps {
}

interface LabelCompProps extends BaseComponentProps {
  font?: string
  string?: string
  size?: number
}

interface ScrollViewProps extends BaseComponentProps {
  width: number
  height: number
}

interface LabelOutlineCompProps extends BaseComponentProps {
  color: ColorSource
  width: number
}

interface LabelShadowCompProps extends BaseComponentProps {
  color: ColorSource
  blur: number
  offset: Point
}

interface ColliderProps extends BaseComponentProps {
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
interface SpineSkeletonProps extends BaseComponentProps {
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
interface DragonBonesProps extends BaseComponentProps {
  data: DragonBonesData
  skin?: string
  animation?: string
  playTimes?: number
  timeScale?: number
  onAnimationStart?: (event: { name: string }) => void
  onAnimationEnd?: (event: { name: string }) => void
  onAnimationComplete?: (event: { name: string }) => void
}

interface ExtraDataProps extends BaseComponentProps {
  key: string
  value: any
}

interface ButtonCompProps extends BaseComponentProps {
  normalImage?: string
  selectedImage?: string
  disableImage?: string
  zoomScale?: number
  onPress: (target: ButtonComp) => void
}
