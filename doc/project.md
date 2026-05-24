# Morse Code Learn

This is an app for people to learn/practice morse code.

It can be used on Browser.

In the [layout](./layout.png) file you can see a sketch.

A "tap" in the button represents a dot.
A "tap and hold" represents a dash.

System also reproduces a "morse sound" when the button is tapped.

## Timing Thresholds (standard Morse literature)

| Action         | Duration        |
|----------------|-----------------|
| Dot (tap)      | < 200ms         |
| Dash (hold)    | >= 200ms        |
| Letter gap     | 800ms no input  |
| Word gap       | 2000ms no input |

## Rendering

- Morse tree rendered with HTML/CSS (flexbox/grid)
- Nodes: circle = dot-reached letter, rectangle = dash-reached letter
- Active node highlighted via LED-style indicator

## Architecture

```
src/
├── core/
│   ├── morse-tree.js     # tree structure derived from layout.json
│   ├── decoder.js        # navigates tree based on dots/dashes
│   ├── input.js          # tap vs tap-and-hold detection (pointer events)
│   └── audio.js          # tone synthesis via Web Audio API
├── ui/
│   ├── tree-renderer.js  # renders the morse tree in HTML/CSS
│   ├── display.js        # updates current letter and accumulated word
│   └── styles.css
├── utils/
│   └── timer.js          # timing helpers and threshold constants
└── main.js               # entry point
```
