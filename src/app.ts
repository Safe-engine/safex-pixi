import { actionManager } from 'pixi-action-ease'
import { Application, AssetsClass } from 'pixi.js'

import { GameWorld } from './base'
import { CollideSystem } from './collider'
import { GUISystem } from './gui/GUISystem'
import { NoRenderSystem } from './norender/NoRenderSystem'
import { RenderSystem } from './render/RenderSystem'

export function startGame(defaultFont, designedResolution = { width: 720, height: 1280 }, assetManager: AssetsClass, id = 'gameCanvas') {
  const gameDiv = document.getElementById(id) as HTMLCanvasElement
  const { width = 720, height = 1280 } = designedResolution
  const app = new Application({
    width,
    height,
    antialias: true,
    resolution: window.devicePixelRatio,
    view: gameDiv,
  })
  Object.assign(app.view.style, {
    width: `${window.innerWidth}px`,
    height: `${window.innerHeight}px`,
    overflow: 'visible',
  })
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

// const systemsList = [RenderSystem, GUISystem, SpineSystem, DragonBonesSystem, CollideSystem, NoRenderSystem]
// export function startGameSystems(list = []) {
//   const world = GameWorld.Instance
//   systemsList.forEach(system => {
//     world.systems.add(system)
//     world.systems.configureOnce(system)
//   })
//   world.listUpdate.push(CollideSystem)
//   // world.listUpdate.push(PhysicsSystem)
//   list.forEach(system => {
//     world.systems.add(system)
//     world.systems.configureOnce(system)
//     world.listUpdate.push(system)
//   })
//   startGameLoop(world)
//   // console.log('startGameLoop', world.listUpdate)
// }

function initWorld(defaultFont?: string) {
  const world = GameWorld.Instance
  world.systems.add(RenderSystem)
  world.systems.add(CollideSystem)
  world.systems.add(GUISystem)
  world.systems.add(NoRenderSystem)
  world.listUpdate.push(CollideSystem)
  world.systems.configureOnce(RenderSystem)
  world.systems.configureOnce(CollideSystem)
  world.systems.configureOnce(GUISystem)
  world.systems.configureOnce(NoRenderSystem)
  if (defaultFont) {
    const guiSystem = world.systems.get(GUISystem)
    guiSystem.defaultFont = defaultFont
  }
  // startGameLoop(world, app)
}
