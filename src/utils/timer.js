/** Timing thresholds (standard Morse literature) */
export const THRESHOLDS = {
  DOT_MAX_MS: 200,      // tap shorter than this = dot
  LETTER_GAP_MS: 800,   // silence after this = end of letter
  WORD_GAP_MS: 2000,    // silence after this = end of word
};

/**
 * Returns 'dot' or 'dash' based on press duration.
 * @param {number} durationMs
 * @returns {'dot' | 'dash'}
 */
export function classifyPress(durationMs) {
  return durationMs < THRESHOLDS.DOT_MAX_MS ? 'dot' : 'dash';
}
