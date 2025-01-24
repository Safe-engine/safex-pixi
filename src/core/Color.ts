import { Color } from 'pixi.js';

export function Color4B(r: number, g: number, b: number, a: number) {
  return new Color({ r, g, b, a })
}

export type Color4B = ReturnType<typeof Color4B>
