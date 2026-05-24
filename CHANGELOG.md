# Changelog

All notable changes to this project will be documented here.

## [1.0.0] - 2026-05-24

First functional release.

### Added

- Morse tree binary structure (`morse-tree.js`) covering all 26 letters (A-Z)
- Decoder module (`decoder.js`) — navigates the tree by dot/dash sequence
- Input handler (`input.js`) — detects tap vs tap-and-hold via Pointer Events API
- Audio module (`audio.js`) — plays a 600Hz sine tone on each dot/dash using Web Audio API
- Timer utilities (`timer.js`) — standard Morse timing thresholds (dot < 200ms, dash >= 200ms, letter gap 800ms, word gap 2000ms)
- Tree renderer (`tree-renderer.js`) — fixed CSS Grid layout (9×9) with SVG overlay for connection lines, matching the physical gadget layout
- Display module (`display.js`) — shows current dot/dash sequence and accumulated decoded text
- Active node highlight (LED-style) as user inputs signals
- Clear button to reset decoded output
- 17 unit tests covering decoder, tree structure, and timing logic
