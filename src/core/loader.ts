import { AssetsClass } from 'pixi.js'

const jsonCache = {}
export function loadJsonAsync<T>(Assets: AssetsClass) {
  return async (filePath: string): Promise<T> => {
    const json = await Assets.load(filePath)
    jsonCache[filePath] = json
    return json
  }
}

export function loadJsonFromCache<T>(filePath: string): T {
  return jsonCache[filePath]
}
