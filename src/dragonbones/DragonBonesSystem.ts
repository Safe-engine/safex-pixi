import { PixiFactory } from 'dragonbones-pixijs';
import { EventManager, EventTypes, System } from 'entityx-ts';

import { Assets } from 'pixi.js';
import { GameWorld } from '../base';
import { NodeComp } from '../components/NodeComp';
import { DragonBones } from './DragonBonesComponent';

export class DragonBonesSystem implements System {
  configure(event_manager: EventManager<GameWorld>) {
    event_manager.subscribe(EventTypes.ComponentAdded, DragonBones, ({ entity, component }) => {
      const { data, animation, playTimes } = component
      const { skeleton, atlas, texture } = data
      const skeletonAsset = Assets.get(skeleton)
      const atlasAsset = Assets.get(atlas)
      const textureAsset = Assets.get(texture)
      const armatureName = skeletonAsset.armature[0].name
      // console.log(skeletonAsset, textureAsset, atlasAsset)
      const factory = PixiFactory.factory;
      factory.parseDragonBonesData(skeletonAsset);
      factory.parseTextureAtlasData(atlasAsset, textureAsset)
      const armatureDisplay = factory.buildArmatureDisplay(armatureName)!;
      armatureDisplay.debugDraw = false;
      const node = armatureDisplay;
      if (animation) {
        armatureDisplay.animation.play(animation, playTimes);
      }
      component.node = entity.assign(new NodeComp(node, entity))
    })
    // event_manager.subscribe(EventTypes.ComponentRemoved, DragonBones, ({ }) => { })
  }

  // update(entities: EntityManager, events: EventManager<GameWorld>, dt: number) {
  // }
}