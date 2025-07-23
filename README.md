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
- Example `<SpriteRender node={{ xy: [5, 9] }} />`
- `$ref` bind component with current class property as string
- `$push` push component to list
- `$refNode` and `$pushNode` for `NodeComp` component from any component.
- `Array(2).map(_, i)` iteration repeat component 2 times
- `Loading.listItems.map(item, i = 1)` iteration in class static property
- `listItems.map(item, i)` iteration in const variable

## Benefits

- **Rapid Development:** JSX makes writing code clean and intuitive.
- **Extensibility:** Easily add new features and functionalities.
- **Web Developer Friendly:** If you're familiar with React, you'll quickly get up to speed with Safex.

## Installation

```sh
npm install @safe-engine/pixi
```

# Show case

```sh
  git clone https://github.com/Safe-engine/pixi-safe-engine-demo
```

## Basic Example

```tsx GameScene.tsx
import { SceneComponent, LabelComp, ButtonComp, SpriteRender, instantiate } from '@safe-engine/pixi'
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
        <LabelComp $ref={this.label} node={{ xy: [106, 240] }} string="Hello safex" font={defaultFont} />
        <SpriteRender $ref={this.sprite} node={{ xy: [500, 600] }} spriteFrame={'path/to/sprite.png'}>
          <ButtonComp onPress={this.onPress} />
        </SpriteRender>
      </SceneComponent>
    )
  }
}
```

## Collider Events

```tsx
import { BoxCollider, Collider, ComponentX, SpriteRender } from '@safe-engine/pixi'
import { sf_crash } from '../assets'

export class ColliderSprite extends ComponentX {
  onCollisionEnter(other: Collider) {
    console.log(other.props.tag)
  }

  render() {
    return (
      <SpriteRender node={{ xy: [640, 360] }} spriteFrame={sf_crash}>
        <BoxCollider height={100} width={100}></BoxCollider>
      </SpriteRender>
    )
  }
}
```

## Physics Events

```tsx
import { ComponentX, SpriteRender } from '@safe-engine/pixi'
import { DynamicBody, PhysicsBoxCollider, RigidBody } from '@safe-engine/pixi/dist/box2d-wasm'
import { sf_crash } from '../assets'

export class PhysicsCollider extends ComponentX {
  onBeginContact(other: RigidBody) {
    console.log('onBeginContact', other)
  }

  render() {
    return (
      <SpriteRender node={{ xy: [640, 360] }} spriteFrame={sf_crash}>
        <RigidBody type={DynamicBody} onBeginContact={this.onBeginContact}></RigidBody>
        <PhysicsBoxCollider height={100} width={100}></PhysicsBoxCollider>
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
