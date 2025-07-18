// import { app } from "../app"

import { GameWorld } from ".."

export function pauseAll() {
  GameWorld.Instance.app.ticker.stop()
}

export function resumeAll() {
  GameWorld.Instance.app.ticker.start()
}
