import { DEG_TO_RAD, RAD_TO_DEG } from 'pixi.js'

export function randomRangeInt(minInclude: Integer, maxExclude: Integer) {
  return Math.round(Math.random() * (maxExclude - minInclude - 1)) + minInclude
}

export function degreesToRadians(deg: Float) {
  return DEG_TO_RAD * deg
}

export function radiansToDegrees(rad: Float) {
  return RAD_TO_DEG * rad
}
