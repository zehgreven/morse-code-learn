/**
 * Manages the text display area (current sequence + decoded output).
 * @param {{ sequenceEl: HTMLElement, outputEl: HTMLElement }} elements
 */
export function createDisplay({ sequenceEl, outputEl }) {
  let output = '';

  return {
    updateSequence(sequence) {
      sequenceEl.textContent = sequence.map(s => s === 'dot' ? '·' : '−').join(' ');
    },

    appendLetter(letter) {
      if (letter) output += letter;
      outputEl.textContent = output;
    },

    appendSpace() {
      output += ' ';
      outputEl.textContent = output;
    },

    clear() {
      output = '';
      sequenceEl.textContent = '';
      outputEl.textContent = '';
    },
  };
}
