import { NodeComp } from '../components/NodeComp'

export class NodePool {
  items: NodeComp[] = []

  put(node: NodeComp) {
    if (node) {
      node.active = false
      node.removeFromParent()
      this.items.push(node)
    }
  }

  get(): NodeComp {
    const node = this.items.pop()
    node.active = true
    return node
  }

  size() {
    return this.items.length
  }

  clear() {
    this.items.forEach((node) => node.destroy())
    this.items.length = 0
  }
}
