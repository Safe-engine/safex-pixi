# Safex = JSX + PixiJS Game Engine

## Introduction

Safex is an open-source game engine written in TypeScript, combining the power of JSX syntax with the renowned PixiJS rendering library. This project aims to help game developers build games quickly, easily, and intuitively.

## Key Features

- **JSX Syntax:** Write UI and game logic in a React-like style for better code organization and readability.
- **Powered by PixiJS:** Utilize PixiJS for high-performance 2D rendering.
- **Component-based Architecture:** Easily manage game elements such as scenes, sprites, and animations.
- **Asset Loading Support:** Quickly load images, sounds, and spritesheets.
- All components must be extends from `ComponentX` or `NoRenderComponentX`
- `NoRenderComponentX` will append to component of parent node have `ComponentX`, `ComponentX` will be `addChild` to parent node
- `node` property represent node, and can pass properties to assign
- Example `<SpriteRender node={{ x: 5, y: 9 }} />`
- `$ref` bind component with current class property as string
- `$push` push component to list
- `Array(2).map(_, i)` iteration repeat component 2 times
- `Loading.listItems.map(item, i)` iteration in static property
- `listItems.map(item, i)` iteration in const variable

## Benefits

- **Rapid Development:** JSX makes writing code clean and intuitive.
- **Extensibility:** Easily add new features and functionalities.
- **Web Developer Friendly:** If you're familiar with React, you'll quickly get up to speed with Safex.

## Installation

```sh
npm install @safe-engine/pixi
```

# dependencies

```json
  "dependencies": {
    "safex": "npm:@safe-engine/pixi"
  },
```

## Basic Example

```tsx game.ts
import { addGameCanvasTo, loadScene, startGameSystems } from 'safex'
async function start() {
  await addGameCanvasTo('canvasId')
  startGameSystems()
  loadScene(GameScene)
}
start()
```

```tsx GameScene.tsx
import { SceneComponent, LabelComp, ButtonComp, SpriteRender, instantiate } from 'safex'
import ColliderSprite from './ColliderSprite'

export class GameScene extends ComponentX {
  sprite: SpriteRender
  label: LabelComp

  onPress() {
    this.sprite.spriteFrame = 'other.sprite.png'
    this.label.string = 'Pressed'
  }

  onTouchMove(event: FederatedPointerEvent) {
    console.log('onTouchMove', event.global)
    const sprite = instantiate(ColliderSprite)
    sprite.node.x = event.global.x
    sprite.node.y = event.global.y
    this.node.addChild(sprite)
  }

  render() {
    return (
      <SceneComponent>
        <TouchEventRegister
          // onTouchStart={this.onTouchStart}
          // onTouchEnd={this.onTouchEnd}
          onTouchMove={this.onTouchMove}
        />
        <LabelComp $ref={this.label} node={{ x: 106, y: 240 }} string="Hello safex" font={defaultFont} />
        <SpriteRender $ref={this.sprite} node={{ x: 500, y: 600 }} spriteFrame={'path/to/sprite.png'}>
          <ButtonComp onPress={this.onPress} />
        </SpriteRender>
      </SceneComponent>
    )
  }
}
```

## Collider Events

```tsx
import { BoxCollider, Collider, ComponentX, SpriteRender } from 'safex'
import { sf_crash } from '../assets'

export class ColliderSprite extends ComponentX {
  onCollisionEnter(other: Collider) {
    console.log(other.tag)
  }

  render() {
    return (
      <SpriteRender node={{ x: 640, y: 360 }} spriteFrame={sf_crash}>
        <BoxCollider height={100} width={100}></BoxCollider>
      </SpriteRender>
    )
  }
}
```

## Physics Events

```tsx
import { BoxColliderPhysics, ColliderPhysics, RigidBody, ComponentX, SpriteRender } from 'safex'
import { sf_crash } from '../assets'

export class ColliderPhysics extends ComponentX {
  onCollisionEnter(col: ColliderPhysics) {
    console.log('onCollisionEnter', col)
  }

  render() {
    return (
      <SpriteRender node={{ x: 640, y: 360 }} spriteFrame={sf_crash}>
        <RigidBody type="static"></RigidBody>
        <BoxColliderPhysics height={100} width={100}></BoxColliderPhysics>
      </SpriteRender>
    )
  }
}
```

## Contributing

We welcome all contributions! If you have ideas or want to improve the engine, feel free to create an issue or submit a pull request on GitHub.

## Contact

- [GitHub](https://github.com/Safe-engine/safex-pixi)
- [Discord](https://discord.com/channels/1344214207268388979/1344214208044208140)

Let's build a powerful and convenient game engine together! 🚀
