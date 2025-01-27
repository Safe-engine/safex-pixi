import { DragonBonesProps } from "../@types/safex"
import { ComponentX } from "../components/BaseComponent"

export type DragonBonesData = {
  skeleton,
  atlas,
  texture: string
}
export class DragonBones extends ComponentX<DragonBonesProps> {
  data: DragonBonesData
  skin: string
  animation: string
  playTimes = 0
  timeScale: number

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
