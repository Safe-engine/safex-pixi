import { FancyButton } from '@pixi/ui'
import { BaseComponentProps, GameWorld, NodeComp, registerSystem } from '..'
import { ComponentX } from '../components/BaseComponent'

interface FancyButtonCompProps extends BaseComponentProps<FancyButtonComp> {
  normalImage?: string
  selectedImage?: string
  disableImage?: string
  zoomScale?: number
  onPress: (target: FancyButtonComp) => void
}

export class FancyButtonComp extends ComponentX<FancyButtonCompProps, FancyButton> {
  render() {
    const { zoomScale = 1.2, normalImage, selectedImage, disableImage } = this.props
    const button = new FancyButton({
      defaultView: normalImage,
      // hoverView: 'button_hover.png',
      disabledView: disableImage,
      pressedView: selectedImage,
      // text: 'Click me!',
      animations: {
        pressed: {
          props: {
            scale: {
              x: zoomScale,
              y: zoomScale,
            },
          },
          duration: 100,
        },
      },
    })
    button.onPress.connect(() => {
      if (!this.enabled) return
      // console.log('onPress.connect')
      if (Object.prototype.hasOwnProperty.call(this.props, 'onPress')) {
        this.props.onPress(this)
      }
    })
    const world = GameWorld.Instance
    const entity = world.entities.create()
    entity.assign(new NodeComp(button, entity))
    const comp = entity.assign(this)
    return comp
  }
}
registerSystem(FancyButtonComp)
