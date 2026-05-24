import { MORSE_TREE } from '../core/morse-tree.js';

const COLS = 9;
const ROWS = 9;

// Desktop baseline dimensions
const BASE_CELL_W = 80;
const BASE_CELL_H = 48;

// On mobile the vertical gaps can be much tighter
const MIN_CELL_H = 28;

const GRID_NODES = [
  { letter: 'O', col: 2, row: 2, shape: 'rect'   },
  { letter: 'M', col: 3, row: 2, shape: 'rect'   },
  { letter: 'T', col: 4, row: 2, shape: 'rect'   },
  { letter: 'Q', col: 2, row: 4, shape: 'rect'   },
  { letter: 'G', col: 3, row: 4, shape: 'circle' },
  { letter: 'Z', col: 3, row: 5, shape: 'circle' },
  { letter: 'Y', col: 2, row: 6, shape: 'rect'   },
  { letter: 'K', col: 3, row: 6, shape: 'rect'   },
  { letter: 'N', col: 4, row: 6, shape: 'circle' },
  { letter: 'C', col: 3, row: 7, shape: 'circle' },
  { letter: 'X', col: 3, row: 8, shape: 'rect'   },
  { letter: 'D', col: 4, row: 8, shape: 'circle' },
  { letter: 'B', col: 4, row: 9, shape: 'circle' },
  { letter: 'E', col: 6, row: 2, shape: 'circle' },
  { letter: 'I', col: 7, row: 2, shape: 'circle' },
  { letter: 'S', col: 8, row: 2, shape: 'circle' },
  { letter: 'H', col: 9, row: 2, shape: 'circle' },
  { letter: 'U', col: 7, row: 3, shape: 'rect'   },
  { letter: 'V', col: 8, row: 3, shape: 'rect'   },
  { letter: 'F', col: 7, row: 5, shape: 'circle' },
  { letter: 'A', col: 6, row: 6, shape: 'rect'   },
  { letter: 'R', col: 7, row: 6, shape: 'circle' },
  { letter: 'L', col: 8, row: 6, shape: 'circle' },
  { letter: 'W', col: 6, row: 8, shape: 'rect'   },
  { letter: 'P', col: 7, row: 8, shape: 'circle' },
  { letter: 'J', col: 6, row: 9, shape: 'rect'   },
];

const CONNECTIONS = [
  [5, 1, 5, 2],
  [4, 2, 5, 2], [5, 2, 6, 2],
  [2, 2, 3, 2], [3, 2, 4, 2],
  [6, 2, 7, 2], [7, 2, 8, 2], [8, 2, 9, 2],
  [3, 2, 3, 4], [2, 4, 3, 4], [3, 4, 3, 5],
  [7, 2, 7, 3], [7, 3, 8, 3], [8, 2, 8, 3], [7, 3, 7, 5],
  [4, 2, 4, 6], [2, 6, 3, 6], [3, 6, 4, 6], [3, 6, 3, 7],
  [6, 2, 6, 6], [6, 6, 7, 6], [7, 6, 8, 6],
  [4, 6, 4, 8], [3, 8, 4, 8], [4, 8, 4, 9],
  [6, 6, 6, 8], [6, 8, 7, 8], [6, 8, 6, 9],
];

/**
 * Renders the Morse tree, rebuilding SVG and grid on resize
 * so cell size — and therefore font size — adapts to available width.
 *
 * @param {HTMLElement} container
 * @returns {{ highlight: (sequence: Array<'dot'|'dash'>) => void, reset: () => void }}
 */
export function renderTree(container) {
  const nodeMap = new Map();
  let wrapper = null;

  function build() {
    const available = container.clientWidth || window.innerWidth;

    // cellW drives horizontal fit; cap at BASE_CELL_W so desktop stays original size
    const cellW = Math.min(BASE_CELL_W, Math.floor(available / COLS));
    const scale  = cellW / BASE_CELL_W;
    const cellH  = Math.max(MIN_CELL_H, Math.floor(BASE_CELL_H * scale));

    const totalW = COLS * cellW;
    const totalH = ROWS * cellH;

    // Node and font sizes scale with cellW
    const nodeSize = Math.max(20, Math.floor(34 * scale));
    const fontSize = Math.max(10, Math.floor(13 * scale));

    function cx(col) { return (col - 1) * cellW + cellW / 2; }
    function cy(row) { return (row - 1) * cellH + cellH / 2; }

    container.innerHTML = '';
    nodeMap.clear();

    wrapper = document.createElement('div');
    wrapper.className = 'tree-wrapper';
    wrapper.style.width  = `${totalW}px`;
    wrapper.style.height = `${totalH}px`;

    // SVG layer
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width',  totalW);
    svg.setAttribute('height', totalH);
    svg.setAttribute('class', 'tree-svg');

    for (const [c1, r1, c2, r2] of CONNECTIONS) {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', cx(c1)); line.setAttribute('y1', cy(r1));
      line.setAttribute('x2', cx(c2)); line.setAttribute('y2', cy(r2));
      line.setAttribute('class', 'tree-line');
      svg.appendChild(line);
    }

    
    // Antenna symbol:
    //  \  |  /
    //   \ | /
    //    \|/
    //     |
    const ax      = cx(5);
    const juncY   = cy(1) + cellH * 0.1;   // \|/ junction
    const mastBot = cy(2) - cellH * 0.1;   // bottom of mast → connects to tree
    const tipY    = cy(1) - cellH * 0.32;  // top of arms and center line
    const armW    = cellW * 0.32;

    const antSegs = [
      [ax, mastBot, ax,        juncY],   // mast (below junction)
      [ax, juncY,   ax,        tipY ],   // center line (above junction)
      [ax, juncY,   ax - armW, tipY ],   // left arm  \
      [ax, juncY,   ax + armW, tipY ],   // right arm /
      [ax - armW,   tipY, ax + armW, tipY], // top bar closing the shape
    ];

    for (const [x1, y1, x2, y2] of antSegs) {
      const l = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      l.setAttribute('x1', x1); l.setAttribute('y1', y1);
      l.setAttribute('x2', x2); l.setAttribute('y2', y2);
      l.setAttribute('class', 'tree-line');
      svg.appendChild(l);
    }

    wrapper.appendChild(svg);

    // Grid layer
    const grid = document.createElement('div');
    grid.className = 'tree-grid';
    grid.style.gridTemplateColumns = `repeat(${COLS}, ${cellW}px)`;
    grid.style.gridTemplateRows    = `repeat(${ROWS}, ${cellH}px)`;

    for (const def of GRID_NODES) {
      const el = document.createElement('div');
      el.className = `tree-node tree-node--${def.shape}`;
      el.textContent = def.letter;
      el.dataset.letter = def.letter;
      el.style.gridColumn = def.col;
      el.style.gridRow    = def.row;
      el.style.width      = `${nodeSize}px`;
      el.style.height     = `${nodeSize}px`;
      el.style.fontSize   = `${fontSize}px`;
      nodeMap.set(def.letter, el);
      grid.appendChild(el);
    }

    wrapper.appendChild(grid);
    container.appendChild(wrapper);
    container.style.height = `${totalH + 16}px`;
  }

  build();
  window.addEventListener('resize', build);

  function highlight(sequence) {
    nodeMap.forEach(el => el.classList.remove('active'));
    let node = MORSE_TREE;
    for (const signal of sequence) node = node?.[signal];
    if (node?.letter) nodeMap.get(node.letter)?.classList.add('active');
  }

  function reset() {
    nodeMap.forEach(el => el.classList.remove('active'));
  }

  return { highlight, reset };
}
