import { NodeComp } from '../components/NodeComp'

export * from './EnhancedComponent'
export * from './gworld'
export * from './utils'

export interface BaseComponentProps<T> {
  $ref?: T
  $push?: T[]
  $refNode?: NodeComp
  $pushNode?: NodeComp[]
  node?: Partial<NodeComp>
  // [$key: `$${string}`]: string
}
