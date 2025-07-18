import { EntityManager, EventManager, EventReceiveCallback, EventTypes, System } from 'entityx-ts'

import TaggedText from 'pixi-tagged-text-plus'
import { NodeComp } from '..'
import { RichTextComp } from './RichTextComp'

export class RichTextSystem implements System {
  configure(event_manager: EventManager) {
    event_manager.subscribe(EventTypes.ComponentAdded, RichTextComp, this.onAddRichTextComp)
  }

  private onAddRichTextComp: EventReceiveCallback<RichTextComp> = ({ entity, component }) => {
    const { string = '', font = '', size = 64 } = component.props
    const node = new TaggedText(string);
    // node.defaultStyle = { }
    component.node = entity.assign(new NodeComp(node, entity))
    component.string = (string)
    if (font) component.font = (font)
    if (size) component.size = (size)
  }

  update(entities: EntityManager, events: EventManager, dt: number)
  update() {
    // throw new Error('Method not implemented.');
  }
}
