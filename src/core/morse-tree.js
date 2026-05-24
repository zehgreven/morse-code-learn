/**
 * Morse binary tree.
 * Each node: { letter, dot (right), dash (left) }
 * Navigation: dot = right child, dash = left child
 * Derived from doc/layout.json
 */
export const MORSE_TREE = {
  letter: null,
  dash: {
    letter: 'T',
    dash: {
      letter: 'M',
      dash: { letter: 'O', dash: null, dot: null },
      dot: {
        letter: 'G',
        dash: { letter: 'Q', dash: null, dot: null },
        dot: { letter: 'Z', dash: null, dot: null },
      },
    },
    dot: {
      letter: 'N',
      dash: {
        letter: 'K',
        dash: { letter: 'Y', dash: null, dot: null },
        dot: { letter: 'C', dash: null, dot: null },
      },
      dot: {
        letter: 'D',
        dash: { letter: 'X', dash: null, dot: null },
        dot: { letter: 'B', dash: null, dot: null },
      },
    },
  },
  dot: {
    letter: 'E',
    dash: {
      letter: 'A',
      dash: {
        letter: 'W',
        dash: { letter: 'J', dash: null, dot: null },
        dot: { letter: 'P', dash: null, dot: null },
      },
      dot: {
        letter: 'R',
        dash: null,
        dot: { letter: 'L', dash: null, dot: null },
      },
    },
    dot: {
      letter: 'I',
      dash: {
        letter: 'U',
        dash: null,
        dot: { letter: 'F', dash: null, dot: null },
      },
      dot: {
        letter: 'S',
        dash: { letter: 'V', dash: null, dot: null },
        dot: { letter: 'H', dash: null, dot: null },
      },
    },
  },
};
