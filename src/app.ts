import { actionManager } from 'pixi-action-ease'
import { Application } from 'pixi.js'
import { GameWorld } from './base'
import { CollideSystem } from './collider'
import { SpineSystem } from './spine'
import { GUISystem } from './systems/GUISystem'
import { RenderSystem } from './systems/RenderSystem'

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

const systemsList = [RenderSystem, GUISystem, SpineSystem, CollideSystem]
export function startGameSystems() {
  const world = GameWorld.Instance
  systemsList.forEach(system => {
    world.systems.add(system)
    const sys = world.systemsMap[system.name]
    if (sys.update) {
      world.listUpdate.push(system)
    }
  })
  world.systems.configure()
  startGameLoop(world)
}
