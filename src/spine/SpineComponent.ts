import { BaseComponentProps, registerSystem, Vec2 } from '..'
import { ComponentX, render } from '../components/BaseComponent'
import { Spine } from './lib'

export interface SpineData {
  atlas: string
  skeleton: string
  texture?: string
}

interface SpineSkeletonProps extends BaseComponentProps<SpineSkeleton> {
  data: SpineData
  skin?: string
  animation?: string
  timeScale?: number
  loop?: boolean
}
export class SpineSkeleton extends ComponentX<SpineSkeletonProps, Spine> {
  setAnimation(name: string, loop = false) {
    const skel = this.node.instance
    if (skel.state) {
      skel.state.setAnimation(0, name, loop)
    }
  }

  setSkeletonData(data: SpineData) {
    const skel = this.node.instance
    // const { atlas, skeleton } = data
    // skel.skeleton.initWithArgs(skeleton, atlas)
    const { skin, animation, loop = true, timeScale } = this.props
    const node = Spine.from(data)
    if (skin) {
      node.skeleton.setSkinByName(skin)
    }
    if (animation) {
      node.state.setAnimation(0, animation, loop)
    }
    if (timeScale) {
      node.state.timeScale = timeScale
    }
    node.x = skel.x
    node.y = skel.y
    node.scale = skel.scale
    node.rotation = skel.rotation
    const parent = skel.parent
    if (parent) {
      parent.addChild(node)
      parent.removeChild(skel)
    }
    this.node.instance = node
  }
}

Object.defineProperty(SpineSkeleton.prototype, 'render', { value: render })

interface SpineBonesControlComponentProps extends BaseComponentProps<SpineBonesControlComponent> {
  posList: Vec2[]
  bonesName: string[]
}
export class SpineBonesControlComponent extends ComponentX<SpineBonesControlComponentProps, Spine> {
  start() {
    const skel = this.node.getComponent(SpineSkeleton)!.node.instance
    const { bonesName = [], posList = [] } = this.props
    bonesName.forEach((boneName: string, index: number) => {
      const bone = skel.skeleton.findBone(boneName)
      if (bone) {
        const pos = posList[index]
        bone.x = pos.x
        bone.y = pos.y
      }
    })
  }
}

registerSystem(SpineBonesControlComponent)
