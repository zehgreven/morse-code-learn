import { MORSE_TREE } from './morse-tree.js';

/**
 * Navigates the Morse tree based on a sequence of 'dot' and 'dash' signals.
 * @param {Array<'dot' | 'dash'>} sequence
 * @returns {{ letter: string | null, node: object | null }}
 */
export function decode(sequence) {
  let node = MORSE_TREE;

  for (const signal of sequence) {
    if (!node) return { letter: null, node: null };
    node = node[signal];
  }

  return {
    letter: node?.letter ?? null,
    node: node ?? null,
  };
}
