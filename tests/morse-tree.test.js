import { describe, it, expect } from 'vitest';
import { MORSE_TREE } from '../src/core/morse-tree.js';

describe('MORSE_TREE structure', () => {
  it('root has no letter', () => {
    expect(MORSE_TREE.letter).toBeNull();
  });

  it('root.dot is E', () => {
    expect(MORSE_TREE.dot.letter).toBe('E');
  });

  it('root.dash is T', () => {
    expect(MORSE_TREE.dash.letter).toBe('T');
  });

  it('all leaf nodes have null children', () => {
    function checkLeaves(node) {
      if (!node) return;
      if (!node.dot && !node.dash) {
        expect(node.dot).toBeNull();
        expect(node.dash).toBeNull();
      }
      checkLeaves(node.dot);
      checkLeaves(node.dash);
    }
    checkLeaves(MORSE_TREE);
  });
});
