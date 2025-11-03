import { actionManager } from 'pixi-action-ease'
import { Application, Assets, AssetsClass, Renderer } from 'pixi.js'

import { GameWorld } from './base'
import { NoRenderSystem } from './norender/NoRenderSystem'
import { RenderSystem } from './render/RenderSystem'

export async function startGame(
  defaultFont,
  designedResolution = { width: 720, height: 1280 },
  assetManager: AssetsClass,
  id = 'gameCanvas',
): Promise<Application<Renderer>> {
  const app = new Application()
  await app.init({
    antialias: true,
    resolution: window.devicePixelRatio,
    resizeTo: window,
    eventFeatures: {
      move: true,
      /** disables the global move events which can be very expensive in large scenes */
      globalMove: false,
      click: true,
      wheel: false,
    },
    canvas: document.getElementById(id) as HTMLCanvasElement,
  })
  Object.assign(app.canvas.style, {
    width: `${window.innerWidth}px`,
    height: `${window.innerHeight}px`,
    overflow: 'visible',
  })
  const { width, height } = designedResolution
  app.renderer.resize(width, height)
  // app.stage.position.y = app.renderer.height / app.renderer.resolution
  // app.stage.scale.y = -1
  GameWorld.Instance.app = app
  GameWorld.Instance.assetManager = assetManager
  initWorld(defaultFont)
  startGameLoop(GameWorld.Instance)
  return app
}

function startGameLoop(world: GameWorld) {
  // Listen for frame updates
  world.app.ticker.add(() => {
    const dt = world.app.ticker.deltaMS * 0.001
    actionManager.update(dt)
    world.update(dt)
  })
  // app.ticker.speed = 0.5
}

function initWorld(defaultFont?: string) {
  const world = GameWorld.Instance
  const fontSystem = world.systems.addThenConfigure(RenderSystem)
  if (defaultFont) {
    fontSystem.defaultFont = defaultFont
  }
  world.systems.addThenConfigure(NoRenderSystem)
}

export function loadAll(assets: any, cb?: (progress: number) => void) {
  const allAssets = []
  const fontBundle = {}
  Object.values(assets).forEach((value: any) => {
    if (value.skeleton) {
      allAssets.push(value.skeleton)
    } else if (value.atlas) {
      allAssets.push(value.atlas)
    } else if (value.texture) {
      allAssets.push(value.texture)
    } else if (value.endsWith('.ttf')) {
      fontBundle[value] = value
    } else {
      allAssets.push(value)
    }
  })
  Assets.addBundle('fonts', fontBundle)
  return Promise.all([Assets.loadBundle('fonts')]).then(async () => {
    await Assets.load(allAssets, cb)
  })
}
