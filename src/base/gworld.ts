import { Constructor, System, World } from 'entityx-ts'
import { Application, AssetsClass } from 'pixi.js'

export class GameWorld extends World {
  listUpdate: Constructor<System>[] = []
  app: Application
  assetManager: AssetsClass

  addSystemAndUpdate<T extends System>(system: Constructor<T>) {
    this.listUpdate.push(system)
    return this.systems.addThenConfigure(system)
  }

  update(dt: number) {
    this.listUpdate.forEach((system) => {
      this.systems.update(system, dt)
    })
  }

  private static _instance: GameWorld

  public static get Instance() {
    return this._instance || (this._instance = new this())
  }
}
