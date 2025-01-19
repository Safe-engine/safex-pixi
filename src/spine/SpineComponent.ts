import { SpineData, SpineSkeletonProps } from "../../@types/safex"
import { ComponentX } from "../components/BaseComponent"

export class SpineSkeleton extends ComponentX {
  data: SpineData
  skin: string
  animation: string
  loop: boolean
  timeScale: number
  constructor(data: SpineSkeletonProps) {
    super(data)
  }
}
