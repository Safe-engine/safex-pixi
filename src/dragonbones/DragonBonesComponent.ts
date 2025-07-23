import { BaseComponentProps } from ".."
import { ComponentX } from "../components/BaseComponent"
interface DragonBonesData {
  atlas: string
  skeleton: string
  texture: string
}

interface DragonBonesProps extends BaseComponentProps<DragonBonesComp> {
  data: DragonBonesData
  skin?: string
  animation?: string
  playTimes?: number
  timeScale?: number
  onAnimationStart?: (event: { name: string }) => void
  onAnimationEnd?: (event: { name: string }) => void
  onAnimationComplete?: (event: { name: string }) => void
}
export class DragonBonesComp extends ComponentX<DragonBonesProps> {

  setAnimation(name: string, playTimes = 0) {
    const skel: any = this.node.instance
    if (skel.animation) {
      skel.animation.play(name, playTimes)
    }
  }

  setSkeletonData(data: string) {
    const skel: any = this.node.instance
    const atlas = data.replace('.json', '.atlas')
    skel.initWithArgs(data, atlas, this.node.scale)
  }
}
