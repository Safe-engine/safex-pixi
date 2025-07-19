import { Assets } from 'pixi.js'

const jsonCache = {}
export async function loadJsonAsync<T>(filePath: string): Promise<T> {
  const json = await Assets.load(filePath)
  jsonCache[filePath] = json
  return json
}

export function loadJsonFromCache<T>(filePath: string): T {
  return jsonCache[filePath]
}
