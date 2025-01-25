import { Constructor, System, World } from 'entityx-ts'

export class GameWorld extends World {
  listUpdate: (System | Constructor<System>)[] = []
  update(dt: number) {
    this.listUpdate.forEach((system: any) => {
      this.systems.update(system, dt)
    })
  }

  private static _instance: GameWorld

  public static get Instance() {
    // Do you need arguments? Make it a regular static method instead.
    return this._instance || (this._instance = new this())
  }
}
