import './ui/styles.css';
import { attachInput } from './core/input.js';
import { decode } from './core/decoder.js';
import { startTone, stopTone } from './core/audio.js';
import { createDisplay } from './ui/display.js';
import { renderTree } from './ui/tree-renderer.js';

const btn = document.getElementById('morse-btn');
const clearBtn = document.getElementById('clear-btn');
const treeContainer = document.getElementById('tree');

const display = createDisplay({
  sequenceEl: document.getElementById('sequence'),
  outputEl: document.getElementById('output'),
});

const tree = renderTree(treeContainer);

let currentSequence = [];

const input = attachInput(btn);

btn.addEventListener('morse:pressstart', () => startTone());
btn.addEventListener('morse:pressend', () => stopTone());

btn.addEventListener('morse:signal', (e) => {
  const { signal } = e.detail;
  currentSequence.push(signal);

  display.updateSequence(currentSequence);
  tree.highlight(currentSequence);

  btn.classList.add('pressed');
  setTimeout(() => btn.classList.remove('pressed'), 150);
});

btn.addEventListener('morse:letter', (e) => {
  const { sequence } = e.detail;
  const { letter } = decode(sequence);
  display.appendLetter(letter);
  display.updateSequence([]);
  tree.reset();
  currentSequence = [];
});

btn.addEventListener('morse:word', () => {
  display.appendSpace();
});

function handleClear() {
  display.clear();
  tree.reset();
  currentSequence = [];
}

clearBtn.addEventListener('click', handleClear);

window.addEventListener('keydown', (e) => {
  if (e.code === 'Backspace') {
    e.preventDefault();
    handleClear();
  }
});
