## todo to port from https://observablehq.com/@ndry/pull-push-puzzle-wip
- color map editor?
- pan n zoom?

## Todo from ohq
- spawner impl -- a static position in space, that spawns buttons of a given kind (a condition to spawn?)
- consumer impl -- a static position in space, that consumes all buttons of a given kind at that position
- compose a cyclic task
- write introduction and game goal text
- correctly display multiple buttons on a single position
- spawner in editor
- consumer in editor
- flip impl -- a button has a flippable multiplier +1/-1 applied on a force vector both from source and target
- flip rule editor
- merge impl -- a rule to transform button kinds like (buttonKind1, buttonKind2) => buttonKind3 if they are at the same position (and of the same flip?)
- merge rule editor
- ?? annihilation impl -- a rule to annihilate two buttons if they are at the same position
- ?? appearance impl -- a rule to create a new button (if two buttons get on the same position? a button splits into two as some anti-annihilation?)
- <s>test</s>