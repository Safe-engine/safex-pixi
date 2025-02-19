import { actionManager } from 'pixi-action-ease'
import { Application } from 'pixi.js'
import { GameWorld } from './base'
import { CollideSystem } from './collider'
import { DragonBonesSystem } from './dragonbones'
import { GUISystem } from './gui/GUISystem'
import { NoRenderSystem } from './norender/NoRenderSystem'
import { RenderSystem } from './render/RenderSystem'
import { SpineSystem } from './spine'

export const app = new Application()

export async function addGameCanvasTo(id = 'game') {
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
    canvas: document.getElementById(id) as HTMLCanvasElement
  })
  // GameWorld.Instance.setup(NodeComp, app.stage)
}

export function setupResolution(designedResolution = { width: 720, height: 1280 }) {
  const { width, height } = designedResolution
  app.renderer.resize(width, height)
  // app.stage.position.y = app.renderer.height / app.renderer.resolution
  // app.stage.scale.y = -1
}

function startGameLoop(world: GameWorld) {
  // Listen for frame updates
  app.ticker.add(() => {
    const dt = app.ticker.deltaMS * 0.001
    actionManager.update(dt)
    world.update(dt)
  })
  // app.ticker.speed = 0.5
}

const systemsList = [RenderSystem, GUISystem, SpineSystem, DragonBonesSystem, CollideSystem, NoRenderSystem]
export function startGameSystems(list = []) {
  const world = GameWorld.Instance
  systemsList.forEach(system => {
    world.systems.add(system)
    world.systems.configureOnce(system)
  })
  world.listUpdate.push(CollideSystem)
  // world.listUpdate.push(PhysicsSystem)
  list.forEach(system => {
    world.systems.add(system)
    world.systems.configureOnce(system)
    world.listUpdate.push(system)
  })
  startGameLoop(world)
  // console.log('startGameLoop', world.listUpdate)
}
