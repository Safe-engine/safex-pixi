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

export function clampf(theta: number, arg1: number, arg2: number): number {
  if (theta < arg1) {
    return arg1
  } else if (theta > arg2) {
    return arg2
  }
  return theta
}
