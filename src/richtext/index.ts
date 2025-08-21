import { GameWorld } from '..'
import { RichTextSystem } from './RichTextSystem'
export * from './RichTextComp'

export function setupRichText() {
  GameWorld.Instance.systems.addThenConfigure(RichTextSystem)
}
