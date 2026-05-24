# Morse Code Learn

A browser-based app to learn and practice Morse code, inspired by a real-world physical gadget.

## How it works

The interface replicates the gadget's Morse tree — a visual map of all letters organized by their dot/dash sequences. As you tap the button, the corresponding node lights up in real time.

- **Tap** (short press) → dot (`.`)
- **Tap and hold** (long press) → dash (`-`)
- **Pause** (~800ms) → confirms the current letter
- **Long pause** (~2000ms) → adds a word space

Audio feedback plays on every tap using the Web Audio API.

## Timing thresholds

| Action     | Duration        |
|------------|-----------------|
| Dot        | < 200ms         |
| Dash       | >= 200ms        |
| Letter gap | 800ms no input  |
| Word gap   | 2000ms no input |

## Getting started

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

## Scripts

| Command         | Description              |
|-----------------|--------------------------|
| `npm run dev`   | Start development server |
| `npm run build` | Production build         |
| `npm test`      | Run unit tests           |

## Project structure

```
src/
├── core/
│   ├── morse-tree.js     # binary tree structure (A-Z)
│   ├── decoder.js        # navigates tree by dot/dash sequence
│   ├── input.js          # tap vs hold detection via pointer events
│   └── audio.js          # tone synthesis via Web Audio API
├── ui/
│   ├── tree-renderer.js  # renders the morse tree (CSS grid + SVG lines)
│   ├── display.js        # updates sequence and decoded text
│   └── styles.css
├── utils/
│   └── timer.js          # timing helpers and threshold constants
└── main.js               # entry point
tests/
├── decoder.test.js
├── morse-tree.test.js
└── timer.test.js
```

## Tech stack

- Vanilla JS (ES modules)
- Vite — dev server and bundler
- Vitest — unit testing
- Web Audio API — sound synthesis
- CSS Grid + SVG — tree layout and connection lines
