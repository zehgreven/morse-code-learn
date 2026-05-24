import { MORSE_TREE } from '../core/morse-tree.js';

// Grid cell dimensions — must match CSS
const CELL_W = 80;
const CELL_H = 48;

// Total grid size: 9 cols x 8 rows + 1 extra row for antenna
const COLS = 9;
const ROWS = 9; // row 0 = antenna row, rows 1-8 = nodes

/**
 * Grid layout derived from doc/layout.txt
 * col/row are 1-based, matching CSS grid-column/grid-row (offset by 1 row for antenna)
 */
const GRID_NODES = [
  // Left side (dash branches)
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
  // Right side (dot branches)
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

/**
 * Connections derived from doc/layout.txt.
 * Each entry is [colA, rowA, colB, rowB] — center-to-center.
 */
const CONNECTIONS = [
  // Antenna to center axis (col 5, row 1 → row 2)
  [5, 1, 5, 2],

  // T connects to center axis
  [4, 2, 5, 2],
  // E connects to center axis
  [5, 2, 6, 2],

  // Horizontal: O-M-T (row 2)
  [2, 2, 3, 2],
  [3, 2, 4, 2],

  // Horizontal: E-I-S-H (row 2)
  [6, 2, 7, 2],
  [7, 2, 8, 2],
  [8, 2, 9, 2],

  // M down to G (col 3, row 2→4)
  [3, 2, 3, 4],
  // Horizontal: Q-G (row 4)
  [2, 4, 3, 4],
  // G down to Z (col 3, row 4→5)
  [3, 4, 3, 5],

  // I down to U (col 7, row 2→3)
  [7, 2, 7, 3],
  // Horizontal: U-V (row 3) — S connects to V
  [7, 3, 8, 3],
  // S down to V
  [8, 2, 8, 3],
  // U down to F (col 7, row 3→5)
  [7, 3, 7, 5],

  // T down to N via col 4 (row 2→6)
  [4, 2, 4, 6],
  // Horizontal: Y-K-N (row 6)
  [2, 6, 3, 6],
  [3, 6, 4, 6],
  // K down to C (col 3, row 6→7)
  [3, 6, 3, 7],

  // E down to A via col 6 (row 2→6)
  [6, 2, 6, 6],
  // Horizontal: A-R-L (row 6)
  [6, 6, 7, 6],
  [7, 6, 8, 6],

  // N down to D (col 4, row 6→8)
  [4, 6, 4, 8],
  // Horizontal: X-D (row 8)
  [3, 8, 4, 8],
  // D down to B (col 4, row 8→9)
  [4, 8, 4, 9],

  // A down to W via col 6 (row 6→8)
  [6, 6, 6, 8],
  // Horizontal: W-P (row 8)
  [6, 8, 7, 8],
  // W down to J (col 6, row 8→9)
  [6, 8, 6, 9],
];

/** Convert 1-based grid col/row to SVG pixel center coordinates */
function cx(col) { return (col - 1) * CELL_W + CELL_W / 2; }
function cy(row) { return (row - 1) * CELL_H + CELL_H / 2; }

/**
 * Renders the Morse tree as a fixed CSS grid with SVG connection lines.
 *
 * @param {HTMLElement} container
 * @returns {{ highlight: (sequence: Array<'dot'|'dash'>) => void, reset: () => void }}
 */
export function renderTree(container) {
  const nodeMap = new Map();

  container.innerHTML = '';

  const wrapper = document.createElement('div');
  wrapper.className = 'tree-wrapper';

  // SVG layer for connection lines (behind nodes)
  const svgW = COLS * CELL_W;
  const svgH = ROWS * CELL_H;
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', svgW);
  svg.setAttribute('height', svgH);
  svg.setAttribute('class', 'tree-svg');

  for (const [c1, r1, c2, r2] of CONNECTIONS) {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', cx(c1));
    line.setAttribute('y1', cy(r1));
    line.setAttribute('x2', cx(c2));
    line.setAttribute('y2', cy(r2));
    line.setAttribute('class', 'tree-line');
    svg.appendChild(line);
  }

  // Antenna label at col 5, row 1
  const antennaText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  antennaText.setAttribute('x', cx(5));
  antennaText.setAttribute('y', cy(1));
  antennaText.setAttribute('class', 'tree-antenna-label');
  antennaText.textContent = 'ANT';
  svg.appendChild(antennaText);

  wrapper.appendChild(svg);

  // Grid layer for node elements
  const grid = document.createElement('div');
  grid.className = 'tree-grid';

  for (const def of GRID_NODES) {
    const el = document.createElement('div');
    el.className = `tree-node tree-node--${def.shape}`;
    el.textContent = def.letter;
    el.dataset.letter = def.letter;
    el.style.gridColumn = def.col;
    el.style.gridRow = def.row;
    nodeMap.set(def.letter, el);
    grid.appendChild(el);
  }

  wrapper.appendChild(grid);
  container.appendChild(wrapper);

  function highlight(sequence) {
    nodeMap.forEach(el => el.classList.remove('active'));
    let node = MORSE_TREE;
    for (const signal of sequence) {
      node = node?.[signal];
    }
    if (node?.letter) {
      nodeMap.get(node.letter)?.classList.add('active');
    }
  }

  function reset() {
    nodeMap.forEach(el => el.classList.remove('active'));
  }

  return { highlight, reset };
}
