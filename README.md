# Guide
- all components must be extends from `ComponentX` or `NoRenderComponentX`
- `NoRenderComponentX` will append to component of parent node have `ComponentX`, `ComponentX` will be `addChild` to parent node
- `node` property represent node, and can pass properties to assign
- example ```<SpriteRender node={{ x: 5, y: 9 }} />```
- `$ref` bind component with current class property as string
- `$push` push component to list
- `Array(2).map(_, i)` iteration repeat component 2 times
- `Loading.listItems.map(item, i)` iteration in static property
- `listItems.map(item, i)` iteration in const variable
