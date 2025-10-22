import { PixiFactory } from 'dragonbones-pixijs'
import { EventManager, EventTypes, System } from 'entityx-ts'

import { Assets } from 'pixi.js'
import { GameWorld } from '../base'
import { NodeComp } from '../components/NodeComp'
import { DragonBonesComp } from './DragonBonesComponent'

export class DragonBonesSystem implements System {
  configure(event_manager: EventManager<GameWorld>) {
    event_manager.subscribe(EventTypes.ComponentAdded, DragonBonesComp, ({ entity, component }) => {
      const { data, animation, playTimes = 0, isFlipX, timeScale = 1 } = component.props
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
      const node = armatureDisplay
      node.armature.animation.timeScale = timeScale
      if (animation) {
        armatureDisplay.animation.play(animation, playTimes)
      }
      component.node = entity.assign(new NodeComp(node, entity))
      if (isFlipX) {
        component.setFLipX(isFlipX)
      }
    })
    // event_manager.subscribe(EventTypes.ComponentRemoved, DragonBones, ({ }) => { })
  }

  // update(entities: EntityManager, events: EventManager<GameWorld>, dt: number)
  // update() { }
}
