import { GameWorld } from '@safe-engine/core'
import { Constructor, System } from 'entityx-ts'
import { Application } from 'pixi.js'
import { actionManager } from 'pixi-action-ease'

import { NodeComp } from './components/NodeComp'

export const app = new Application({
  width: 1080,
  height: 1920,
  antialias: true,
  resolution: window.devicePixelRatio,
})

export function setupResolution(designedResolution = { width: 720, height: 1280 }) {
  const { width, height } = designedResolution
  app.renderer.resize(width, height)
}

export async function addGameCanvasTo(id = 'game') {
  Object.assign(app.view.style, {
    width: `${window.innerWidth}px`,
    // height: `${window.innerHeight}px`,
    overflow: 'hidden',
  })

  const gameDiv = document.getElementById(id)
  gameDiv.appendChild(app.view as never)
  GameWorld.Instance.setup(NodeComp, app.stage)
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

export function startGameWithSystems(systemsList: Constructor<System>[]) {
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
