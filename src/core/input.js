import { classifyPress, THRESHOLDS } from '../utils/timer.js';

/**
 * Attaches Morse input handling to a DOM element.
 *
 * Emits custom events on the element:
 *   - 'morse:signal'  → detail: { signal: 'dot' | 'dash' }
 *   - 'morse:letter'  → detail: { sequence: Array<'dot'|'dash'> }
 *   - 'morse:word'    → (no detail)
 *
 * @param {HTMLElement} element
 * @returns {{ destroy: () => void }} cleanup function
 */
export function attachInput(element) {
  let pressStart = null;
  let letterTimer = null;
  let wordTimer = null;
  let sequence = [];

  function clearTimers() {
    clearTimeout(letterTimer);
    clearTimeout(wordTimer);
  }

  function scheduleLetterEnd() {
    clearTimers();
    letterTimer = setTimeout(() => {
      if (sequence.length > 0) {
        element.dispatchEvent(new CustomEvent('morse:letter', { detail: { sequence: [...sequence] } }));
        sequence = [];
      }
      wordTimer = setTimeout(() => {
        element.dispatchEvent(new CustomEvent('morse:word'));
      }, THRESHOLDS.WORD_GAP_MS - THRESHOLDS.LETTER_GAP_MS);
    }, THRESHOLDS.LETTER_GAP_MS);
  }

  function onPressStart(e) {
    e.preventDefault();
    clearTimers();
    pressStart = Date.now();
  }

  function onPressEnd(e) {
    e.preventDefault();
    if (pressStart === null) return;

    const duration = Date.now() - pressStart;
    pressStart = null;

    const signal = classifyPress(duration);
    sequence.push(signal);

    element.dispatchEvent(new CustomEvent('morse:signal', { detail: { signal } }));
    scheduleLetterEnd();
  }

  element.addEventListener('pointerdown', onPressStart);
  element.addEventListener('pointerup', onPressEnd);
  element.addEventListener('pointerleave', onPressEnd);

  return {
    destroy() {
      clearTimers();
      element.removeEventListener('pointerdown', onPressStart);
      element.removeEventListener('pointerup', onPressEnd);
      element.removeEventListener('pointerleave', onPressEnd);
    },
  };
}
