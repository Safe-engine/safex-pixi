import { Graphics, Point, Sprite } from 'pixi.js'

export enum LoadingBarMode {
  BAR,
  RADIAL,
}

export class LoadingBar extends Graphics {
  spriteComp: Sprite
  mode: LoadingBarMode
  fillCenter = new Point(0.5, 0.5)
  constructor(mode: LoadingBarMode, spriteComp: Sprite) {
    super()
    this.spriteComp = spriteComp
    this.mode = mode || LoadingBarMode.BAR
    this.beginFill(0xffffff)
    this.drawRect(0, 0, spriteComp.width, spriteComp.height)
    spriteComp.mask = this
    spriteComp.addChild(this)
  }

  set progress(val: number) {
    this.clear()
    this.beginFill(0xffffff)
    if (this.mode === LoadingBarMode.BAR) {
      const spriteComp = this.spriteComp
      this.drawRect(0, 0, spriteComp.width * val, spriteComp.height)
      // console.log('new length', spriteComp.width)
      this.x = -spriteComp.width * 0.5
      this.y = -spriteComp.height * 0.5
    }
  }
}
