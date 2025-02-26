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

## Basic Example

```tsx game.ts
import { addGameCanvasTo, loadScene, startGameSystems } from '@safe-engine/pixi'
async function start() {
  await addGameCanvasTo('canvasId')
  startGameSystems()
  loadScene(GameScene)
}
start()
```

```tsx GameScene.tsx
import { SceneComponent, LabelComp, ButtonComp, SpriteRender } from '@safe-engine/pixi'

export class GameScene extends ComponentX {
  sprite: SpriteRender

  onPress() {
    this.sprite.spriteFrame = 'other.sprite.png'
  }

  render() {
    return (
      <SceneComponent>
        <LabelComp node={{ x: 106, y: 240 }} string="Hello safex" font={defaultFont} />
        <SpriteRender $ref={this.sprite} node={{ x: 500, y: 600 }} spriteFrame={'path/to/sprite.png'}>
          <ButtonComp onPress={this.onPress} />
        </SpriteRender>
      </SceneComponent>
    )
  }
}
```

## Contributing

We welcome all contributions! If you have ideas or want to improve the engine, feel free to create an issue or submit a pull request on GitHub.

## Contact

- GitHub: [safex-pixi](https://github.com/Safe-engine/safex-pixi)

Let's build a powerful and convenient game engine together! 🚀
