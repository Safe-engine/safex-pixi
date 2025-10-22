import { GameWorld } from '../../base'
import { Collider } from '../CollideComponent'
import { CollideSystem } from '../CollideSystem'

export function shouldCollider(colA: Collider, colB: Collider) {
  const groupA = colA.props.tag
  const groupB = colB.props.tag
  if (groupA === undefined || groupB === undefined) {
    return true
  }
  const { colliderMatrix } = GameWorld.Instance.systems.get(CollideSystem)
  return colliderMatrix[groupA][groupB]
}

export function getMin(arr: number[]): number | null {
  if (arr.length === 0) return null

  let min = arr[0]
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < min) {
      min = arr[i]
    }
  }
  return min
}

export function getMax(arr: number[]): number | null {
  if (arr.length === 0) return null

  let max = arr[0]
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > max) {
      max = arr[i]
    }
  }
  return max
}
