import { BaseComponentProps } from '..'
import { ComponentX, render } from '../components/BaseComponent'
import { Spine } from './lib'

interface SpineData {
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
    // const skel = this.node.instance
    // const { atlas, skeleton } = data
    // skel.skeleton.initWithArgs(skeleton, atlas)
  }
}

Object.defineProperty(SpineSkeleton.prototype, 'render', { value: render })
