import { Graphics, Point, Sprite, Texture } from 'pixi.js'

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
    this.fill(0xffffff)
    this.rect(0, 0, spriteComp.width, spriteComp.height)
    spriteComp.mask = this
    spriteComp.addChild(this)
  }

  set progress(val: number) {
    this.clear()
    this.fill(0xffffff)
    if (this.mode === LoadingBarMode.BAR) {
      const spriteComp = this.spriteComp
      this.rect(0, 0, spriteComp.width * val, spriteComp.height)
      // console.log('new length', spriteComp.width)
      this.x = -spriteComp.width * 0.5
      this.y = -spriteComp.height * 0.5
    }
  }
}

export class ProgressTimer {
  graphics: Graphics
  spriteComp: Sprite
  mode: LoadingBarMode
  fillCenter = new Point(0.5, 0.5)
  constructor(mode: LoadingBarMode, spriteFrame: string) {
    const texture = Texture.from(spriteFrame)
    this.spriteComp = Sprite.from(texture)
    this.graphics = new Graphics()
    this.mode = mode || LoadingBarMode.BAR
    this.graphics.fill(0xffffff)
    this.graphics.rect(0, 0, this.spriteComp.width, this.spriteComp.height)
    this.spriteComp.mask = this.graphics
    this.spriteComp.addChild(this.graphics)
    this.graphics.x = -this.spriteComp.width * this.fillCenter.x
    this.graphics.y = -this.spriteComp.height * this.fillCenter.y
  }

  set progress(val: number) {
    this.graphics.clear()
    this.graphics.fill(0xffffff)
    if (this.mode === LoadingBarMode.BAR) {
      this.graphics.rect(0, 0, this.spriteComp.width * val, this.spriteComp.height)
      // console.log('new length', this.width)
    }
  }
}