import { EventManager, EventTypes, System } from 'entityx-ts'
import { Spine } from './lib'

import { NodeComp } from '../components/NodeComp'
import { SpineSkeleton } from './SpineComponent'

export class SpineSystem implements System {
  configure(event_manager: EventManager) {
    event_manager.subscribe(EventTypes.ComponentAdded, SpineSkeleton, ({ entity, component }) => {
      // console.log('SpineSkeleton', component)
      // const spine = entity.getComponent(SpineSkeleton)
      const { data, skin, animation, loop, timeScale } = component
      const node = Spine.from(data)
      // node.skeleton.scaleY = -1
      if (skin) {
        node.skeleton.setSkinByName(skin)
      }
      if (animation) {
        node.state.setAnimation(0, animation, loop)
      }
      if (timeScale) {
        node.state.timeScale = timeScale
      }
      component.node = entity.assign(new NodeComp(node, entity))
    })
  }
  // update() {
  // throw new Error('Method not implemented.');
  // }
}
