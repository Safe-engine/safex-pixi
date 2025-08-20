import { PixiArmatureDisplay, PixiFactory } from 'dragonbones-pixijs'
import { Assets, BaseComponentProps } from '..'
import { ComponentX } from '../components/BaseComponent'
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
export class DragonBonesComp extends ComponentX<DragonBonesProps, PixiArmatureDisplay> {
  setAnimation(name: string, playTimes = 0) {
    const skel = this.node.instance
    if (skel.animation) {
      skel.animation.play(name, playTimes)
    }
  }

  setSkeletonData(data: DragonBonesData) {
    const { skeleton, atlas, texture } = data
    const skeletonAsset = Assets.get(skeleton)
    const atlasAsset = Assets.get(atlas)
    const textureAsset = Assets.get(texture)
    const armatureName = skeletonAsset.armature[0].name
    // console.log(skeletonAsset, textureAsset, atlasAsset)
    const factory = PixiFactory.factory
    factory.parseDragonBonesData(skeletonAsset, atlasAsset.name)
    factory.parseTextureAtlasData(atlasAsset, textureAsset, atlasAsset.name)
    const armatureDisplay = factory.buildArmatureDisplay(armatureName, atlasAsset.name)!
    armatureDisplay.debugDraw = false
    this.node.instance = armatureDisplay
  }
}
