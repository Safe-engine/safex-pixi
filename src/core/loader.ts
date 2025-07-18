import { Assets } from 'pixi.js'

export function loadAll(assets: string[] = [], cb: (progress: number) => void) {}

const jsonCache = {}
export async function loadJsonAsync<T>(filePath: string): Promise<T> {
  const json = await Assets.load(filePath)
  jsonCache[filePath] = json
  return json
}

export function loadJsonFromCache<T>(filePath: string): T {
  return jsonCache[filePath]
}
