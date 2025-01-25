import { app } from "../app"

export function pauseAll() {
  app.ticker.stop()
}

export function resumeAll() {
  app.ticker.start()
}
