import { BaseComponentProps } from '..'
import { ComponentX } from '../components/BaseComponent'
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
export class SpineSkeleton extends ComponentX<SpineSkeletonProps, Spine> {}
