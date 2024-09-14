import { Application } from 'pixi.js'
import { actionManager } from 'pixi-action-ease'

import { GameWorld } from './gworld'
import { GUISystem } from './systems/GUISystem'
import { RenderSystem } from './systems/RenderSystem'

export const app = new Application()

export function setupResolution(designedResolution = { width: 720, height: 1280 }) {
  const { width, height } = designedResolution
  app.renderer.resize(width, height)
  app.stage.position.y = app.renderer.height / app.renderer.resolution
  app.stage.scale.y = -1
}

export async function addGameCanvasTo(id = 'game') {
  await app.init({
    antialias: true,
    resolution: window.devicePixelRatio,
    eventFeatures: {
      move: true,
      /** disables the global move events which can be very expensive in large scenes */
      globalMove: false,
      click: true,
      wheel: false,
    },
  })
  // app.ticker.speed = 0.5
  // Listen for frame updates
  app.ticker.add(() => {
    const dt = app.ticker.deltaMS * 0.001
    actionManager.update(dt)
    GameWorld.Instance.update(dt)
  })
  Object.assign(app.canvas.style, {
    width: `${window.innerWidth}px`,
    // height: `${window.innerHeight}px`,
    overflow: 'hidden',
  })

  const gameDiv = document.getElementById(id)
  gameDiv.appendChild(app.canvas)
}

export function initWorld() {
  GameWorld.Instance.systems.add(RenderSystem)
  GameWorld.Instance.systems.add(GUISystem)
  GameWorld.Instance.systems.configureOnce(RenderSystem)
  GameWorld.Instance.systems.configureOnce(GUISystem)
}
